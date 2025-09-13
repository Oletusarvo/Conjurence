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
    );

  //Omit broadcasting to the socket from which the event came.
  socket.to(`event:${payload.eventId}`).emit('event:position_update', { eventId, position });
};
