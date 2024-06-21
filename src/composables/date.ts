import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ko';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import ko from 'dayjs/locale/ko';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import isoWeek from 'dayjs/plugin/isoWeek';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

// 플러그인 로드
dayjs.locale(ko);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Seoul');
dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

export const days: string[] = ['일', '월', '화', '수', '목', '금', '토'];

export const useDayjs = () => {
  return dayjs.tz;
};

export const getWeekOfMonth = (date: Dayjs) => {
  const startOfMonth = date.startOf('month');
  const endOfMonth = date.endOf('month');
  let week = 1;

  for (let d = startOfMonth; d.isSameOrBefore(endOfMonth); d = d.add(1, 'day')) {
    if (d.isoWeek() === date.isoWeek()) {
      return week;
    }
    if (d.day() === 0) {
      // 일요일이면 주차 증가
      week++;
    }
  }
  return week;
};
