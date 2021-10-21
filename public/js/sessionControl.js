export const addToCart = (id) => {
  $.ajax({
    url: "/client/api/cart/" + id,
    type: "post",
    xhrFields: { withCredentials: true },
    data: { id: id },
    success: function (data) {
      $("#cart-number").text(data.totalQty);
    },
    error: function (err) {
      alert(err);
    },
  });
}

export const removeFromCart = (id) => {
  $.ajax({
    url: "/client/api/cart/" + id,
    type: "delete",
    xhrFields: { withCredentials: true },
    data: { id: id },
    success: function (data) {
      $("#cart-number").html(data.totalQty);
      location.reload();
    },
    error: function (err) {
      alert(err);
    },
  });
}

export const updateCart = (id, qty) => {
  $.ajax({
    url: "/client/api/cart/" + id,
    type: "patch",
    xhrFields: { withCredentials: true },
    data: { id: id, newQty: qty },
    success: function (data) {
      $("#cart-number").html(data.totalQty);
      $("#cart__totalMoney").val("$" + data.totalPrice);
      $(".product-full-price[data-id=" + id + "]").html("$" + data.items[id].price);
    },
    error: function (err) {
      alert(err);
    },
  });
}

export const addToWishlist = (id) => {
  $.ajax({
    url: "/client/api/wishlist/" + id,
    type: "post",
    xhrFields: { withCredentials: true },
    data: { id: id },
    success: function (data) {
      $("#wishlist-number").html(data.totalQty);
    },
    error: function (err) {
      alert(err);
    },
  });
}

export const removeFromWish = (id) => {
  $.ajax({
    url: "/client/api/wishlist/" + id,
    type: "delete",
    xhrFields: { withCredentials: true },
    data: { id: id },
    success: function (data) {
      $("#wishlist-number").html(data.totalQty);
      location.reload();
    },
    error: function (err) {
      alert(err);
    },
  });
}