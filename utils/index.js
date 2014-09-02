'use strict';

module.exports = {

  /**
   * Returns whether a value is set or not
   * @param {*} value - value to check
   * @return {Boolean}
   */
  isset: function (value) {
    return typeof value !== 'undefined';
  }

};
