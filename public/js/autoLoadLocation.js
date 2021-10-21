(function() {
  $("#address-country-field").on("change", function () {
      $("#address-state-field option").remove();
      $("#address-city-field option").remove();

      $('#address-city-field').append($('<option>', { 
          value: "default",
          text : "city",
          selected: "true", 
          disabled: "true"
      }));

      $.ajax({
          url: "/client/api/getStatesOfCountry",
          type: "post",
          data: { countryCode: $("#address-country-field").val() },
          success: function (data) {
              if (data.length == "0") {
                      $('#address-state-field').append($('<option>', { 
                      value: "default",
                      text : "No State Was Found!",
                      selected: "true", 
                      disabled: "true"
                  }));
              }

              $.each(data, function (i, item) {
                  $('#address-state-field').append($('<option>', { 
                      value: item["isoCode"],
                      text : item["name"] 
                  }));
              });
          },
          error: function (err) {
              alert(err);
          },
      });
  });

  $("#address-state-field").on("change", function () {
      $("#address-city-field option").remove();

      $.ajax({
          url: "/client/api/getCitiesOfState",
          type: "post",
          data: { 
              countryCode: $("#address-country-field").val(),
              stateCode: $("#address-state-field").val()
          },
          success: function (data) {
              if (data.length == "0") {
                      $('#address-city-field').append($('<option>', { 
                      value: "default",
                      text : "No City Was Found!",
                      selected: "true", 
                      disabled: "true"
                  }));
              }

              $.each(data, function (i, item) {
                  $('#address-city-field').append($('<option>', { 
                      value: item["isoCode"],
                      text : item["name"] 
                  }));
              });
          },
          error: function (err) {
              alert(err);
          },
      });
  });
})();