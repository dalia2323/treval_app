function getRdays(date) {
    const now = new Date();
    const timeDiff = new Date(date) - now;
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  }
  
  module.exports = { getRdays }; 
  