const db = require('../../dbconfig');

module.exports = async function eventPositionUpdateHandler(io, socket, payload) {
  const { eventId, position, user_id } = payload;

  db('positions.event_position')
    .where({ event_id: eventId })
    .where(function () {
      this.where({ timestamp: null }).orWhere('timestamp', '<', position.timestamp);
    })
    .update(
      {
        coordinates: db.raw(
          `ST_SetSRID(
                ST_MakePoint(
                  ?,
                  ?
                ),
                4326
              )::geography`,
          [position.coords.longitude, position.coords.latitude]
        ),
        timestamp: position.timestamp,
        accuracy: position.coords.accuracy,
      },
      'timestamp'
    )
    .then(record => {
      if (!record) return;
      io.to(`event:${payload.eventId}`).emit('event:position_update', { eventId, position });
    });
};
