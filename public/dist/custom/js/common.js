function GetInstrumentMakeMaterial(callback) {
    $.ajax({
      type: "GET",
      async: false,
      dataType: "json",
      url: "getAllInstrumentsMaterialsMakes.htm",
      success: function (data) {
        if (data.status) {
          callback(data.data)
        }
      },
      complete: function (data) {
      },
      error: function (err) {
      },
    });
  
  }