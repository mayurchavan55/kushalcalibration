$(document).ready(function () {
  $(".reset-password").click(function () {
    let email_id = $("#exampleInputEmail_2").val().trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  

    if (!email_id) {
      // alert("Email is required.");
      $(".error_span").text('Email is required');
      $(".error_span").fadeIn(1000).delay(5000).fadeOut(1000);
      return;
    }
    if(!emailRegex.test(email_id)){
      $(".error_span").text('Please enter valid email id.');
      $(".error_span").fadeIn(1000).delay(5000).fadeOut(1000);
      return;
    }

    $(".reset-password .loader").show();
    $.ajax({
      url: "reset-password.htm",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ tu_email: email_id }),
      beforeSend: function () {
        $("#loading_coupon").removeClass("d-none");
      },
      success: function (data) {
        if(data.status){
          $(".success-span").text(data.message);
          $(".success-span").fadeIn(1000).delay(5000).fadeOut(1000);
          setTimeout(function () {
              window.location.href = "/"; // Change to your desired URL
          }, 3000); // 5000 milliseconds = 5 seconds
        }else{
          $(".error_span").text(data.message);
          $(".error_span").fadeIn(1000).delay(5000).fadeOut(1000);
        }
        
      },
      complete: function (data) {
        $("#loading_coupon").addClass("d-none");
      },
      error: function (error) {
        // alert("Error saving data.");
        console.error(error);
        // $(".reset-password .loader").hide();
      }
    });
  });


  $(".update-password").click(function () {
 
    let password = $("#exampleInputpwd_2").val().trim();
    let confirmPassword = $("#exampleInputpwd_3").val().trim();
    let isValid = true;
    let email = $("#email").val().trim();

    if (password === "") {
      $("#passwordError").fadeIn();
      isValid = false;
    }

    if (confirmPassword === "" || password !== confirmPassword) {
        $("#confirmPasswordError").fadeIn();
        isValid = false;
    }
    if (isValid) {
      $("#passwordError").fadeOut();
      $("#confirmPasswordError").fadeOut();
    }

    $.ajax({
      url: "update-password.htm",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ tu_email: email, password:password }),
      success: function (data) {
        if(data.status){
          $(".success-span").text(data.message);
          $(".success-span").fadeIn(1000).delay(5000).fadeOut(1000);
          setTimeout(function () {
              window.location.href = "/"; // Change to your desired URL
          }, 3000); // 5000 milliseconds = 5 seconds

        }else{
          $(".error_span").text(data.message);
          $(".error_span").fadeIn(1000).delay(5000).fadeOut(1000);
        }
        
      },
      error: function (error) {
        alert("Error saving data.");
        console.error(error);
        $(".reset-password .loader").hide();
      }
    });
  });
});
