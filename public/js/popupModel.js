const openModalBtns = document.querySelectorAll("[data-modal-target]");
const closeModalBtns = document.querySelectorAll("[data-close-button]");
const overlay = document.getElementById("overlay");

openModalBtns.forEach(function (button) {
  button.addEventListener("click", function () {
    closeAllActiveModal();

    const modal = document.querySelector(button.dataset.modalTarget);
    openModal(modal);
  });
});

closeModalBtns.forEach(function (button) {
  button.addEventListener("click", closeAllActiveModal);
});

overlay.addEventListener("click", closeAllActiveModal);

function openModal(modal) {
  if (modal == null) return;
  modal.classList.add("active");
  overlay.classList.add("active");
}

function closeModal(modal) {
  if (modal == null) return;
  modal.classList.remove("active");
  overlay.classList.remove("active");
}

function closeAllActiveModal() {
  const modals = document.querySelectorAll(".modal.active");
  modals.forEach(function (modal) {
    closeModal(modal);
  });
}

//for account modal
$("#account_dropdown").on("click", function () {
  $("#dropdown-menu").toggleClass("nav__show");
})

$(window).click(function (e) {
  var target = $(e.target);
  if (!target.is("#account_dropdown")) {
    $("#dropdown-menu").removeClass("nav__show");
  }
})