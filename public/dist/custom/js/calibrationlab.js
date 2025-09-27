$(document).ready(function () {
    loadAllDeleteCalibrationlabData();
  
  
    $(".submit-calibrationlab").click(function () {
      let id = $("#editId").val();
      let Calibrationlab_name = $("#Calibrationlab_name").val().trim();
  
      if (!Calibrationlab_name) {
        alert("Calibration lab Name is required.");
        return;
      }
  
      let url = id ? `/updateCalibrationlab/${id}` : "/addCalibrationlab";
      let method = id ? "PUT" : "POST";
  
      $.ajax({
        url: url,
        type: method,
        contentType: "application/json",
        data: JSON.stringify({ Calibrationlab_name: Calibrationlab_name }),
        success: function (response) {
          $.toast({
            heading: 'Success',
            text: response.message,
            position: 'top-right',
            loaderBg: '#e6b034',
            icon: 'success',
            hideAfter: 3500,
            stack: 6
          });
          $("#AddCalibrationlab").modal("hide").on("hidden.bs.modal", function () {
            loadAllDeleteCalibrationlabData();
          });
        },
        error: function (error) {
          $.toast({
            heading: 'Opps! somthing wents wrong',
            text: 'Error.',
            position: 'top-right',
            loaderBg: '#fec107',
            icon: 'error',
            hideAfter: 3500
          });
          console.error(error);
        }
      });
    });
  });
  
  function AddNewCalibration() {
    $("#editId").val("");
    $("#Calibrationlab_name").val("");
    $("#AddCalibrationlab").modal('show');
  }
  
  function loadAllDeleteCalibrationlabData() {
    $.ajax({
      type: "GET",
      dataType: "json",
      url: "loadAllcalbrationlabData",
      async: true,
      success: function (data) {
        if (data.status) {
          if ($.fn.DataTable.isDataTable('#CalibrationlabTable')) {
            $('#CalibrationlabTable').DataTable().destroy();
          }
          let tbody = $('#CalibrationlabTable tbody').html("");
          // tbody.empty(); // Clear existing table data
          let response = data.data;
          response.forEach((Calibrationlab, index) => {
            let row = `
                          <tr>
                              <td>${index + 1}</td>
                              <td>${Calibrationlab.tcl_name}</td>
                              <td>
                                  <button class="btn btn-sm btn-warning edit-btn" data-id="${Calibrationlab.tcl_id}" data-name="${Calibrationlab.tcl_name}">
                                      <i class="fa fa-edit"></i> Edit
                                  </button>
                                  <button class="btn btn-sm btn-danger delete-btn" data-id="${Calibrationlab.tcl_id}" onclick="DeleteCalibrationlab(` + Calibrationlab.tcl_id + `)">
                                      <i class="fa fa-trash"></i> Delete
                                  </button>
                              </td>
                          </tr>
                      `;
            tbody.append(row);
          });
  
          let table = $('#CalibrationlabTable').DataTable({
            searching: true,  // Enable search
            paging: true,     // Enable pagination
            ordering: true,   // Enable sorting
            columnDefs: [
              { targets: 2, orderable: false } // Disable sorting for "Action" column (index 2)
            ]
          });
  
          $('#CalibrationlabTable').on('click', '.edit-btn', function () {
            let id = $(this).data('id');
            let name = $(this).data('name');
            $("#editId").val(id);
            $("#Calibrationlab_name").val(name);
            $("#AddCalibrationlab").modal('show');
          });
        } else {
          $.toast({
            heading: 'Opps! somthing wents wrong',
            text: 'Error.',
            position: 'top-right',
            loaderBg: '#fec107',
            icon: 'error',
            hideAfter: 3500
          });
        }
  
      },
  
      complete: function (data) {
  
      },
      error: function (err) {
        console.log(err);      
        // location.href = "/"
      }
  
    })
  }
  
  
  function DeleteCalibrationlab(id) {
    if (confirm('Are you sure you want to delete this record?')) {
      $.ajax({
        url: `deleteCalibrationlab/${id}`,
        type: 'DELETE',
        success: function () {
          $.toast({
            heading: 'Success',
            text: 'Record deleted successfully!',
            position: 'top-right',
            loaderBg: '#e6b034',
            icon: 'success',
            hideAfter: 3500,
            stack: 6
          });
          loadAllDeleteCalibrationlabData(); // Reload data after delete
        },
        error: function () {
          $.toast({
            heading: 'Opps! somthing wents wrong',
            text: 'Error.',
            position: 'top-right',
            loaderBg: '#fec107',
            icon: 'error',
            hideAfter: 3500
          });
        }
      });
    }
  }