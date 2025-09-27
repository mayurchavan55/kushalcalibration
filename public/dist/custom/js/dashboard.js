$(document).ready(function () {
  $('#customer_due_list').DataTable({
    "pageLength": 5,  // Show 5 records per page
    "lengthMenu": [5, 10, 25, 50, 100], // Options for the user
    "ordering": true, // Enable sorting
    "searching": true, // Enable search
    "responsive": true // Enable responsiveness
  });
  $("#sendReminderButton").click(function () {
    var customer_id = $("#editId").val();
    // alert(customer_id)
    $.ajax({
      url: "sendReminder.htm",
      type: 'POST',
      contentType: "application/json",
      async: true,
      dataType: "json",
      data: JSON.stringify({ customer_id: customer_id }),
      beforeSend: function () {
        $("#loading_coupon").removeClass("d-none");
      },
      success: function (data) {
        if (data.status) {
          $.toast({
            heading: 'Success',
            text: "Reminder email send successfully.",
            position: 'top-right',
            loaderBg: '#e6b034',
            icon: 'success',
            hideAfter: 3500,
            stack: 6
          });
          $("#sendReminder").modal('hide');
          getDashboardData();
        } else {
          $.toast({
            heading: 'Opps! somthing wents wrong',
            text: 'Error deleting record.',
            position: 'top-right',
            loaderBg: '#fec107',
            icon: 'error',
            hideAfter: 3500
          });
        }
      },
      complete: function (data) {
        $("#loading_coupon").addClass("d-none");
      },
      error: function (error) {
        $.toast({
          heading: 'Opps! somthing wents wrong',
          text: 'Error deleting record.',
          position: 'top-right',
          loaderBg: '#fec107',
          icon: 'error',
          hideAfter: 3500
        });
        // console.error(error);
      }
    });
  })
  getDashboardData();
});
function getDashboardData() {
  $.ajax({
    type: "POST",
    dataType: "json",
    url: "getDashboardData.htm",
    async: true,
    success: function (data) {
      if (data.status) {
        var active_customer = data.data.active_customer;
        var due_customer = data.data.due_customer;
        var total_customer = data.data.total_customer;
        var total_due_customer = data.data.total_due_customer;
        if(total_due_customer.length > 0){
          $(".due_customer").text(total_due_customer[0].total_due);
        }else{
          $(".due_customer").text(0);
        }

        if(active_customer.length > 0){
          $(".active_customer").text(active_customer[0].active_customer);
        }else{
          $(".active_customer").text(0);
        }
        if(total_customer.length > 0){
          $(".total_customer").text(total_customer[0].toatl_customer);
        }else{
          $(".total_customer").text(0);
        }

        
        if ($.fn.DataTable.isDataTable('#customer_due_list')) {
          $('#customer_due_list').DataTable().destroy();
        }
        let tbody = $('#customer_due_list tbody').html("");
        due_customer.forEach((dtl, index) => {
          var isreminder_send = dtl.isreminder_sent == 1 ? true : false;
          let row = `
                      <tr>
                          <td>${dtl.company_name}</td>
                          <td>${dtl.contact_name}</td>
                          <td>${dtl.company_email}</td>
                          <td>${dtl.contact_mobile}</td>
                          <td>${dtl.tjr_next_calibration_date}</td>
                          <td>${isreminder_send}</td>
                          <td>
                              <button class="btn btn-sm btn-warning edit-btn" data-id="${dtl.customer_id}" data-name="${dtl.company_name}" data-isreminder="${isreminder_send}">
                                  <i class="fa fa-eye"></i> view
                              </button>
                          </td>
                      </tr>
                  `;
          tbody.append(row);
        });

        let table = $('#customer_due_list').DataTable({
          searching: true,  // Enable search
          paging: true,     // Enable pagination
          ordering: true,   // Enable sorting
          order: [[4, 'asc']],
          columnDefs: [
            { targets: 6, orderable: false } // Disable sorting for "Action" column (index 2)
          ]
        });

        $('#customer_due_list').on('click', '.edit-btn', function () {
          let id = $(this).data('id');
          let name = $(this).data('name');
          let isreminder = $(this).data('isreminder');
          if(isreminder){
            $("#sendReminderButton").addClass("d-none");
          }else{
            $("#sendReminderButton").removeClass("d-none");
          }
          $("#sendReminderLabel").text('Calibration Due Instruments for ' + name + '!')
          $("#editId").val(id);
          fetchdueListbyCustomer(id);

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
      console.error("Error:", err);
      // location.href = "/"

    }

  })
}

function fetchdueListbyCustomer(id) {
  $.ajax({
    url:  "getCustomerDueData.htm",
    type: 'POST',
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify({ customer_id: id }),
    success: function (data) {
      if(data.status){
        var due_data = data.data;
        if ($.fn.DataTable.isDataTable('#job_due_list')) {
          $('#job_due_list').DataTable().destroy();
        }
        let tbody = $('#job_due_list tbody').html("");
        // tbody.empty(); // Clear existing table data
        let response = data.data;
        response.forEach((dtl, index) => {
          let row = `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${dtl.serial_no}</td>
                            <td>${dtl.instrument_name}</td>
                            <td>${dtl.range_size}</td>
                            <td>${dtl.resolution_lc}</td>
                            <td>${dtl.make}</td>
                            <td>${dtl.tjr_calibration_date}</td>
                            <td>${dtl.tjr_next_calibration_date}</td>
                        </tr>
                    `;
          tbody.append(row);
        });

        let table = $('#job_due_list').DataTable({
          searching: true,  // Enable search
          paging: true,     // Enable pagination
          ordering: true,   // Enable sorting
          columnDefs: [
            { targets: 2, orderable: false } // Disable sorting for "Action" column (index 2)
          ]
        });


        $("#sendReminder").modal('show');
      }else{
        $.toast({
          heading: 'Opps! somthing wents wrong',
          text: 'Error deleting record.',
          position: 'top-right',
          loaderBg: '#fec107',
          icon: 'error',
          hideAfter: 3500
        });
      }
    },
    error: function (error) {
      $.toast({
        heading: 'Opps! somthing wents wrong',
        text: 'Error deleting record.',
        position: 'top-right',
        loaderBg: '#fec107',
        icon: 'error',
        hideAfter: 3500
      });
      // console.error(error);
    }
  });
}