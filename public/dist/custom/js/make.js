$(document).ready(function () {
  loadAllMAkeData();


  $(".submit-make").click(function () {
    let id = $("#editId").val();
    let makeName = $("#make_name").val().trim();

    if (!makeName) {
      alert("Make Name is required.");
      return;
    }

    let url = id ? `/updateMake/${id}` : "/addMake";
    let method = id ? "PUT" : "POST";

    $.ajax({
      url: url,
      type: method,
      contentType: "application/json",
      data: JSON.stringify({ make_name: makeName }),
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
        $("#AddMake").modal("hide").on("hidden.bs.modal", function () {
          loadAllMAkeData();
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

function AddNewMake() {
  $("#editId").val("");
  $("#make_name").val("");
  $("#AddMake").modal('show');
}

function loadAllMAkeData() {
  $.ajax({
    type: "POST",
    dataType: "json",
    url: "loadAllMAkeData.htm",
    async: true,
    success: function (data) {
      if (data.status) {
        if ($.fn.DataTable.isDataTable('#makeMasterTable')) {
          $('#makeMasterTable').DataTable().destroy();
        }
        let tbody = $('#makeMasterTable tbody').html("");
        // tbody.empty(); // Clear existing table data
        let response = data.data;
        response.forEach((make, index) => {
          let row = `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${make.tm_name}</td>
                            <td>
                                <button class="btn btn-sm btn-warning edit-btn" data-id="${make.tm_id}" data-name="${make.tm_name}">
                                    <i class="fa fa-edit"></i> Edit
                                </button>
                                <button class="btn btn-sm btn-danger delete-btn" data-id="${make.tm_id}" onclick="DeleteMake(` + make.tm_id + `)">
                                    <i class="fa fa-trash"></i> Delete
                                </button>
                            </td>
                        </tr>
                    `;
          tbody.append(row);
        });

        let table = $('#makeMasterTable').DataTable({
          searching: true,  // Enable search
          paging: true,     // Enable pagination
          ordering: true,   // Enable sorting
          columnDefs: [
            { targets: 2, orderable: false } // Disable sorting for "Action" column (index 2)
          ]
        });

        $('#makeMasterTable').on('click', '.edit-btn', function () {
          let id = $(this).data('id');
          let name = $(this).data('name');
          $("#editId").val(id);
          $("#make_name").val(name);
          $("#AddMake").modal('show');
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


function DeleteMake(id) {
  if (confirm('Are you sure you want to delete this record?')) {
    $.ajax({
      url: `deleteMake/${id}`,
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
        loadAllMAkeData(); // Reload data after delete
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