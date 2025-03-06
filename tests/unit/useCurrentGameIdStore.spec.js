// tests/unit/CurrentGameIdStore.spec.js

import { useCurrentGameIdStore } from '@/store/useCurrentGameIdStore';
import { createPinia, setActivePinia } from 'pinia';
import { doc, getDoc } from 'firebase/firestore';

describe('useCurrentGameIdStore', () => {
	beforeEach(() => {
	  // 设置 Pinia
	  setActivePinia(createPinia());
	});
  
	afterEach(() => {
	  // 清除所有模拟函数的调用数据
	  jest.clearAllMocks();
	});
  
	it('should return true when the game session exists in Firebase', async () => {
	  const store = useCurrentGameIdStore();
  
	  // 设置 currentGameId
	  store.currentGameId = 'testGameId';
  
	  // 模拟 doc 返回值
	  const mockDocRef = {}; // 模拟的文档引用
	  doc.mockReturnValueOnce(mockDocRef);
  
	  // 模拟 getDoc 返回存在的文档
	  getDoc.mockResolvedValueOnce({
		exists: () => true,
	  });
  
	  // 调用方法
	  const result = await store.checkGameSessionInFirebase();
  
	  // 断言
	  expect(result).toBe(true);
	  expect(store.currentGameId).toBe('testGameId');
  
	  // 检查是否正确调用了 doc 和 getDoc
	  expect(doc).toHaveBeenCalledWith(expect.anything(), 'games', 'testGameId');
	  expect(getDoc).toHaveBeenCalledWith(mockDocRef);
	});
  
	it('should return false and clear currentGameId when the game session does not exist in Firebase', async () => {
	  const store = useCurrentGameIdStore();
  
	  // 设置 currentGameId
	  store.currentGameId = 'testGameId';
  
	  // 模拟 doc 返回值
	  const mockDocRef = {};
	  doc.mockReturnValueOnce(mockDocRef);
  
	  // 模拟 getDoc 返回不存在的文档
	  getDoc.mockResolvedValueOnce({
		exists: () => false,
	  });
  
	  // 调用方法
	  const result = await store.checkGameSessionInFirebase();
  
	  // 断言
	  expect(result).toBe(false);
	  expect(store.currentGameId).toBeNull();
  
	  // 检查是否正确调用了 doc 和 getDoc
	  expect(doc).toHaveBeenCalledWith(expect.anything(), 'games', 'testGameId');
	  expect(getDoc).toHaveBeenCalledWith(mockDocRef);
	});
  
	it('should return false and keep currentGameId when there is an error during Firebase operation', async () => {
	  const store = useCurrentGameIdStore();
  
	  // 设置 currentGameId
	  store.currentGameId = 'testGameId';
  
	  // 模拟 doc 返回值
	  const mockDocRef = {};
	  doc.mockReturnValueOnce(mockDocRef);
  
	  // 模拟 getDoc 抛出错误
	  const mockError = new Error('Firebase error');
	  getDoc.mockRejectedValueOnce(mockError);

	  
  
	  // 模拟 console.error，防止测试输出中出现错误信息
	  jest.spyOn(console, 'error').mockImplementation(() => {});
  
	  // 调用方法
	  const result = await store.checkGameSessionInFirebase();
  
	  // 断言
	  expect(result).toBe(false);
	  expect(store.currentGameId).toBe('testGameId');
  
	  // 检查是否正确调用了 doc 和 getDoc
	  expect(doc).toHaveBeenCalledWith(expect.anything(), 'games', 'testGameId');
	  expect(getDoc).toHaveBeenCalledWith(mockDocRef);
  
	  // 检查是否调用了 console.error
	  expect(console.error).toHaveBeenCalledWith(
		'Error checking game session in Firebase:',
		mockError
	  );
  
	  // 恢复 console.error 的原始实现
	  console.error.mockRestore();
	});
  
	it('should set the currentGameId correctly when setGameId is called', () => {
	  const store = useCurrentGameIdStore();
  
	  // 调用 setGameId
	  store.setGameId('newGameId');
  
	  // 断言
	  expect(store.currentGameId).toBe('newGameId');
	});
  
	it('should clear the currentGameId when clearGameId is called', () => {
	  const store = useCurrentGameIdStore();
  
	  // 设置 currentGameId
	  store.currentGameId = 'testGameId';
  
	  // 调用 clearGameId
	  store.clearGameId();
  
	  // 断言
	  expect(store.currentGameId).toBeNull();
	});
  });
  