const lockingService = require('../services/LockingService');
const { createClient } = require('redis');

// Mock Redis Client
jest.mock('redis', () => {
  const mRedis = {
    connect: jest.fn().mockResolvedValue(),
    eval: jest.fn(),
    get: jest.fn(),
    hSet: jest.fn(),
    del: jest.fn(),
    hGet: jest.fn(),
    disconnect: jest.fn(),
  };
  return { createClient: jest.fn(() => mRedis) };
});

describe('LockingService', () => {
  let redis;

  beforeEach(() => {
    redis = createClient();
    jest.clearAllMocks();
  });

  it('should return success when seat is available and lock is acquired', async () => {
    redis.eval.mockResolvedValue('OK');

    const result = await lockingService.lockSeat('seat-1', 'user-1');

    expect(result.success).toBe(true);
    expect(redis.eval).toHaveBeenCalled();
  });

  it('should return error when seat is already locked', async () => {
    redis.eval.mockResolvedValue({ err: 'ALREADY_LOCKED' });

    const result = await lockingService.lockSeat('seat-1', 'user-2');

    expect(result.success).toBe(false);
    expect(result.error).toBe('ALREADY_LOCKED');
  });

  it('should release lock successfully', async () => {
    redis.get.mockResolvedValue('user-1');
    redis.del.mockResolvedValue(1);
    redis.hSet.mockResolvedValue(1);

    const result = await lockingService.releaseLock('seat-1', 'user-1');

    expect(result).toBe(true);
    expect(redis.del).toHaveBeenCalledWith('locks:seat-1');
  });
});
