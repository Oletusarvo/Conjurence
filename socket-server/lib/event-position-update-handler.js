const db = require('../../dbconfig');

module.exports = async function eventPositionUpdateHandler(io, socket, payload) {
  const { eventId, position, user_id } = payload;

  //Fired and forgotten on purpose.
  db('positions.event_position')
    .where({ event_id: eventId })
    .where('timestamp', '<', position.timestamp)
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
      ['*']
    );

  io.to(`event:${payload.eventId}`).emit('event:position_update', { eventId, position });
};
