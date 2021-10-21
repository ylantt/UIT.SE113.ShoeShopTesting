module.exports = function Wishlist(oldWishlist) {
  this.items = oldWishlist.items || {};
  this.totalQty = oldWishlist.totalQty || 0;

  this.add = function(item, id) {
    var storedItem = this.items[id];

    if (!storedItem) {
      storedItem = this.items[id] = {item: item};
      this.totalQty++;
    }
  }

  this.generateArr = function() {
    var arr = [];
    for (var id in this.items) {
      arr.push(this.items[id]);
    }
    return arr;
  }

  this.remove = function(id) {
    delete this.items[id];
    this.totalQty--;
  }
};