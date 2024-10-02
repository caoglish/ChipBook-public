// tests/unit/useLogStore.spec.js

import { useLogStore } from '@/store/useLogStore';
import { createPinia, setActivePinia } from 'pinia';
import { getDocs } from 'firebase/firestore';

// 模拟 firebase 模块
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({
    // 可以根据需要添加模拟的认证方法
  })),
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  getDocs: jest.fn(),
  getFirestore: jest.fn(),
}));

describe('useLogStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should fetch player logs successfully', async () => {
    // 模拟 getDocs 的返回值
    getDocs.mockResolvedValueOnce({
      docs: [
        {
          id: 'player1',
          data: () => ({
            player_display_name: 'Player One',
            player_id: 'player1',
            logs: [
              {
                action: 'buyin',
                timestamp: { seconds: 1634579383 },
              },
            ],
          }),
        },
      ],
    });

    const logStore = useLogStore();
    await logStore.fetchAllPlayerLogs('testGame');

    // 断言
    expect(logStore.combinedLogs).toHaveLength(1);
    expect(logStore.combinedLogs[0].player_display_name).toBe('Player One');
  });

  it('should sort logs by player correctly', () => {
    const logStore = useLogStore();

    // 设置一些未排序的日志数据
    logStore.combinedLogs = [
      {
        player_id: 'player2',
        timestamp: { seconds: 1634579385 },
        player_display_name: 'Player Two',
      },
      {
        player_id: 'player1',
        timestamp: { seconds: 1634579383 },
        player_display_name: 'Player One',
      },
      {
        player_id: 'player1',
        timestamp: { seconds: 1634579384 },
        player_display_name: 'Player One',
      },
    ];

    // 调用排序方法
    logStore.sortByPlayer = true; // 设置排序方式为按玩家排序
    logStore.sortLogs();

    // 断言排序结果
    expect(logStore.combinedLogs).toEqual([
      {
        player_id: 'player1',
        timestamp: { seconds: 1634579383 },
        player_display_name: 'Player One',
      },
      {
        player_id: 'player1',
        timestamp: { seconds: 1634579384 },
        player_display_name: 'Player One',
      },
      {
        player_id: 'player2',
        timestamp: { seconds: 1634579385 },
        player_display_name: 'Player Two',
      },
    ]);
  });

  it('should sort logs by time correctly', () => {
    const logStore = useLogStore();

    // 设置一些未排序的日志数据
    logStore.combinedLogs = [
      {
        player_id: 'player1',
        timestamp: { seconds: 1634579385 },
        player_display_name: 'Player One',
      },
      {
        player_id: 'player2',
        timestamp: { seconds: 1634579383 },
        player_display_name: 'Player Two',
      },
      {
        player_id: 'player1',
        timestamp: { seconds: 1634579384 },
        player_display_name: 'Player One',
      },
    ];

    // 调用排序方法
    logStore.sortByPlayer = false; // 设置排序方式为按时间排序
    logStore.sortLogs();

    // 断言排序结果
    expect(logStore.combinedLogs).toEqual([
      {
        player_id: 'player2',
        timestamp: { seconds: 1634579383 },
        player_display_name: 'Player Two',
      },
      {
        player_id: 'player1',
        timestamp: { seconds: 1634579384 },
        player_display_name: 'Player One',
      },
      {
        player_id: 'player1',
        timestamp: { seconds: 1634579385 },
        player_display_name: 'Player One',
      },
    ]);
  });
});
