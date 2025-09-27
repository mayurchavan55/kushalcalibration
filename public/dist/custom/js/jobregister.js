const instrumentMap = {};
const makeMap = {};
const materialMap = {};
const customerMap = {};
$(document).ready(function () {
    
    loadAllJobRegisterData();
    GetInstrumentMakeMaterial(function (data) {
        if (data) {
            data.instruments_master.forEach(item => {
                instrumentMap[item.tim_name] = item.tim_id;
                $("#instrument_master").append(`<option value="${item.tim_id}">${item.tim_name}</option>`);
              });
              data.make_master.forEach(item => {
                makeMap[item.tm_name] = item.tm_id;
                $("#make_manufacturer").append(`<option value="${item.tm_id}">${item.tm_name}</option>`);
              });
              data.material_master.forEach(item => {
                materialMap[item.tmm_name] = item.tmm_id;
                $("#material").append(`<option value="${item.tmm_id}">${item.tmm_name}</option>`);
              });
              data.customer_master.forEach(item => {
                customerMap[item.tcm_company_name] = item.tcm_id;
                $("#customer-name").append(`<option value="${item.tcm_id}">${item.tcm_company_name}</option>`);
              });
              
              // Apply editableSelect() AFTER appending options
              $('#instrument_master').editableSelect();
              $('#make_manufacturer').editableSelect();
              $('#material').editableSelect();
              $('#customer-name').editableSelect();

            if (data.calibrationlab_master && data.calibrationlab_master.length) {
                data.calibrationlab_master.forEach(function (calibrationlab) {
                    $("#cal-lab").append(
                        "<option value='" + calibrationlab.tcl_id + "'>" +
                        calibrationlab.tcl_name +
                        "</option>"
                    );
                });
            }
        }
    });

    $(".submit-jobregister").click(function () {
        let isValid = true;
        let id = $("#jobregistereditId").val();
        $(".error-message").text("");
        function validateField(id, errorId, errorMessage) {
            let value = document.getElementById(id).value.trim();
            if (!value) {
                document.getElementById(errorId).textContent = errorMessage;
                isValid = false;
            }
        }
        validateField('customer-name', 'customer-name-error', "Please enter the Customer Name.");
        validateField('instrument_master', 'instrument-master-error', "Please select the Instrument / Gauge.");
        validateField('make_manufacturer', 'make-manufacturer-error', "Please select the Make / Manufacturer.");
        validateField('material', 'material-error', "Please select the Material.");
        validateField('size-range', 'size-range-error', "Please enter the Size / Range.");
        validateField('lc-resolution', 'lc-resolution-error', "Please enter the L.C. / Resolution.");
        validateField('serial-no', 'serial-no-error', "Please enter the Serial No.");
        validateField('customer-id', 'customer-id-error', "Please enter the Customer ID No.");
        validateField('model-no', 'model-no-error', "Please enter the Model No.");

        if (!isValid) return false;
        let formData = {
            customer_name: customerMap[$("#customer-name").val()],
            instrument_master: instrumentMap[$("#instrument_master").val()],
            make_manufacturer: makeMap[$("#make_manufacturer").val()],
            material: materialMap[$("#material").val()],
            size_range: $("#size-range").val(),
            lc_resolution: $("#lc-resolution").val(),
            serial_no: $("#serial-no").val(),
            customer_id: $("#customer-id").val(),
            model_no: $("#model-no").val(),
            grade: $("#grade").val(),
            customer_ref: $("#customer-ref").val(),
            lab_ref_no: $("#lab-ref-no").val(),
            lab_id: $("#lab-id").val(),
            certificate_no: $("#certificate-no").val(),
            ulr_no: $("#ulr-no").val(),
            date_receipt: $("#date-receipt").val(),
            calibration_date: $("#calibration-date").val(),
            next_calibration_date: $("#next-calibration-date").val(),
            certificate_issue_date: $("#certificate-issue-date").val(),
            remark: $("#remark").val(),
            additional_details: $("#additional-details").val(),
            status: $("#status").val(),
            cal_lab: $("#cal-lab").val(),
            frequency_month: $("#frequency-date").val(),
            location: $("#location").val(),
        };
        let url = id ? `/updatejobregister/${id}` : "/Addjobregister.htm";
        let method = id ? "PUT" : "POST";
        $.ajax({
            type: method,
            url: url,
            dataType: "json",
            data: formData,
            success: function (response) {
                if (response.status == true) {
                    $("#jobregisterModal").modal('hide');
                    $.toast({
                        heading: 'Success',
                        text: response.message,
                        position: 'top-right',
                        loaderBg: '#e6b034',
                        icon: 'success',
                        hideAfter: 3500,
                        stack: 6
                    });
                    jobRegisterClear();
                    loadAllJobRegisterData();
                }
            },
            error: function (err) {
                $.toast({
                    heading: 'Oops! Something went wrong',
                    text: 'Error occurred.',
                    position: 'top-right',
                    loaderBg: '#fec107',
                    icon: 'error',
                    hideAfter: 3500
                });
                console.error("Error:", err);
            }
        });
    });

    $("#calibration-date, #frequency-date").on("change", function () {
        calculateNextCalibrationDate();
    });

    function calculateNextCalibrationDate() {
        let calibrationDate = $("#calibration-date").val();
        let frequencyMonths = $("#frequency-date").val();
        let nextCalibrationInput = $("#next-calibration-date");

        if (calibrationDate && frequencyMonths) {
            let date = new Date(calibrationDate);
            date.setMonth(date.getMonth() + parseInt(frequencyMonths)); // Add frequency in months

            let nextCalibrationDate = date.toISOString().split("T")[0];
            nextCalibrationInput.val(nextCalibrationDate);
        } else {
            nextCalibrationInput.val(""); // Reset if no selection
        }
    }
});

