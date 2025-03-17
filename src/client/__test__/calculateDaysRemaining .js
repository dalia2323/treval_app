const { calculateDaysRemaining } = require("../scripts/handleSubmit");

test('returns correct number of days remaining from today to provided date', () => {
  const today = new Date();
  const futureDate = new Date(today);
  
  futureDate.setDate(today.getDate() + 3); 

  expect(calculateDaysRemaining(futureDate)).toBe(3);
});

test('returns negative number if provided date is in the past', () => {
  const today = new Date();
  const pastDate = new Date(today);
  
  pastDate.setDate(today.getDate() - 2);
  expect(calculateDaysRemaining(pastDate)).toBe(-2);
});