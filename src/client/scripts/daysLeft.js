const getRemainingDays = (targetDate) => {
    const currentDay = new Date().setHours(0,0,0,0);
    const tripDay = new Date(targetDate).setHours(0,0,0,0);
    const differenceInMilliseconds = tripDay - currentDay;
    
    return Math.round(differenceInMilliseconds / (86400000));
  };
  
  export { getRemainingDays };
  