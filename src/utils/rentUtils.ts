export interface RentData {
  userName?: string;
  totalRent: number;
  startDate: string; // ISO string or simple date string
  paymentDay: number; // 1-31
}

export interface RentUnit {
  name: string;
  value: number; // Value in KRW
  suffix: string;
}

export const UNIT_LIST: RentUnit[] = [
  { name: '원화', value: 1, suffix: '원' },
  { name: '달러', value: 1450, suffix: '$' },
  { name: '두쫀쿠', value: 7000, suffix: '개' },
  { name: '국밥', value: 10000, suffix: '그릇' },
  { name: '엽기떡볶이', value: 15000, suffix: '그릇' },
  { name: '엄복동', value: 170000, suffix: 'UBD' },
  { name: '아이폰 17', value: 1320000, suffix: '대' },
];

export const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

export const calculateRentPerSecond = (totalRent: number, year: number, month: number) => {
  const daysInMonth = getDaysInMonth(year, month);
  const dailyRent = totalRent / daysInMonth;
  const rentPerSecond = dailyRent / 24 / 3600;
  return rentPerSecond;
};

export const calculateAccumulatedRent = (data: RentData, now: Date) => {
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // Helper to get the actual payment date for a specific month (handling last-day-of-month cases)
  const getActualPaymentDate = (year: number, month: number, day: number) => {
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    const actualDay = Math.min(day, lastDayOfMonth);
    return new Date(year, month, actualDay, 0, 0, 0, 0);
  };

  // 1. Determine the start and end of the CURRENT payment cycle
  let lastPaymentDate = getActualPaymentDate(currentYear, currentMonth, data.paymentDay);
  if (now < lastPaymentDate) {
    lastPaymentDate = getActualPaymentDate(currentYear, currentMonth - 1, data.paymentDay);
  }

  const nextPaymentDate = getActualPaymentDate(lastPaymentDate.getFullYear(), lastPaymentDate.getMonth() + 1, data.paymentDay);

  // 2. Calculate cycle-specific rent per second
  const cycleTotalSeconds = (nextPaymentDate.getTime() - lastPaymentDate.getTime()) / 1000;
  const rentPerSecond = data.totalRent / cycleTotalSeconds;

  // 3. Today's accumulation (since 00:00:00)
  const startOfToday = new Date(currentYear, currentMonth, now.getDate(), 0, 0, 0, 0);
  const secondsToday = (now.getTime() - startOfToday.getTime()) / 1000;
  const todayAccumulation = secondsToday * rentPerSecond;

  // 4. Monthly accumulation (since the start of the current cycle)
  const secondsSincePayment = (now.getTime() - lastPaymentDate.getTime()) / 1000;
  const monthlyAccumulation = secondsSincePayment * rentPerSecond;

  // 5. Total accumulation since move-in
  // For total, we use the current cycle's rate for simplicity and consistency with the "feeling"
  const startDate = new Date(data.startDate);
  startDate.setHours(0, 0, 0, 0);
  const secondsSinceMoveIn = (now.getTime() - startDate.getTime()) / 1000;
  const totalSinceMoveIn = secondsSinceMoveIn * rentPerSecond;

  return {
    todayAccumulation,
    monthlyAccumulation,
    totalSinceMoveIn,
    rentPerSecond
  };
};