function jobregisterModel() {
    $("#jobregisterModal").modal("show");
    if ($("#instrument_master").val() === "") {
        $(".changetheinputfiled").show();
        $(".gaugeinputfiled").hide();
    }
    $("#jobregistereditId, #customer-name, #instrument_master,#lc-resolution-unit, #make_manufacturer, #material, #size-range, #lc-resolution, #serial-no, #customer-id, #model-no, #measurement, #grade, #customer-ref, #lab-ref-no, #lab-id, #certificate-no, #ulr-no, #date-receipt, #calibration-date, #next-calibration-date, #certificate-issue-date, #remark, #additional-details").val("");
    $("#status, #cal-lab, #frequency-date").val(1)
}

function jobRegisterClear() {
    $("input, select, textarea").val("");
    $(".error-message").text(""); // Clear error messages
    $("#form-error").text(""); // Clear form submission error message
}

function loadAllJobRegisterData() {
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "getjobregister.htm",
        success: function (data) {
            if (data.status) {
                if ($.fn.DataTable.isDataTable('#job_register_table')) {
                    $('#job_register_table').DataTable().destroy();
                }
                let tbody = $('#job_register_table tbody').html("");
                data.data.forEach((job_register, index) => {
                    let row = `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${job_register.tjr_customer_id}</td>
                            <td>${job_register.tjr_srno}</td>
                            <td>${job_register.tim_name}</td>
                            <td>${job_register.tjr_range}</td>
                            <td>${job_register.tjr_resolution}</td>
                            <td>${job_register.tm_name}</td>
                            <td class ='d-none'>${job_register.tjr_location}</td>
                            <td>${formatDate(job_register.tjr_calibration_date)}</td>
                            <td>${formatDate(job_register.tjr_next_calibration_date)}</td>
                            <td>
                                <button class="btn btn-sm btn-warning edit-btn" onclick="editjobregister(${job_register.tjr_id})"> <i class="fa fa-edit"></i> Edit
                                </button>
                                <button class="btn btn-sm btn-danger delete-btn" data-id="${job_register.tjr_id}" onclick="deletejobregister(${job_register.tjr_id})">
                                    <i class="fa fa-trash"></i> Delete
                                </button>
                            </td>
                        </tr>
                    `;
                    tbody.append(row);
                });
                $('#job_register_table').DataTable({
                    searching: true,
                    paging: true,
                    ordering: false,
                   
                });
            } else {
                $.toast({
                    heading: 'Oops! Something went wrong',
                    text: 'Error.',
                    position: 'top-right',
                    loaderBg: '#fec107',
                    icon: 'error',
                    hideAfter: 3500
                });
            }
        },
        error: function (err) {
            console.error("Error:", err);
            // location.href = "/";
        }
    });
}


function formatDate(dateString) {
    if (!dateString) return '';
    let date = new Date(dateString);
    if (isNaN(date)) return dateString;
    return date.toLocaleDateString('en-GB');
}

