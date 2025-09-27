$(document).ready(function () {
  loadAllMaterialData();


  $(".submit-Material").click(function () {
    let id = $("#editId").val();
    let makeName = $("#Material_name").val().trim();

    if (!makeName) {
      alert("Material Name is required.");
      return;
    }

    let url = id ? `/updateMaterial/${id}` : "/addMaterial";
    let method = id ? "PUT" : "POST";

    $.ajax({
      url: url,
      type: method,
      contentType: "application/json",
      data: JSON.stringify({ Material_name: makeName }),
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
        $("#AddMaterial").modal("hide");
        loadAllMaterialData(); // Refresh table after update
      },
      error: function (error) {
        $.toast({
          heading: 'Opps! somthing wents wrong',
          text: 'Error.',
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

function AddNewMaterial() {
  $("#editId").val("");
  $("#Material_name").val("");
  $("#AddMaterial").modal('show');
}

function loadAllMaterialData() {
  $.ajax({
    type: "POST",
    dataType: "json",
    url: "loadAllMaterialData.htm",
    async: true,
    success: function (data) {
      if (data.status) {
        if ($.fn.DataTable.isDataTable('#MaterialMasterTable')) {
          $('#MaterialMasterTable').DataTable().destroy();
        }
        let tbody = $('#MaterialMasterTable tbody').html("");
       // tbody.empty(); // Clear existing table data
        let response = data.data;
        response.forEach((make, index) => {
          let row = `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${make.tmm_name}</td>
                            <td>
                                <button class="btn btn-sm btn-warning edit-btn" data-id="${make.tmm_id}" data-name="${make.tmm_name}">
                                    <i class="fa fa-edit"></i> Edit
                                </button>
                                <button class="btn btn-sm btn-danger delete-btn" data-id="${make.tmm_id}" onclick="DeleteMaterial(`+make.tmm_id+`)">
                                    <i class="fa fa-trash"></i> Delete
                                </button>
                            </td>
                        </tr>
                    `;
          tbody.append(row);
        });
        
        let table = $('#MaterialMasterTable').DataTable({
          searching: true,  // Enable search
          paging: true,     // Enable pagination
          ordering: true,   // Enable sorting
          columnDefs: [
            { targets: 2, orderable: false } // Disable sorting for "Action" column (index 2)
          ]
        });

        $('#MaterialMasterTable').on('click', '.edit-btn', function () {
          let id = $(this).data('id');
          let name = $(this).data('name');
          $("#editId").val(id);
          $("#Material_name").val(name);
          $("#AddMaterial").modal('show');
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

function DeleteMaterial(id){
  if (confirm('Are you sure you want to delete this record?')) {
    $.ajax({
      url: `deleteMaterial/${id}`,
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
        loadAllMaterialData(); // Reload data after delete
      },
      error: function () {
        $.toast({
          heading: 'Opps! somthing wents wrong',
          text: 'Error.',
          position: 'top-right',
          loaderBg:'#fec107',
          icon: 'error',
          hideAfter: 3500
        });
      }
    });
  }
}