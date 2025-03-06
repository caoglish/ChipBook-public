import { usePlayerStore } from '@/store/usePlayerStore';
import { createPinia, setActivePinia } from 'pinia';
import { getDocs, addDoc, updateDoc, deleteDoc ,doc,collection} from 'firebase/firestore';
import { Player } from '@/Type/Player';


describe('usePlayerStore', () => {
	beforeEach(() => {
	  setActivePinia(createPinia());
	});
  
	afterEach(() => {
	  jest.clearAllMocks(); // 清除所有模拟函数的调用数据
	});
  
	it('should fetch players successfully', async () => {
	  const playerStore = usePlayerStore();
  
	  // 模拟 Firestore 返回的数据
	  const mockPlayersData = [
		{
		  id: 'player1',
		  data: () => ({
			name: 'Player One',
			allow_select: true,
		  }),
		},
		{
		  id: 'player2',
		  data: () => ({
			name: 'Player Two',
			allow_select: false,
		  }),
		},
	  ];
  
	  // 模拟 getDocs 返回值
	  getDocs.mockResolvedValueOnce({
		docs: mockPlayersData,
	  });
  
	  // 调用 fetchPlayers 方法
	  await playerStore.fetchPlayers();
  
	  // 断言
	  expect(playerStore.players).toHaveLength(2);
	  expect(playerStore.players[0]).toEqual({
		id: 'player1',
		name: 'Player One',
		allow_select: true,
	  });
	  expect(playerStore.players[1]).toEqual({
		id: 'player2',
		name: 'Player Two',
		allow_select: false,
	  });
	});
  
	it('should handle error when fetching players', async () => {
	  const playerStore = usePlayerStore();
  
	  // 模拟 getDocs 抛出错误
	  getDocs.mockRejectedValue(new Error('Firestore error'));
  
	  // 模拟 alert
	  window.alert = jest.fn();
	  // 模拟 console.error
	  jest.spyOn(console, 'error').mockImplementation(() => {});
  
	  await playerStore.fetchPlayers();
  
	  // 断言 players 数组为空
	  expect(playerStore.players).toHaveLength(0);
  
	  // 检查是否调用了 alert 和 console.error
	  expect(window.alert).toHaveBeenCalledWith('无法加载玩家列表，请重试。');
	  expect(console.error).toHaveBeenCalledWith('Error fetching players:', expect.any(Error));
  
	  // 恢复 console.error 的原始实现
	  console.error.mockRestore();
	});
  
	it('should toggle allow_select status of a player', async () => {
	  const playerStore = usePlayerStore();
  
	  // 设置初始玩家列表
	  playerStore.players = [
		{ id: 'player1', name: 'Player One', allow_select: true },
	  ];
  
	  // 模拟 updateDoc 成功
	  updateDoc.mockResolvedValueOnce();
	  doc.mockReturnValue({});
	  // 调用 toggleAllowSelect 方法
	  await playerStore.toggleAllowSelect('player1');
  
	  // 断言玩家的 allow_select 状态已切换
	  expect(playerStore.players[0].allow_select).toBe(false);
  
	  // 检查 updateDoc 是否被正确调用
	  expect(updateDoc).toHaveBeenCalledWith(expect.any(Object), { allow_select: false });
	});
  
	it('should add a new player successfully', async () => {
	  const playerStore = usePlayerStore();
  
	  // 模拟 addDoc 成功
	  addDoc.mockResolvedValueOnce();
  
	  // 模拟 fetchPlayers 方法
	  jest.spyOn(playerStore, 'fetchPlayers').mockResolvedValueOnce();
  
	  const newPlayer = {
		name: 'New Player',
		allow_select: true,
	  };

	  collection.mockReturnValue({});
  
	  // 调用 addPlayer 方法
	  await playerStore.addPlayer(newPlayer);

	  
  
	  // 检查 addDoc 是否被正确调用
	  expect(addDoc).toHaveBeenCalledWith(expect.any(Object), {
		...newPlayer,
		allow_select: true,
	  });
  
	  // 检查 fetchPlayers 是否被调用
	  expect(playerStore.fetchPlayers).toHaveBeenCalled();
	});
  
	it('should handle error when adding a new player', async () => {
	  const playerStore = usePlayerStore();
  
	  // 模拟 addDoc 抛出错误
	  addDoc.mockRejectedValueOnce(new Error('Firestore error'));
  
	  // 模拟 alert
	  window.alert = jest.fn();
	  // 模拟 console.error
	  jest.spyOn(console, 'error').mockImplementation(() => {});
  
	  const newPlayer= {
		name: 'New Player',
		allow_select: true,
	  };
  
	  // 调用 addPlayer 方法
	  await playerStore.addPlayer(newPlayer);
  
	  // 检查是否调用了 alert 和 console.error
	  expect(window.alert).toHaveBeenCalledWith('无法添加玩家，请重试。');
	  expect(console.error).toHaveBeenCalledWith('Error adding player:', expect.any(Error));
  
	  // 恢复 console.error 的原始实现
	  console.error.mockRestore();
	});
  
	it('should update a player successfully', async () => {
	  const playerStore = usePlayerStore();
  
	  // 模拟 updateDoc 成功
	  updateDoc.mockResolvedValueOnce();
  
	  // 模拟 fetchPlayers 方法
	  jest.spyOn(playerStore, 'fetchPlayers').mockResolvedValueOnce();
  
	  const updatedData = { name: 'Updated Player' };

	  doc.mockReturnValue({});
  
	  // 调用 updatePlayer 方法
	  await playerStore.updatePlayer('player1', updatedData);
  
	  // 检查 updateDoc 是否被正确调用
	  expect(updateDoc).toHaveBeenCalledWith(expect.any(Object), updatedData);
  
	  // 检查 fetchPlayers 是否被调用
	  expect(playerStore.fetchPlayers).toHaveBeenCalled();
	});
  
	it('should handle error when updating a player', async () => {
	  const playerStore = usePlayerStore();
  
	  // 模拟 updateDoc 抛出错误
	  updateDoc.mockRejectedValueOnce(new Error('Firestore error'));
  
	  // 模拟 alert
	  window.alert = jest.fn();
	  // 模拟 console.error
	  jest.spyOn(console, 'error').mockImplementation(() => {});
  
	  const updatedData = { name: 'Updated Player' };
  
	  // 调用 updatePlayer 方法
	  await playerStore.updatePlayer('player1', updatedData);
  
	  // 检查是否调用了 alert 和 console.error
	  expect(window.alert).toHaveBeenCalledWith('无法更新玩家，请重试。');
	  expect(console.error).toHaveBeenCalledWith('Error updating player:', expect.any(Error));
  
	  // 恢复 console.error 的原始实现
	  console.error.mockRestore();
	});
  
	it('should delete a player successfully', async () => {
	  const playerStore = usePlayerStore();
  
	  // 设置初始玩家列表
	  playerStore.players = [
		{ id: 'player1', name: 'Player One', allow_select: true },
		{ id: 'player2', name: 'Player Two', allow_select: false },
	  ];
  
	  // 模拟 deleteDoc 成功
	  doc.mockReturnValue({});
  
	  // 模拟 fetchPlayers 方法
	  jest.spyOn(playerStore, 'fetchPlayers').mockResolvedValueOnce();
  
	  // 调用 deletePlayer 方法
	  await playerStore.deletePlayer('player1');
  
	  // 检查 deleteDoc 是否被正确调用
	  expect(deleteDoc).toHaveBeenCalledWith(expect.any(Object));
  
	  // 检查 fetchPlayers 是否被调用
	  expect(playerStore.fetchPlayers).toHaveBeenCalled();
	});
  
	it('should handle error when deleting a player', async () => {
	  const playerStore = usePlayerStore();
  
	  // 模拟 deleteDoc 抛出错误
	  deleteDoc.mockRejectedValueOnce(new Error('Firestore error'));
  
	  // 模拟 alert
	  window.alert = jest.fn();
	  // 模拟 console.error
	  jest.spyOn(console, 'error').mockImplementation(() => {});
  
	  // 调用 deletePlayer 方法
	  await playerStore.deletePlayer('player1');
  
	  // 检查是否调用了 alert 和 console.error
	  expect(window.alert).toHaveBeenCalledWith('无法删除玩家，请重试。');
	  expect(console.error).toHaveBeenCalledWith('Error deleting player:', expect.any(Error));
  
	  // 恢复 console.error 的原始实现
	  console.error.mockRestore();
	});
  
	it('should get player by id using getter', () => {
	  const playerStore = usePlayerStore();
  
	  // 设置初始玩家列表
	  playerStore.players = [
		{ id: 'player1', name: 'Player One', allow_select: true },
		{ id: 'player2', name: 'Player Two', allow_select: false },
	  ];
  
	  // 使用 getter 获取玩家
	  const player = playerStore.getPlayerById('player1');
  
	  // 断言
	  expect(player).toEqual({ id: 'player1', name: 'Player One', allow_select: true });
	});
  
	it('should get ForSelectPlayerList using getter', () => {
	  const playerStore = usePlayerStore();
  
	  // 设置初始玩家列表
	  playerStore.players = [
		{ id: 'player1', name: 'Player One', allow_select: true },
		{ id: 'player2', name: 'Player Two', allow_select: false },
	  ];
  
	  // 获取可选择的玩家列表
	  const forSelectPlayers = playerStore.ForSelectPlayerList;
  
	  // 断言
	  expect(forSelectPlayers).toHaveLength(1);
	  expect(forSelectPlayers[0].id).toBe('player1');
	});
  
	it('should get NotForSelectPlayerList using getter', () => {
	  const playerStore = usePlayerStore();
  
	  // 设置初始玩家列表
	  playerStore.players = [
		{ id: 'player1', name: 'Player One', allow_select: true },
		{ id: 'player2', name: 'Player Two', allow_select: false },
	  ];
  
	  // 获取不可选择的玩家列表
	  const notForSelectPlayers = playerStore.NotForSelectPlayerList;
  
	  // 断言
	  expect(notForSelectPlayers).toHaveLength(1);
	  expect(notForSelectPlayers[0].id).toBe('player2');
	});
  });
  