function deletejobregister(id) {
    if (confirm("Are you sure you want to delete this job register?")) {
        $.ajax({
            type: "DELETE",
            url: `/deletejobregister/${id}`,
            success: function (response) {
                if (response.status == true) {
                    $.toast({
                        heading: 'Success',
                        text: response.message,
                        position: 'top-right',
                        loaderBg: '#e6b034',
                        icon: 'success',
                        hideAfter: 3500,
                        stack: 6
                    });
                    loadAllJobRegisterData();
                } else {
                    $.toast({
                        heading: 'Error',
                        text: response.message,
                        position: 'top-right',
                        loaderBg: '#e6b034',
                        icon: 'error',
                        hideAfter: 3500,
                        stack: 6
                    });
                }
            },
            error: function (err) {
                console.error("Error:", err);
            }
        });
    }
}



function editjobregister(id) {
    $.ajax({
        type: "GET",
        url: `/updateJobRegistrationData/${id}`,
        success: function (response) {
            if (response.status === true && response.data) {
                const data = response.data[0]; // assuming data is an array

                // Helper function to set dropdown properly,
                // works with regular <select> or EditableSelect input
                function setDropdown(selector, value, text) {
                    let $dropdown = $(selector);

                    // If EditableSelect is initialized, the original <select> is replaced by an <input>
                    // So we check if it's editable select and handle accordingly
                    let esInstance = $dropdown.data('editable-select');
                    if (esInstance) {
                        // editableSelect stores original select in esInstance.$select
                        // Add option to original <select> if missing
                        let $originalSelect = esInstance.$select;
                        if ($originalSelect.find(`option[value='${value}']`).length === 0) {
                            $originalSelect.append(new Option(text, value));
                        }

                        // Set original select value
                        $originalSelect.val(value);

                        // Set visible input value (editable select replaces select with input)
                        $dropdown.val(text);

                        // Trigger change event on input and original select
                        $dropdown.trigger('change');
                        $originalSelect.trigger('change');

                    } else {
                        // Normal select element

                        // Add option if missing
                        if ($dropdown.find(`option[value='${value}']`).length === 0) {
                            $dropdown.append(new Option(text, value));
                        }

                        // Set the value and trigger change
                        $dropdown.val(value).trigger('change');
                    }
                }

                // Helper function to format and set date input values (yyyy-MM-dd)
                function setFormattedDate(selector, dateValue) {
                    if (!dateValue) return;
                    let formattedDate = new Date(dateValue).toISOString().split('T')[0];
                    $(selector).val(formattedDate);
                }

                // Set dropdowns
                setDropdown("#instrument_master", data.instrument_id, data.tim_name);
                setDropdown("#make_manufacturer", data.make_id, data.tm_name);
                setDropdown("#material", data.material_id, data.tmm_name);
                setDropdown("#customer-name", data.customer_id, data.tcm_company_name);
                setDropdown("#frequency-date", data.tjr_frequency_month, data.tjr_frequency_month);
                setDropdown("#cal-lab", data.tcl_id, data.tcl_name);

                // Set other form fields
                $("#jobregistereditId").val(data.tjr_id);
                $("#size-range").val(data.tjr_range);
                $("#lc-resolution").val(data.tjr_resolution);
                $("#serial-no").val(data.tjr_srno);
                $("#customer-id").val(data.tjr_customer_id);
                $("#model-no").val(data.tjr_modelno);
                $("#grade").val(data.tjr_grande);
                $("#customer-ref").val(data.tjr_customer_challan_no);
                $("#lab-ref-no").val(data.tjr_lab_ref_no);
                $("#lab-id").val(data.tjr_labid);
                $("#certificate-no").val(data.tjr_certificate_no);
                $("#ulr-no").val(data.tjr_ulr_no);
                $("#location").val(data.tjr_location);

                setFormattedDate("#date-receipt", data.tjr_reciept_date);
                setFormattedDate("#calibration-date", data.tjr_calibration_date);
                setFormattedDate("#next-calibration-date", data.tjr_next_calibration_date);
                setFormattedDate("#certificate-issue-date", data.tjr_certificate_date);

                $("#remark").val(data.tjr_remark);
                $("#additional-details").val(data.tjr_additional_details);
                $("#status").val(data.tjr_status);

                // For symbol_id, assuming it is a text input (not dropdown)
                $("#symbol_id").val("mm  ,m  ,in  ,mg  ,g  ,kg  ,°C  ,°F  ,min  ,A  ,V  ,Ω  ,µm  ,µ  ,cm² ,psi  , ± ,½");

                // Show modal and reload data
                $("#jobregisterModal").modal('show');
                loadAllJobRegisterData();

            } else {
                console.warn("Unexpected response format:", response);
            }
        },
        error: function (err) {
            console.error("AJAX Error:", err);
        }
    });
}





