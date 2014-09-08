'use strict';

module.exports = {

  /**
   * Returns whether a value is set or not
   * @param {*} value - value to check
   * @return {Boolean}
   */
  isset: function (value) {
    return typeof value !== 'undefined';
  },

  /**
   * Capitalize a string
   * @param {String} str - string to be capitalized
   * @return {String}
   */
  capitalize: function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

};
