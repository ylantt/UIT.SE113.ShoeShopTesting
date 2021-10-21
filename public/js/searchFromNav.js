(function() {
  const searchBtn = $("#nav-logo-search");
  const hidePart = $(".nav__collapse");
  const inputField = $(".nav__search--input");

  $(searchBtn).on("click", function (e) {
    hidePart.addClass("d-none");
    inputField.removeClass("scale0");
    inputField.addClass("scale1");
    inputField.focus();
    searchBtn.addClass("d-none");
  });

  $(inputField).on("blur", function (e) {
    hidePart.removeClass("d-none");
    inputField.addClass("scale0");
    inputField.removeClass("scale1");
    searchBtn.removeClass("d-none");
  })

  $("#nav-text-search").autocomplete({
    source: function(req, res) {
      $.ajax({
        url: "/client/api/searchComplete",
        dataType: "json",
        type: "GET",
        data: req,
        success: function(data) {
          res(data);
        }, error: function(err) {
          console.log(err);
        }
      });
    },

    minLength: 1,
    select: function(event, ui) {
      if (ui.item) {
        $("#nav-text-search").text(ui.item.label)
      }
    }
  });

  $(inputField).keyup(function(event) {
    if (event.key === 'Enter' || event.keyCode === 13) {
      window.location = "/products?name=" + inputField.val();
    }
});
})();