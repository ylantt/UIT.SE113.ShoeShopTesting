import { caclDayRemain, checkScroll } from './animation.js';
import { addToCart, removeFromCart, updateCart, addToWishlist } from './sessionControl.js';
import { sendContact } from './sendContact.js';

const sortField = $(".sort");

const eventTimeElement = $(".event__time");
const addToCartBtn = $(".add-to-cart-button");
const removeFromCartBtn = $(".remove-from-cart");
const qtyInfo = $(".product-quantity");
const addToWishlistBtn = $(".add-to-wishlist");
const removeFromWishlisBtn = $(".remove-from-wishlist");
const submitContact = $("#submitContact");

if (eventTimeElement) {
  caclDayRemain();
  setInterval(caclDayRemain, 1000);
}

if (sortField) {
  $.each(sortField, function () {
    $(this).on("click", function () {
      window.location = "/" + $(this).data("type") + "?sort=" + $(this).data("sort");
    });
  });
}

$(".nav--hover").on("mouseover", () => {
  $(".nav__sub-menu").css("visibility", "visible");
});

$(".nav__sub-menu").on("mouseover", () => {
  $(".nav__sub-menu").css("visibility", "visible");
});

$(".nav__sub-menu").on("mouseout", () => {
  $(".nav__sub-menu").css("visibility", "hidden");
});

window.addEventListener("scroll", checkScroll);

if (addToCartBtn) {
  $.each(addToCartBtn, function () {
    $(this).on("click", function () {
      addToCart($(this).data("id"));
    })
  });
}

if (removeFromCartBtn) {
  $.each(removeFromCartBtn, function (index) {
    $(this).on("click", function (e) {
      var confirmRemove = confirm("Are you sure to remove this item?");
      if (confirmRemove) {
        removeFromCart($(this).data("id"));
      }
    })
  });
}

if (qtyInfo) {
  $.each(qtyInfo, function (index) {
    $(this).on("click", function (e) {
      updateCart($(this).data("id"), $(this).val());
    });
  });
}

if (addToWishlistBtn) {
  $.each(addToWishlistBtn, function () {
    $(this).on("click", function () {
      addToWishlist($(this).data("id"));
    });
  });
}

$.each(removeFromWishlisBtn, function () {
  $(this).on("click", function () {
    var confirmRemove = confirm("Are you sure to remove this item?");
    if (confirmRemove) {
      removeFromWish($(this).data("id"));
    }
  });
});

if (submitContact) {
  submitContact.on("click", function (e) {
      e.preventDefault();
      const fullName = $("#contact_fullName").val();
      const email = $(".contact_email").val();
      const message = $(".contact_message").val();
      sendContact(fullName, email, message);
  });
}