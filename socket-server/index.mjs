import db from '../dbconfig.js';

export const socketServer = io => {
  io.on('connection', socket => {
    console.log('New connection: ', socket.id);

    socket.on('join_room', async roomName => {
      socket.join(roomName);
    });

    socket.on('leave_room', roomName => {
      socket.leave(roomName);
    });

    //Ran when the location of user changes while hosting a mobile event.
    socket.on('event:position_update', async payload => {
      const { eventId, position, user_id } = payload;

      /*Make sure the user sending the update is the host of the event.
      const hostRecord = await db('events.event_attendance')
        .where({
          event_instance_id: eventId,
          user_id,
          attendance_status_id: db
            .select('id')
            .from('events.event_attendance_status')
            .where({ label: 'host' })
            .limit(1),
        })
        .select('user_id');

      if (!hostRecord || hostRecord.user_id !== user_id) {
        return;
      }*/

      //Fired and forgotten on purpose.
      db('positions.event_position')
        .where({ event_id: eventId })
        .update({
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
        });

      io.to(`event:${payload.eventId}`).emit('event:position_update', { eventId, position });
    });
  });
};
