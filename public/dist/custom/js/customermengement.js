$(document).ready(function () {
  loadAllCustomerData();

  $(".submit-customer").click(function () {
    let isValid = true;
    let id = $("#customereditId").val();

    // Get input elements
    const contactNameInput = document.getElementById("contact-name");
    const companyNameInput = document.getElementById("company-name");
    const emailInput = document.getElementById("email");
    const mobileInput = document.getElementById("mobile");
    const addressInput = document.getElementById("address");
  
    // Get error elements
    const contactNameError = document.getElementById("contact-name-error");
    const companyNameError = document.getElementById("company-name-error");
    const emailError = document.getElementById("email-error");
    const mobileError = document.getElementById("mobile-error");
    const addressError = document.getElementById("address-error");
  
    // Trim values
    let contactName = contactNameInput?.value.trim() || "";
    let companyName = companyNameInput?.value.trim() || "";
    let email = emailInput?.value.trim() || "";
    let mobile = mobileInput?.value.trim() || "";
    let address = addressInput?.value.trim() || "";
  
    // Validation
    if (!contactName) {
      contactNameError.innerText = "Contact person name is required.";
      isValid = false;
    } else {
      contactNameError.innerText = "";
    }
  
    if (!companyName) {
      companyNameError.innerText = "Company name is required.";
      isValid = false;
    } else {
      companyNameError.innerText = "";
    }
  
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      emailError.innerText = "Email is required.";
      isValid = false;
    } else if (!emailPattern.test(email)) {
      emailError.innerText = "Enter a valid email address.";
      isValid = false;
    } else {
      emailError.innerText = "";
    }
  
    if (!mobile) {
      mobileError.innerText = "Mobile number is required.";
      isValid = false;
    } else if (!/^\d{10}$/.test(mobile)) {
      mobileError.innerText = "Enter a valid 10-digit mobile number.";
      isValid = false;
    } else {
      mobileError.innerText = "";
    }
  
    if (!address) {
      addressError.innerText = "Address is required.";
      isValid = false;
    } else {
      addressError.innerText = "";
    }
  
    // Stop if validation fails
    if (!isValid) {
      return;
    }
  
    let url = id ? `/updatecustomersMangement/${id}` : "/Addcustomersmangement";
    let method = id ? "PUT" : "POST";
  
    // AJAX request
    $.ajax({
      type: method,
      url: url,
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify({
        contact_name: contactName,
        company_name: companyName,
        email: email,
        mobile: mobile,
        address: address
      }),
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
        $("#customerModal").modal("hide");
        loadAllCustomerData();
      },
      error: function (error) {
        $.toast({
          heading: 'Oops! Something went wrong',
          text: 'Error occurred.',
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

function userDetailsModel() {
  $("#customereditId").val("");
  $("#contact-name").val("");
  $("#company-name").val("");
  $("#email").val("");
  $("#mobile").val("");
  $("#address").val("");
  $("#customerModal").modal("show");
}




function customerManagementModelClose() {
  document.getElementById("contact-name").value = "";
  document.getElementById("company-name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("mobile").value = "";
  document.getElementById("address").value = "";

  document.getElementById("contact-name-error").innerText = "";
  document.getElementById("company-name-error").innerText = "";
  document.getElementById("email-error").innerText = "";
  document.getElementById("mobile-error").innerText = "";
  document.getElementById("address-error").innerText = "";
}

function loadAllCustomerData() {
  $.ajax({
    type: "GET",
    dataType: "json",
    url: "getcustomerdata.htm",
    async: true,
    success: function (data) {
      if (data.status) {
        if ($.fn.DataTable.isDataTable('#customerMasterTable')) {
          $('#customerMasterTable').DataTable().destroy();
        }
        let tbody = $('#customerMasterTable tbody').html("");
        // tbody.empty(); // Clear existing table data
        let response = data.data;
        response.forEach((customer, index) => {
          let shortAddress = customer.tcm_address.length > 30 
          ? customer.tcm_address.substring(0, 30) + "..." 
          : customer.tcm_address;
          let row = `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${customer.tcm_contact_person}</td>
                              <td>${customer.tcm_company_name}</td>
                              <td>${customer.tcm_email}</td>
                              <td>${customer.tcm_mobile}</td>
                              <td title="${customer.tcm_address}" style="cursor: pointer;">${shortAddress}</td>
                            <td>
                                <button class="btn btn-sm btn-warning edit-btn" data-id="${customer.tcm_id}"data-contactperson="${customer.tcm_contact_person}"data-companyname="${customer.tcm_company_name}"data-email="${customer.tcm_email}"data-mobile="${customer.tcm_mobile}" data-addres="${customer.tcm_address}">
                                    <i class="fa fa-edit"></i> Edit
                                </button>
                                <button class="btn btn-sm btn-danger delete-btn" data-id="${customer.tcm_id}" onclick="deleteCustomer(` + customer.tcm_id + `)">
                                    <i class="fa fa-trash"></i> Delete
                                </button>
                            </td>
                        </tr>
                    `;
          tbody.append(row);
        });

        let table = $('#customerMasterTable').DataTable({
          searching: true,  // Enable search
          paging: true,     // Enable pagination
          ordering: true,   // Enable sorting
          columnDefs: [
            { targets: 2, orderable: false } // Disable sorting for "Action" column (index 2)
          ]
        });

        $('#customerMasterTable').on('click', '.edit-btn', function () {
          let id = $(this).data('id');
          let contactperson = $(this).data('contactperson');
          let companyname = $(this).data('companyname');
          let email = $(this).data('email');
          let mobile = $(this).data('mobile');
          let addres = $(this).data('addres');
          $("#customereditId").val(id);
          $("#contact-name").val(contactperson);
          $("#company-name").val(companyname);
          $("#email").val(email);
          $("#mobile").val(mobile);
          $("#address").val(addres);
          $("#customerModal").modal('show');
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

function deleteCustomer(id) {
  if (confirm('Are you sure you want to delete this record?')) {
    $.ajax({
      url: `deletecustomersMangement/${id}`,
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
        loadAllCustomerData(); // Reload data after delete
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