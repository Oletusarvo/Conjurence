module.exports = async function leaveRoomHandler(io, socket, roomName) {
  socket.leave(roomName);
};
