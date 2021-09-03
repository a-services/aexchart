const dateFormat = require('dateformat');

/**
 * Add the specified number of minutes to the date in milliseconds.
 * @param {number} t  date in milliseconds
 * @param {number} m  number of minutes
 * @returns {number}  result in milliseconds
 */
 function addMinutes(t, m) {
    return t + m*60000;
    /*
    let d2 = new Date(d);
    d2.setHours(d2.getHours() + h);
    return d2;
    */
  }

  function df(date) {
    return dateFormat(date, "isoUtcDateTime"); //"dd.mm hh:MM:ss");
  }

  module.exports = {
      addMinutes: addMinutes,
      df: df
  };