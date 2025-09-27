$(document).ready(function () {
  loadAllInstrumentsData();


  $(".submit-Instruments").click(function () {
    let id = $("#editId").val();
    let makeName = $("#Instruments_name").val().trim();

    if (!makeName) {
      alert("Instruments Name is required.");
      return;
    }

    let url = id ? `/updateInstruments/${id}` : "/addInstruments";
    let method = id ? "PUT" : "POST";

    $.ajax({
      url: url,
      type: method,
      contentType: "application/json",
      data: JSON.stringify({ Instruments_name: makeName }),
      success: function (response) {
        $.toast({
          heading: 'Success',
          text: response.message,
          position: 'top-right',
          loaderBg:'#e6b034',
          icon: 'success',
          hideAfter: 3500, 
          stack: 6
        });
        // alert(response.message);
        $("#AddInstruments").modal("hide");
        loadAllInstrumentsData(); // Refresh table after update
      },
      error: function (error) {
        $.toast({
          heading: 'Opps! somthing wents wrong',
          text: 'Error deleting record.',
          position: 'top-right',
          loaderBg:'#fec107',
          icon: 'error',
          hideAfter: 3500
        });
        console.error(error);
      }
    });
  });
});

function AddNewInstruments() {
  $("#editId").val("");
  $("#Instruments_name").val("");
  $("#AddInstruments").modal('show');
}

function loadAllInstrumentsData() {
  $.ajax({
    type: "POST",
    dataType: "json",
    url: "loadAllInstrumentsData.htm",
    async: true,
    success: function (data) {
      if (data.status) {
        if ($.fn.DataTable.isDataTable('#InstrumentsMasterTable')) {
          $('#InstrumentsMasterTable').DataTable().destroy();
        }
        let tbody = $('#InstrumentsMasterTable tbody').html("");
       // tbody.empty(); // Clear existing table data
        let response = data.data;
        response.forEach((make, index) => {
          let row = `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${make.tim_name}</td>
                            <td>
                                <button class="btn btn-sm btn-warning edit-btn" data-id="${make.tim_id}" data-name="${make.tim_name}">
                                    <i class="fa fa-edit"></i> Edit
                                </button>
                                <button class="btn btn-sm btn-danger delete-btn" data-id="${make.tim_id}" onclick="DeleteInstruments(`+make.tim_id+`)">
                                    <i class="fa fa-trash"></i> Delete
                                </button>
                            </td>
                        </tr>
                    `;
          tbody.append(row);
        });
        
        let table = $('#InstrumentsMasterTable').DataTable({
          searching: true,  // Enable search
          paging: true,     // Enable pagination
          ordering: true,   // Enable sorting
          columnDefs: [
            { targets: 2, orderable: false } // Disable sorting for "Action" column (index 2)
          ]
        });

        $('#InstrumentsMasterTable').on('click', '.edit-btn', function () {
          let id = $(this).data('id');
          let name = $(this).data('name');
          $("#editId").val(id);
          $("#Instruments_name").val(name);
          $("#AddInstruments").modal('show');
        });

      } else {
        $.toast({
          heading: 'Opps! somthing wents wrong',
          text: 'Error.',
          position: 'top-right',
          loaderBg:'#fec107',
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

function DeleteInstruments(id){
  if (confirm('Are you sure you want to delete this record?')) {
    $.ajax({
      url: `deleteInstruments/${id}`,
      type: 'DELETE',
      success: function () {
        $.toast({
          heading: 'Success',
          text: 'Record deleted successfully!',
          position: 'top-right',
          loaderBg:'#e6b034',
          icon: 'success',
          hideAfter: 3500, 
          stack: 6
        });
        // alert('Record deleted successfully!');
        loadAllInstrumentsData(); // Reload data after delete
      },
      error: function () {
        $.toast({
          heading: 'Opps! somthing wents wrong',
          text: 'Error deleting record.',
          position: 'top-right',
          loaderBg:'#fec107',
          icon: 'error',
          hideAfter: 3500
        });
        //alert('Error deleting record.');
      }
    });
  }
}