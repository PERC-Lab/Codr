/**
 *
 * @param {String[]} list List of Annotations
 * @param {String} currentItem Current annotation Id
 */
 const Navigator = function Navigator(list, currentItem) {
  this.list = list;
  this.index = list.findIndex(i => i === currentItem);
  this.size = this.list.length;
}

Navigator.prototype = {
  getNext: function () {
    ++this.index;
    return this.list[this.index];
  },
  hasNext: function () {
    return this.index < this.size - 1;
  },
  getPrev: function () {
    --this.index;
    return this.list[this.index];
  },
  hasPrev: function () {
    return this.index > 0;
  },
};

export default Navigator