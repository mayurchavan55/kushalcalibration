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
var company_id = "";

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
      if (data.status && Array.isArray(data.data) && data.data.length > 0) {
        var inventory_data = data.data;

        Company_name = inventory_data[0].tcm_company_name || "";
        Company_address = inventory_data[0].tcm_address || "";
        company_id = inventory_data[0].company_id || "";
        // Destroy previous DataTable instance
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
              targets: 7, // Location column index
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
      } else {
        console.warn("No inventory data found for company:", comapny_id);
        Company_name = "";
        Company_address = "";
      }
    },
    error: function (err) {
      console.error("Error fetching data from getcompanymaster:", err);
    },
  });
}


// function downloadTablePDF(Company_name, Company_address) {
//   const { jsPDF } = window.jspdf;

//   const doc = new jsPDF({
//     orientation: "portrait",
//     unit: "mm",
//     format: "a2",
//   });

//   const pageWidth = doc.internal.pageSize.getWidth();

//   // Print company name if available
//   if (Company_name) {
//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(18);
//     const nameTextWidth = doc.getTextWidth(Company_name);
//     doc.text(Company_name, (pageWidth - nameTextWidth) / 2, 20);
//   }

//   // Print company address if available
//   if (Company_address) {
//     doc.setFont("helvetica", "");
//     doc.setFontSize(14);
//     const addressTextWidth = doc.getTextWidth(Company_address);
//     doc.text(Company_address, (pageWidth - addressTextWidth) / 2, 30);
//   }

//   doc.autoTable({
//     html: "#CompanyTable",
//     startY: 40,
//     theme: "grid",
//     margin: { top: 10 },
//     styles: { fontSize: 12 },
//     headStyles: { fillColor: [37, 150, 190] },
//   });

//   doc.save("Company List.pdf");
// }

function downloadTableExcel() {
  var company_id = $("#customer-name").val();
  fetch(`/companymasterExcelfileDownload/${company_id}`)
    .then((res) => {
      if (!res.ok) throw new Error("Network response was not ok");
      return res.blob();
    })
    .then((blob) => {
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "Company List.xlsx"; // file name
      link.click();
    })
    .catch((err) => {
      console.error("Error downloading Excel:", err);
    });
}

async function downloadTablePDF(Company_name, Company_address) {
  var company_id = $("#customer-name").val();
  const { jsPDF } = window.jspdf;

  try {
    // Fetch API data
    const response = await fetch(`companymasterPdfFile/${company_id}`);
    const result = await response.json();
    const data = result.data || [];

    // Function to format date as DD/MM/YYYY
    const formatDate = (dateStr) => {
      if (!dateStr) return "";
      const d = new Date(dateStr);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0"); // month is 0-based
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    };

    // Define headers including Serial No column
    const headers = [
      "S.No", // <-- new serial number column
      "Customer Id",
      "Serial No",
      "Instrument Name",
      "Range",
      "Resolution",
      "Make",
      "Cal Date",
      "Due Date",
      "Remark",
    ];

    // Map API response to rows, adding serial numbers
    const rows = data.map((item, index) => [
      index + 1, // <-- serial number
      item.tjr_customer_id || "",
      item.tjr_srno || "",
      item.tim_name || "",
      item.tjr_range || "",
      item.tjr_resolution || "",
      item.tm_name || "",
      formatDate(item.tjr_calibration_date),
      formatDate(item.tjr_next_calibration_date),
      item.tjr_remark || "",
    ]);

    // Create PDF
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a2",
    });

    const pageWidth = doc.internal.pageSize.getWidth();

    // Print company name
    if (Company_name) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      const nameTextWidth = doc.getTextWidth(Company_name);
      doc.text(Company_name, (pageWidth - nameTextWidth) / 2, 20);
    }

    // Print company address
    if (Company_address) {
      doc.setFont("helvetica", "");
      doc.setFontSize(14);
      const addressTextWidth = doc.getTextWidth(Company_address);
      doc.text(Company_address, (pageWidth - addressTextWidth) / 2, 30);
    }

    // Insert table
    doc.autoTable({
      head: [headers],
      body: rows,
      startY: 40,
      theme: "grid",
      styles: { fontSize: 12 },
      headStyles: { fillColor: [37, 150, 190] },
    });

    doc.save("Company List.pdf");
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
}


function formatDate(dateString) {
  if (!dateString) return "";
  let date = new Date(dateString);
  if (isNaN(date)) return dateString;
  return date.toLocaleDateString("en-GB");
}
