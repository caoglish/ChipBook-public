
import DateHelper from "@/Lib/DateHelper"; // 替换为你的实际文件路径
import {firebaseTimestamp} from "@/Lib/DateHelper"; 
import { Timestamp } from "firebase/firestore";

describe('DateHelper.dateDisplay', () => {
  it('should return the current date in China format using Melbourne timezone', () => {
    const chinaFormattedDate = DateHelper.dateDisplay();

    // 正则表达式匹配中国时间格式 yyyy-MM-dd HH:mm:ss
    const chinaDateFormatRegex = /^\d{4}\/\d{2}\/\d{2}, \d{2}:\d{2}:\d{2}$/;

    expect(chinaFormattedDate).toMatch(chinaDateFormatRegex);
  });

  it('should correctly sort dates in China format', () => {
    // 模拟生成三个日期字符串
    const date1 = DateHelper.dateDisplay(new Date(2018,0,1)) ;
    const date2 = '2024-09-01 14:00:00' ;
    const date3 = DateHelper.dateDisplay();

    // 创建一个未排序的数组
    const dateArray = [date2, date1, date3];

    // 按时间顺序排序
    const sortedDates = dateArray.sort();

    // 验证排序结果
    expect(sortedDates).toEqual([date1, date2, date3]);
  });
});


describe("firebaseTimestamp", () => {
	it("should return a Firebase Timestamp", () => {
	  const result = firebaseTimestamp();
	  expect(result).toBeInstanceOf(Timestamp);
	});
  
	it("should convert a given date to a Firebase Timestamp", () => {
	  const date = new Date("2024-09-13T08:24:50Z");
	  const result = firebaseTimestamp(date);
	  expect(result).toBeInstanceOf(Timestamp);
	  expect(result.toDate().toISOString()).toBe(date.toISOString());
	});
  
	it("should default to the current date and time when no date is provided", () => {
	  const beforeCall = new Date();
	  const result = firebaseTimestamp();
	  const afterCall = new Date();
  
	  // 检查结果是否在当前时间范围内
	  expect(result.toDate().getTime()).toBeGreaterThanOrEqual(beforeCall.getTime());
	  expect(result.toDate().getTime()).toBeLessThanOrEqual(afterCall.getTime());
	});
  });