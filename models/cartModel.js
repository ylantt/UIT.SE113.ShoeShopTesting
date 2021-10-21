module.exports = function Cart(oldCart) {
  this.items = oldCart.items || {};
  this.totalQty = oldCart.totalQty || 0;
  this.totalPrice = oldCart.totalPrice || 0;

  this.add = function(item, id) {
    var storedItem = this.items[id];

    if (!storedItem) {
      storedItem = this.items[id] = {item: item, qty: 0, price: 0};
    }

    storedItem.qty++;
    storedItem.price = storedItem.item.price * storedItem.qty;
    this.totalQty++;
    this.totalPrice += storedItem.item.price;
  }

  this.generateArr = function() {
    var arr = [];
    for (var id in this.items) {
      arr.push(this.items[id]);
    }
    return arr;
  }

  this.remove = function(item, id) {
    var currentItem = this.items[id];
    var priceOfRemovedItem = currentItem.item.price * currentItem.qty;
    this.totalPrice -= priceOfRemovedItem;
    this.totalQty -= currentItem.qty;
    delete this.items[id];
  }

  this.updateQty = function(item, id, newQty) {
    var currentItem = this.items[id];
    var oldQty = currentItem.qty;
    var oldPrice = currentItem.price;

    currentItem.qty = parseInt(newQty);
    currentItem.price = currentItem.qty * currentItem.item.price;
    
    this.totalPrice = this.totalPrice - oldPrice + currentItem.price;
    this.totalQty = this.totalQty - oldQty + currentItem.qty;
  }
};