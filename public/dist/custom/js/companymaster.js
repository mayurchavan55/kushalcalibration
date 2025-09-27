$(document).ready(function () {
  GetInstrumentMakeMaterial(function (data) {
    if (data) {
      if (data.customer_master && data.customer_master.length) {
        data.customer_master.forEach(function (customer) {
          $("#customer-name").append(
            "<option value='" +
              customer.tcm_id +
              "'>" +
              customer.tcm_company_name +
              "</option>"
          );
        });
      }
    }
  });
});

var Company_name = "";
var Company_address = "";

function getinventorytabledata() {
  var comapny_id = $("#customer-name").val();
  if (comapny_id) {
    $(".customer_table").removeClass("d-none");
  } else {
    $(".customer_table").addClass("d-none");
  }

  $.ajax({
    type: "POST",
    async: false,
    dataType: "json",
    data: {
      comapny_id: comapny_id,
    },
    url: "getcompanymaster.htm",
    success: function (data) {
      if (data.status) {
        var inventory_data = data.data;

        Company_name = inventory_data[0].tcm_company_name;
        Company_address = inventory_data[0].tcm_address;

        $("#CompanyTable").DataTable().clear().destroy();

        $("#CompanyTable").DataTable({
          data: inventory_data,
          columns: [
            { data: null }, // Sr No
            { data: "tjr_customer_id" },
            { data: "tjr_srno" },
            { data: "tim_name" },
            { data: "tjr_range" },
            { data: "tjr_resolution" },
            { data: "tm_name" },
            { data: "tjr_location" },
            {
              data: "tjr_calibration_date",
              render: function (data) {
                return formatDate(data);
              },
            },
            {
              data: "tjr_next_calibration_date",
              render: function (data) {
                return formatDate(data);
              },
            },
            { data: "tjr_remark" },
          ],
          columnDefs: [
            {
              targets: 0,
              searchable: false,
              orderable: false,
            },
            {
              targets: 7, // 👈 Location column index
              visible: false, // Hide column
            },
          ],
          order: [[1, "asc"]],
          drawCallback: function (settings) {
            var api = this.api();
            api
              .column(0, { search: "applied", order: "applied" })
              .nodes()
              .each(function (cell, i) {
                cell.innerHTML = i + 1;
              });
          },
        });
      }
    },
    error: function (err) {
      console.error("Error fetching data:", err);
    },
  });
}

function formatDate(dateString) {
  if (!dateString) return "";
  let date = new Date(dateString);
  if (isNaN(date)) return dateString;
  return date.toLocaleDateString("en-GB");
}

function downloadTablePDF(Company_name, Company_address) {
  const { jsPDF } = window.jspdf;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a2",
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFont("helvetica", "bold"); // Set font to bold
  doc.setFontSize(18);
  const nameTextWidth = doc.getTextWidth(Company_name);
  doc.text(Company_name, (pageWidth - nameTextWidth) / 2, 20);

  doc.setFont("helvetica", "");
  doc.setFontSize(14);
  const addressTextWidth = doc.getTextWidth(Company_address);
  doc.text(Company_address, (pageWidth - addressTextWidth) / 2, 30);

  doc.autoTable({
    html: "#CompanyTable",
    startY: 40,
    theme: "grid",
    margin: { top: 10 },
    styles: { fontSize: 12 },
    headStyles: { fillColor: [37, 150, 190] },
  });

  doc.save("Company List.pdf");
}
