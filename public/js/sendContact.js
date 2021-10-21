export const sendContact = (fullName, email, message) => {
    $.ajax({
        url: "/client/api/sendContact",
        type: "post",
        xhrFields: { withCredentials: true },
        data: { fullName: fullName, email: email, message: message },
        success: function (data) {
          alert("Your message was sent successfully!");
          window.location = "/";
        },
        error: function (err) {
          alert(err);
        },
      }); 
  }