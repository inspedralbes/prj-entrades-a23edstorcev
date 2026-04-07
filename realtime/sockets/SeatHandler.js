const lockingService = require('../services/LockingService');

module.exports = (io, socket) => {
  socket.on('seat.select', async (data) => {
    const { seatId } = data;
    const userId = socket.user.sub;

    console.log(`User ${userId} attempting to lock seat ${seatId}`);

    const result = await lockingService.lockSeat(seatId, userId);

    if (result.success) {
      // Confirm to the user
      socket.emit('lock.confirmed', {
        seat_id: seatId,
        expires_at: new Date(Date.now() + 600000).toISOString()
      });

      // Broadcast update to everyone
      io.emit('seat.updated', {
        id: seatId,
        status: 'LOCKED',
        u: userId,
        ts: Math.floor(Date.now() / 1000)
      });
    } else {
      socket.emit('lock.failed', {
        seat_id: seatId,
        error: result.error
      });
    }
  });
};
