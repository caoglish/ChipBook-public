import { useTodayGameStore } from '@/store/useTodayGameStore';
import { createPinia, setActivePinia } from 'pinia';
import { collection, getDocs, query, where } from 'firebase/firestore';

describe('GameStore', () => {
	beforeEach(() => {
	  // 设置 Pinia
	  setActivePinia(createPinia());
	});
  
	afterEach(() => {
	  // 清除所有模拟函数的调用数据
	  jest.clearAllMocks();
	});
  
	it("should fetch today's games successfully", async () => {
	  const gameStore = useTodayGameStore();
  
	  // 模拟今天的日期
	  const mockToday = new Date('2023-10-05T10:00:00Z');
	  jest.spyOn(global, 'Date').mockImplementation(() => mockToday);
  
	  // 模拟 Firestore 返回的数据
	  const mockGamesData = [
		{
		  id: 'game1',
		  data: () => ({
			created_at_timestamp: mockToday, // 今天的游戏
			other_field: 'value1',
		  }),
		},
		{
		  id: 'game2',
		  data: () => ({
			created_at_timestamp: new Date('2023-10-04T12:00:00Z'), // 昨天的游戏
			other_field: 'value2',
		  }),
		},
	  ];
  
	  // 模拟 where、query、collection 方法
	  where.mockReturnValue('where-result');
	  query.mockReturnValue('query-result');
	  collection.mockReturnValue('collection-result');
  
	  // 模拟 getDocs 返回值
	  getDocs.mockResolvedValueOnce({
		docs: [mockGamesData[0]], // 只返回今天的游戏
	  });
  
	  // 调用 fetchTodayGames 方法
	  await gameStore.fetchTodayGames();
  
	  // 断言
	  expect(collection).toHaveBeenCalledWith(expect.anything(), 'games');
	  expect(where).toHaveBeenCalledWith(
		'created_at_timestamp',
		'>=',
		new Date(mockToday.setHours(0, 0, 0, 0))
	  );
	  expect(query).toHaveBeenCalledWith('collection-result', 'where-result');
	  expect(getDocs).toHaveBeenCalledWith('query-result');
  
	  expect(gameStore.games).toHaveLength(1);
	  expect(gameStore.games[0]).toEqual({
		id: 'game1',
		created_at_timestamp: mockToday,
		other_field: 'value1',
	  });
  
	  // 恢复 Date 的原始实现
	  global.Date.mockRestore();
	});
  
	it('should handle errors when fetching games', async () => {
	  const gameStore = useTodayGameStore();
  
	  // 模拟 getDocs 抛出错误
	  getDocs.mockRejectedValue(new Error('Firestore error'));
	  await gameStore.fetchTodayGames();
  
	  // 断言 games 数组为空
	  expect(gameStore.games).toHaveLength(0);
	  // 检查是否调用了 console.error
	  expect(console.error).toHaveBeenCalledWith(
		"Error fetching today's games:",
		expect.any(Error)
	  );
  
	  // 恢复 console.error 的原始实现
	  console.error.mockRestore();
	});
  });