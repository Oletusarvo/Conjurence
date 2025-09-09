module.exports = async function joinRoomHandler(io, socket, roomName) {
  socket.join(roomName);
};
