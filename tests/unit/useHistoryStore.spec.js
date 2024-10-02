// tests/unit/useLogStore.spec.js
import { useHistoryStore } from "@/store/useHistoryStore";
import { createPinia, setActivePinia } from "pinia";
import { getDocs, deleteDoc } from "firebase/firestore";

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({
    // 可以根据需要添加模拟的认证方法
  })),
}));

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  getDocs: jest.fn(),
  deleteDoc: jest.fn(),
  getFirestore: jest.fn(),
}));

describe("HistoryStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  afterEach(() => {
    jest.clearAllMocks(); // 清除所有模拟函数的调用数据
  });

  it("should fetch all games successfully", async () => {
    // 模拟 getDocs 的返回值
    const mockGamesData = [
      {
        id: "game1",
        data: () => ({
          created_at: "2023-10-01T12:00:00Z",
          chips_per_hand: 100,
          amount_per_hand: 10,
        }),
      },
      {
        id: "game2",
        data: () => ({
          created_at: "2023-10-02T12:00:00Z",
          chips_per_hand: 200,
          amount_per_hand: 20,
        }),
      },
    ];

    const mockPlayersData = {
      size: 5, // 模拟玩家数量
    };

    getDocs
      .mockResolvedValueOnce({ docs: mockGamesData }) // 第一次调用 getDocs，返回游戏列表
      .mockResolvedValue(mockPlayersData); // 后续调用 getDocs，返回玩家数量

    const historyStore = useHistoryStore();

    // 监听 loading 状态的变化
    expect(historyStore.loading).toBe(false);
    const fetchPromise = historyStore.fetchAllGames();
    expect(historyStore.loading).toBe(true);

    await fetchPromise;

    // 检查结果
    expect(historyStore.games.length).toBe(2);
    expect(historyStore.games[0].id).toBe("game2"); // 按创建时间降序排序
    expect(historyStore.games[1].id).toBe("game1");
    expect(historyStore.loading).toBe(false);
  });

  it("should handle fetchAllGames error", async () => {
    // 模拟 getDocs 抛出错误
    getDocs.mockRejectedValue(new Error("Firestore error"));

    const historyStore = useHistoryStore();

    // 模拟 alert
    window.alert = jest.fn();

    await historyStore.fetchAllGames();

    // 检查是否弹出了错误提示
    expect(window.alert).toHaveBeenCalledWith("无法加载游戏历史，请重试。");
    expect(historyStore.loading).toBe(false);
  });

  it("should delete a game successfully", async () => {
    const historyStore = useHistoryStore();

    // 设置初始游戏列表
    historyStore.games = [{ id: "game1" }, { id: "game2" }];

    // 模拟 deleteDoc 成功
    deleteDoc.mockResolvedValue();

    // 模拟 setTimeout
    jest.useFakeTimers();

    await historyStore.deleteGame("game1");

    // 检查游戏列表是否更新
    expect(historyStore.games.length).toBe(1);
    expect(historyStore.games[0].id).toBe("game2");

    // 检查提示是否显示
    expect(historyStore.showDeleteAlert).toBe(true);

    // 快进 3 秒
    jest.advanceTimersByTime(3000);

    // 检查提示是否隐藏
    expect(historyStore.showDeleteAlert).toBe(false);

    // 恢复定时器
    jest.useRealTimers();
  });

  it("should handle deleteGame error", async () => {
    const historyStore = useHistoryStore();

    // 设置初始游戏列表
    historyStore.games = [{ id: "game1" }, { id: "game2" }];

    // 模拟 deleteDoc 抛出错误
    deleteDoc.mockRejectedValue(new Error("Firestore error"));
    console.error = jest.fn();
    // 模拟 alert
    window.alert = jest.fn();

    await historyStore.deleteGame("game1");

    // 检查游戏列表未改变
    expect(historyStore.games.length).toBe(2);

    // 检查是否弹出了错误提示
    expect(window.alert).toHaveBeenCalledWith("删除游戏记录时出错，请重试。");
  });
});
