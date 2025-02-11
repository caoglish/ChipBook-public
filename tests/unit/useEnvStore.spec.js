// tests/unit/EnvStore.spec.js

import { useEnvStore } from '@/store/envStore';
import { createPinia, setActivePinia } from 'pinia';
import { collection, getDocs } from 'firebase/firestore';
describe('useEnvStore', () => {
	beforeEach(() => {
	  // 设置 Pinia
	  setActivePinia(createPinia());
	});
  
	afterEach(() => {
	  // 清除所有模拟函数的调用数据
	  jest.clearAllMocks();
	});
  
	it('should load env successfully from Firebase', async () => {
	  const envStore = useEnvStore();
  
	  // 模拟 collection 返回值
	  const mockCollectionRef = {}; // 模拟的集合引用
	  collection.mockReturnValueOnce(mockCollectionRef);
  
	  // 模拟 getDocs 返回的数据
	  const mockDocs = [
		{
		  id: 'doc1',
		  data: () => ({
			env: 'production',
			otherField: 'value',
		  }),
		},
	  ];
	  getDocs.mockResolvedValueOnce({
		forEach: (callback) => {
		  mockDocs.forEach((doc) => callback(doc));
		},
	  });
  
	  // 模拟 console.log
	  jest.spyOn(console, 'log').mockImplementation(() => {});
  
	  // 调用 loadEnv 方法
	  await envStore.loadEnv();
  
	  // 断言
	  expect(envStore.env).toBe('production');
  
	  // 检查是否正确调用了 collection 和 getDocs
	  expect(collection).toHaveBeenCalledWith(expect.anything(), 'info');
	  expect(getDocs).toHaveBeenCalledWith(mockCollectionRef);
  
	  // 检查是否调用了 console.log
	  expect(console.log).toHaveBeenCalledWith({
		env: 'production',
		otherField: 'value',
	  });
  
	  // 恢复 console.log 的原始实现
	  console.log.mockRestore();
	});
  
	it('should handle errors when loading env from Firebase', async () => {
	  const envStore = useEnvStore();
  
	  // 模拟 collection 返回值
	  const mockCollectionRef = {};
	  collection.mockReturnValueOnce(mockCollectionRef);
  
	  // 模拟 getDocs 抛出错误
	  const mockError = new Error('Firebase error');
	  getDocs.mockRejectedValueOnce(mockError);
  
	  // 模拟 console.error
	  jest.spyOn(console, 'error').mockImplementation(() => {});
  
	  // 调用 loadEnv 方法
	  await envStore.loadEnv();
  
	  // 断言 env 应该保持为 null
	  expect(envStore.env).toBeNull();
  
	  // 检查是否调用了 console.error
	  expect(console.error).toHaveBeenCalledWith(
		'Error checking game env in Firebase:',
		mockError
	  );
  
	  // 恢复 console.error 的原始实现
	  console.error.mockRestore();
	});
  });
  