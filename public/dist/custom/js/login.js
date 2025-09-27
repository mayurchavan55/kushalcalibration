$(document).ready(function () {
    $("#login-btn").click(function () {
        var tu_email = $("#username").val();
        var tu_password = $("#Password").val();
        $.ajax({
          type: "POST",
          dataType: "json",
          data: {
            tu_email: tu_email,
            tu_password: tu_password
          },
          url: "signin.htm",
          async: true,
          success: function (data) {
            if (data.status) {
              location.href = data.url;
              $(".error_span").text('').hide();
            }else{
              $(".error_span").text(data.message).show();
            }
    
            setTimeout(() => {
              $(".error_span").fadeOut("slow");
            }, 3000);
    
          },
    
          complete: function (data) {
    
          },
          error: function (err) {
            console.error("Error:", err);
            
            // location.href = "login"
    
          }
    
        })
      });

})