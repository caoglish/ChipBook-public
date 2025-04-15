import { format } from 'date-fns';
// import dateFnsTz from 'date-fns-tz';
// const { utcToZonedTime, format } = dateFnsTz;
import { toZonedTime } from 'date-fns-tz'
import { Timestamp } from "firebase/firestore";

const MELBOURNE_TIMEZONE = 'Australia/Melbourne';
const CHINA_DATE_FORMAT = 'yyyy/MM/dd, HH:mm:ss';

export function dateDisplay(date: Date = new Date()): string {
	// 将日期转换为墨尔本时区的时间
	const melbourneTime = toZonedTime(date, MELBOURNE_TIMEZONE);

	// 格式化日期为中国时间格式
	return format(melbourneTime, CHINA_DATE_FORMAT);
}

export function firebaseTimestamp(date: Date = new Date()): Timestamp {

	return Timestamp.fromDate(date);
}

export default {
	dateDisplay,
	firebaseTimestamp
};

