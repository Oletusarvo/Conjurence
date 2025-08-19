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
      const { eventId, position } = payload;
      //This may cause a race condition where an older position finishes later, making the event's position invalid.
      db('events.event_instance')
        .where({ id: eventId })
        .update({
          position: db.raw(
            `ST_SetSRID(
                ST_MakePoint(
                  ?,
                  ?
                ),
                4326
              )::geography`,
            [position.coords.longitude, position.coords.latitude]
          ),
          position_accuracy: position.coords.accuracy,
        })
        .then(() => {
          io.to(`event:${payload.eventId}`).emit('event:position_update', { eventId, position });
        });
    });
  });
};
