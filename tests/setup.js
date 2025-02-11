// tests/setup.js or at the top of your test file
import { TextEncoder, TextDecoder } from "util";
import "web-streams-polyfill"; // 添加 ReadableStream 的 polyfill
import { ReadableStream } from "web-streams-polyfill"; // 添加 ReadableStream 的 polyfill

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.ReadableStream = ReadableStream;

// 模拟 firebase/auth 模块
jest.mock("firebase/auth", () => {
  const originalAuth = jest.requireActual("firebase/auth");
  return {
    ...originalAuth,
    getAuth: jest.fn(() => ({
      // 在这里添加需要的模拟方法
    })),
  };
});

jest.mock('@/Lib/FirebaseDb', () => ({
	default: {}, // 模拟的 firebaseDb 对象，可以根据需要添加属性
  }));

// 模拟 firebase/firestore 模块
jest.mock("firebase/firestore", () => {
  const originalModule = jest.requireActual("firebase/firestore");
  return {
    // 保留原始模块的所有导出
    ...originalModule,
    collection: jest.fn(),
    getDocs: jest.fn(),
    getDoc: jest.fn(),
	addDoc: jest.fn(),
    query: jest.fn(),
	updateDoc: jest.fn(),
    where: jest.fn(),
    getFirestore: jest.fn(),
    doc: jest.fn(),
    deleteDoc: jest.fn(),
    // 如果需要，添加其他 Firestore 方法的模拟
  };
});

jest.spyOn(console, "error").mockImplementation(() => {});
jest.spyOn(console, "log").mockImplementation(() => {});
jest.spyOn(console, "warn").mockImplementation(() => {});
