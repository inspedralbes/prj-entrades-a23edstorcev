const lockingService = require('../services/LockingService');
const metricsService = require('../services/MetricsService');

module.exports = (io, socket) => {
  socket.on('seat.select', async (data) => {
    const { seatId, eventId } = data;
    const userId = socket.user.sub;

    if (!eventId) return;

    console.log(`User ${userId} attempting to lock seat ${seatId} for event ${eventId}`);

    const result = await lockingService.lockSeat(seatId, userId, eventId);

    if (result.success) {
      const status = result.action === 'LOCKED' ? 'LOCKED' : 'AVAILABLE';
      
      // Confirm to the user
      if (result.action === 'LOCKED') {
        socket.emit('lock.confirmed', {
          seat_id: seatId,
          event_id: eventId,
          expires_at: new Date(Date.now() + 600000).toISOString()
        });
      }

      // Broadcast update to everyone
      io.emit('seat.updated', {
        id: seatId,
        event_id: eventId,
        status: status,
        u: result.action === 'LOCKED' ? userId : null,
        ts: Math.floor(Date.now() / 1000)
      });
    } else {
      socket.emit('lock.failed', {
        seat_id: seatId,
        event_id: eventId,
        error: result.error
      });
    }
  });

  socket.on('lock.status', async (data) => {
    const { eventId } = data || {};
    if (!eventId) return;
    const userId = socket.user.sub;
    const locks = await lockingService.getUserLocks(userId, eventId);
    socket.emit('lock.status.result', locks);
  });

  socket.on('metrics.get', async (data) => {
    const { eventId } = data || {};
    if (!eventId) return;
    const stats = await metricsService.getLiveMetrics(eventId);
    socket.emit('metrics.update', {
      stats,
      connected: io.engine.clientsCount
    });
  });
};
