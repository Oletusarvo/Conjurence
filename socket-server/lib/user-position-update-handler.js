const db = require('../../dbconfig');

module.exports = async function userPositionUpdateHandler(io, socket, payload) {
  const { userId, position } = payload;

  const currentAttendance = await db('events.event_attendance')
    .where({ user_id: userId })
    .select('event_instance_id')
    .orderBy('requested_at', 'desc')
    .first();

  if (!currentAttendance) return;

  //Get the event position the user is attending

  //Measure the distance of the user to the event.

  //If currently joined or hosting, leave the event if outside of the geofence.

  //Otherwise if currently interested, join the event if inside the geofence.
};
