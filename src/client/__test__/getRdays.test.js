const { getRdays } = require("../scripts/getRdays"); 

test('give me the remaining days from now to date I will set the parameter', () => {
  const date = new Date("2025-03-10");
  expect(getRdays(date)).toBe(3);
});
