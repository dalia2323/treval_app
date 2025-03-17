import { getRemainingDays } from "../scripts/daysLeft";

test('Calculates remaining days correctly', () => {
  const today = new Date();
  const targetDate = new Date(today.getTime());
  targetDate.setDate(today.getDate() + 5); 

  const daysLeft = getRemainingDays(targetDate);
  expect(daysLeft).toBe(5);
});
