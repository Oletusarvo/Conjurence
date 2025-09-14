import db from '../dbconfig.js';
import eventPositionUpdateHandler from './lib/event-position-update-handler.js';
import joinRoomHandler from './lib/join-room-handler.js';
import leaveRoomHandler from './lib/leave-room-handler.js';
import userPositionUpdateHandler from './lib/user-position-update-handler.js';

export const socketServer = io => {
  io.on('connection', socket => {
    console.log('New connection: ', socket.id);

    socket.on('join_room', async roomName => await joinRoomHandler(io, socket, roomName));

    socket.on('leave_room', roomName => leaveRoomHandler(io, socket, roomName));

    //Ran when the user has the app in the background, and their position changes.
    socket.on(
      'user:position_update',
      async payload => await userPositionUpdateHandler(io, socket, payload)
    );

    //Ran when the location of a user changes while hosting a mobile event.
    socket.on(
      'event:position_update',
      async payload => await eventPositionUpdateHandler(io, socket, payload)
    );
  });
};
