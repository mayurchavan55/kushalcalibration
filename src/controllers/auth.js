const jwt = require("jsonwebtoken");
//
const models = require("../models");
const { Model } = require("sequelize");
const { Sequelize } = require("sequelize");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const moment = require("moment");
const cron = require("node-cron");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const ExcelJS = require("exceljs");

// const EMAIL_NAME = process.env.EMAIL_NAME;
// const EMAIL_FROM = process.env.EMAIL_FROM;
const FORGOT_PASS_LINK = process.env.FORGOT_PASS_LINK;
const EMAIL_ID = process.env.EMAIL_ID;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const EMAIL_NAME = process.env.EMAIL_NAME;

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY;
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY;

const signin = async (req, res, next) => {
  try {
    const { tu_email, tu_password } = req.body;

    // Find user by email (case insensitive) and ensure they are enabled
    const user = await models.tbl_users.findOne({
      where: {
        tu_email: models.sequelize.where(
          models.sequelize.fn("LOWER", models.sequelize.col("tu_email")),
          "=",
          models.sequelize.fn("LOWER", tu_email)
        ),
        tu_isenable: true,
      },
      include: [
        {
          model: models.tbl_role_masters,
          attributes: ["trm_id", "trm_name"],
        },
      ],
    });

    if (!user) {
      return res.status(200).json({
        status_code: "404",
        status: false,
        message: "User not exist..!",
      });
    }

    // Verify password using CRYPT
    const validPassword = await models.sequelize.query(
      "SELECT tu_password = CRYPT(:password, tu_password) AS match FROM tbl_users WHERE tu_id = :userId",
      {
        replacements: { password: tu_password, userId: user.tu_id },
        type: models.sequelize.QueryTypes.SELECT,
      }
    );

    if (!validPassword[0]?.match) {
      return res.status(200).json({
        status_code: "400",
        status: false,
        message: "Invalid Credentials..!",
      });
    }

    // Prepare user object for JWT
    const userObj = {
      tu_id: user.tu_id,
      tu_username: user.tu_username,
      tu_firstname: user.tu_firstname,
      tu_lastname: user.tu_lastname,
      tu_email: user.tu_email,
      tu_isenable: user.tu_isenable,
      role_id: user.tbl_role_master.trm_id,
      role_name: user.tbl_role_master.trm_name,
    };

    // Generate tokens
    const accessToken = jwt.sign(userObj, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });
    const refreshToken = jwt.sign(userObj, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    });

    res.cookie("access_token", accessToken, { httpOnly: true, secure: true });
    res.cookie("refresh_token", refreshToken, { httpOnly: true, secure: true });

    // Determine redirection URL based on role
    let url = "/";
    switch (user.tbl_role_master.trm_id) {
      case 1:
        url = "dashboard";
        break;
    }

    res.json({
      status: true,
      message: "Success",
      role_id: user.tbl_role_master.trm_id,
      url: url,
    });
  } catch (error) {
    console.error("Signin Error:", error);
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

const signout = async (req, res) => {
  try {
    res
      .status(200)
      .clearCookie("access_token")
      .clearCookie("refresh_token")
      .render("login", {
        title: "Kushal Enterprises",
      });
  } catch (err) {
    // logger.error("signout -> " + err);
    res.status(500).json({
      status_code: "500",
      status: false,
      message: "Something went wrong.",
    });
    return;
  }
};

const loadAllMAkeData = async (req, res, next) => {
  try {
    const makes = await models.tbl_make_master.findAll({
      where: {
        tm_isenable: true,
      },
      order: [["tm_name", "ASC"]],
    });

    res.json({
      status: true,
      message: "Success",
      data: makes,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

const deleteMake = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if the record exists
    const make = await models.tbl_make_master.findByPk(id);

    if (!make) {
      return res.status(404).json({
        status: false,
        message: "Make not found",
      });
    }

    // Delete the record
    // await make.destroy();
    await make.update({ tm_isenable: false });

    res.json({
      status: true,
      message: "Make deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting make:", error);
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

const updateMake = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { make_name } = req.body;

    if (!make_name) {
      return res
        .status(400)
        .json({ status: false, message: "Make Name is required" });
    }

    const make = await models.tbl_make_master.findByPk(id);

    if (!make) {
      return res.status(404).json({ status: false, message: "Make not found" });
    }

    await make.update({ tm_name: make_name });

    res.json({ status: true, message: "Make updated successfully" });
  } catch (error) {
    console.error("Error updating make:", error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

const addMake = async (req, res, next) => {
  try {
    const { make_name } = req.body;

    if (!make_name) {
      return res
        .status(400)
        .json({ status: false, message: "Make Name is required" });
    }

    const newMake = await models.tbl_make_master.create({
      tm_name: make_name,
      tm_isenable: true,
    });

    res.json({
      status: true,
      message: "Make added successfully",
      data: newMake,
    });
  } catch (error) {
    console.error("Error adding make:", error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

const loadAllMaterialData = async (req, res, next) => {
  try {
    const makes = await models.tbl_material_master.findAll({
      where: {
        tmm_isenable: true,
      },
      order: [["tmm_name", "ASC"]],
    });

    res.json({
      status: true,
      message: "Success",
      data: makes,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

const deleteMaterial = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if the record exists
    const make = await models.tbl_material_master.findByPk(id);

    if (!make) {
      return res.status(404).json({
        status: false,
        message: "Material not found",
      });
    }

    // Delete the record
    // await make.destroy();
    await make.update({ tmm_isenable: false });

    res.json({
      status: true,
      message: "Material deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting Material:", error);
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

const updateMaterial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { Material_name } = req.body;

    if (!Material_name) {
      return res
        .status(400)
        .json({ status: false, message: "Material Name is required" });
    }

    const make = await models.tbl_material_master.findByPk(id);

    if (!make) {
      return res
        .status(404)
        .json({ status: false, message: "Material not found" });
    }

    await make.update({ tmm_name: Material_name });

    res.json({ status: true, message: "Material updated successfully" });
  } catch (error) {
    console.error("Error updating Material:", error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

const addMaterial = async (req, res, next) => {
  try {
    const { Material_name } = req.body;

    if (!Material_name) {
      return res
        .status(400)
        .json({ status: false, message: "Material Name is required" });
    }

    const newMake = await models.tbl_material_master.create({
      tmm_name: Material_name,
      tmm_isenable: true,
    });

    res.json({
      status: true,
      message: "Material added successfully",
      data: newMake,
    });
  } catch (error) {
    console.error("Error adding Material:", error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

const loadAllInstrumentsData = async (req, res, next) => {
  try {
    const makes = await models.tbl_instruments_master.findAll({
      where: {
        tim_isenable: true,
      },
      order: [["tim_name", "ASC"]],
    });

    res.json({
      status: true,
      message: "Success",
      data: makes,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

const deleteInstruments = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if the record exists
    const make = await models.tbl_instruments_master.findByPk(id);

    if (!make) {
      return res.status(404).json({
        status: false,
        message: "Instruments not found",
      });
    }

    // Delete the record
    // await make.destroy();
    await make.update({ tim_isenable: false });

    res.json({
      status: true,
      message: "Instruments deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting Instruments:", error);
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

const updateInstruments = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { Instruments_name } = req.body;

    if (!Instruments_name) {
      return res
        .status(400)
        .json({ status: false, message: "Instruments Name is required" });
    }

    const make = await models.tbl_instruments_master.findByPk(id);

    if (!make) {
      return res
        .status(404)
        .json({ status: false, message: "Instruments not found" });
    }

    await make.update({ tim_name: Instruments_name });

    res.json({ status: true, message: "Instruments updated successfully" });
  } catch (error) {
    console.error("Error updating Instruments:", error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

const addInstruments = async (req, res, next) => {
  try {
    const { Instruments_name } = req.body;

    if (!Instruments_name) {
      return res
        .status(400)
        .json({ status: false, message: "Instruments Name is required" });
    }

    const newMake = await models.tbl_instruments_master.create({
      tim_name: Instruments_name,
      tim_isenable: true,
    });

    res.json({
      status: true,
      message: "Instruments added successfully",
      data: newMake,
    });
  } catch (error) {
    console.error("Error adding Instruments:", error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

const resetPassWord = async (req, res, next) => {
  try {
    const { tu_email } = req.body;

    // Find user by email (case insensitive) and ensure they are enabled
    const user = await models.tbl_users.findOne({
      where: {
        tu_email: models.sequelize.where(
          models.sequelize.fn("LOWER", models.sequelize.col("tu_email")),
          "=",
          models.sequelize.fn("LOWER", tu_email)
        ),
        tu_isenable: true,
      },
    });

    if (!user) {
      return res.status(200).json({
        status_code: "404",
        status: false,
        message: "Email Id not exist..!",
      });
    }

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_ID,
        pass: EMAIL_PASSWORD,
      },
    });

    let firstname = user.tu_firstname;
    let lastname = user.tu_lastname;
    let resetEmail = user.tu_email;
    let resetLink = FORGOT_PASS_LINK + resetEmail;
    let emailcontent =
      `<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; margin: 0;">
    <div style="max-width: 600px; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px #ddd; margin: 0 auto;">
        <h2 style="color: #333; text-align: center;">Reset Your Password</h2>
        <p style="color: #555; font-size: 16px; line-height: 1.6;">Dear ` +
      firstname +
      ` ` +
      lastname +
      `,</p>
        <p style="color: #555; font-size: 16px; line-height: 1.6;">We received a request to reset your password. Click the button below to set a new password:</p>
        <p style="text-align: center;">
            <a href="` +
      resetLink +
      `" style="display: inline-block; background: #007bff; color: white; text-decoration: none; padding: 12px 20px; border-radius: 5px; font-size: 16px; font-weight: bold;">Reset Password</a>
        </p>
        <p style="color: #555; font-size: 16px; line-height: 1.6;">If the button doesn’t work, copy and paste the following link into your browser:</p>
        <a href="` +
      resetLink +
      `" style="word-wrap: break-word; background: #f8f8f8; padding: 10px; border-radius: 5px; font-size: 14px; color: #333;">` +
      resetLink +
      `</a>
        
        <p style="color: #555; font-size: 16px; line-height: 1.6;">If you did not request a password reset, please ignore this email or contact support.</p>
        <p style="text-align: center; margin-top: 20px; color: #888; font-size: 14px;">Best regards,<br><b>Kushal Enterprises</b><br></p>
    </div>
</body>`;

    let mailOptions = {
      from: "" + EMAIL_NAME + " " + EMAIL_ID + "",
      to: resetEmail,
      subject: "Forgot Password",
      text: firstname + " " + lastname + " " + resetEmail,
      html: emailcontent,
    };

    // Send email
    try {
      let info = await transporter.sendMail(mailOptions);
      console.log("Email sent: " + info.response);
    } catch (error) {
      console.error("Error sending email: ", error);
    }

    res.json({
      status: true,
      message:
        "Password reset instructions have been sent to your email. Please check your inbox and follow the instructions to reset your password.",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

const updatepassword = (req, res) => {
  let tu_email = req.body.tu_email;
  let password = req.body.password;

  if (tu_email == "" || tu_email == null || tu_email == undefined) {
    res.status(404).json({ status: false, message: "Email is not passed" });
    return false;
  }
  if (password == "" || password == null || password == undefined) {
    res.status(404).json({ status: false, message: "Password is not pass" });
    return false;
  }
  models.tbl_users
    .findOne({ where: { tu_email: tu_email } })
    .then((result) => {
      if (result) {
        models.tbl_users
          .update(
            {
              tu_password: models.sequelize.literal(
                `crypt('${password}', gen_salt('bf', 10))`
              ),
            },
            {
              where: {
                tu_email: tu_email,
              },
            }
          )
          .then((resultu) => {
            res.status(200).json({
              status: true,
              message: "Password Update successfully",
            });
          })
          .catch((err) => {
            console.log(err);
            res.json({
              status_code: "500",
              status: false,
              message: "Failed",
              data: err,
            });
          });
      } else {
        res.json({ status: false, message: "user is not registered" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.json({
        status_code: "500",
        status: false,
        message: "Failed",
        data: err,
      });
    });
};

const customers = async (req, res) => {
  try {
    const { contact_name, company_name, email, mobile, address } = req.body;

    const newCustomer = await models.tbl_customer_master.create({
      tcm_contact_person: contact_name,
      tcm_company_name: company_name,
      tcm_mobile: mobile,
      tcm_email: email,
      tcm_address: address,
      tcm_createdby: 1,
      tcm_updatedby: 1,
      tcm_updatedat: moment().utc().format(),
    });

    // Send success response
    res.status(201).json({
      status: "success",
      message: "Vendor created successfully",
      data: newCustomer,
    });
  } catch (err) {
    console.error("Error creating customer:", err);
    // Send error response
    res.status(500).json({
      status: "error",
      message: "Failed to create customer",
      error: err.message,
    });
  }
};

const getAllinstrument_make_material = async function (req, res) {
  try {
    const queries = [
      `SELECT tm_id,tm_name FROM tbl_make_master WHERE tm_isenable = true;`,
      `SELECT tmm_id,tmm_name FROM tbl_material_master WHERE tmm_isenable = true;`,
      `SELECT tim_id,tim_name FROM tbl_instruments_master WHERE tim_isenable = true;`,
      `select tcm_id,tcm_contact_person,tcm_company_name from tbl_customer_master where tcm_isenable = true `,
      `SELECT tcl_id,tcl_name FROM public.tbl_calibration_lab where tcl_isenable = true `,
    ];

    const results = await Promise.all(
      queries.map((query) =>
        models.sequelize.query(query, { type: Sequelize.QueryTypes.SELECT })
      )
    );
    res.status(200).json({
      status_code: "200",
      status: true,
      data: {
        make_master: results[0],
        material_master: results[1],
        instruments_master: results[2],
        customer_master: results[3],
        calibrationlab_master: results[4],
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status_code: "500",
      status: false,
      message: "Failed",
      data: error,
    });
  }
};

const jobregister = async (req, res) => {
  try {
    let {
      customer_name,
      instrument_master,
      make_manufacturer,
      material,
      size_range,
      lc_resolution,
      serial_no,
      customer_id,
      model_no,
      grade,
      customer_ref,
      lab_ref_no,
      lab_id,
      certificate_no,
      ulr_no,
      date_receipt,
      calibration_date,
      next_calibration_date,
      certificate_issue_date,
      remark,
      additional_details,
      cal_lab,
      status,
      frequency_month,
      location,
    } = req.body;

    if (
      !customer_name ||
      !instrument_master ||
      !make_manufacturer ||
      !material ||
      !size_range
    ) {
      return res
        .status(400)
        .json({ status: "error", message: "Missing required fields" });
    }
    if (date_receipt == "") date_receipt = null;
    if (calibration_date == "") calibration_date = null;
    if (next_calibration_date == "") next_calibration_date = null;
    if (certificate_issue_date == "") certificate_issue_date = null;

    const newCustomer = await models.tbl_job_register.create({
      tjr_fk_tcm_id: customer_name,
      tjr_fk_tim_id: instrument_master,
      tjr_fk_tm_id: make_manufacturer,
      tjr_fk_tmm_id: material,
      tjr_range: size_range,
      tjr_resolution: lc_resolution,
      tjr_srno: serial_no,
      tjr_customer_id: customer_id,
      tjr_modelno: model_no,
      tjr_grande: grade,
      tjr_customer_challan_no: customer_ref,
      tjr_lab_ref_no: lab_ref_no,
      tjr_labid: lab_id,
      tjr_certificate_no: certificate_no,
      tjr_ulr_no: ulr_no,
      tjr_reciept_date: date_receipt,
      tjr_calibration_date: calibration_date,
      tjr_next_calibration_date: next_calibration_date,
      tjr_certificate_date: certificate_issue_date,
      tjr_remark: remark,
      tjr_additional_details: additional_details,
      tjr_fk_tcl_id: cal_lab,
      tjr_location: location,
      tjr_isenable: true,
      tjr_status: status,
      tjr_frequency_month: frequency_month,
      tjr_createdby: 1, // Change to actual user if needed
      tjr_createdat: moment().utc().format(),
      tjr_updatedby: 1, // Change to actual user if needed
      tjr_updatedat: moment().utc().format(),
    });

    return res
      .status(201)
      .json({
        status: true,
        message: "Job registered successfully",
        data: newCustomer,
      });
  } catch (error) {
    console.error("Error in jobregister API:", error);
    return res
      .status(500)
      .json({
        status: false,
        message: "Internal server error",
        error: error.message,
      });
  }
};

// Function to fetch data using raw SQL query
const fetchData = async (customer_id) => {
  try {
    var st_name = ` SELECT 
                tcm.tcm_id as tcm_id,
                tcm.tcm_contact_person AS contact_name,
                tcm.tcm_email AS company_email,
                tcm.tcm_mobile AS contact_mobile,
                tjr.tjr_srno AS serial_no,
                tim.tim_name AS instrument_name,
                tjr.tjr_customer_id as customer_id,
                tjr.tjr_range AS range_size,
                tjr.tjr_resolution AS resolution_lc,
                tm.tm_name AS make,
                TO_CHAR(tjr.tjr_calibration_date, 'DD-MM-YYYY') AS tjr_calibration_date,
                TO_CHAR(tjr.tjr_next_calibration_date, 'DD-MM-YYYY') AS tjr_next_calibration_date,
                tjr.tjr_next_calibration_date as tjr_next_calibration
            FROM tbl_job_register tjr
            INNER JOIN tbl_customer_master tcm ON tcm.tcm_id = tjr.tjr_fk_tcm_id
            INNER JOIN tbl_make_master tm ON tm.tm_id = tjr.tjr_fk_tm_id
            INNER JOIN tbl_instruments_master tim ON tim.tim_id = tjr.tjr_fk_tim_id
            INNER JOIN tbl_material_master tmm ON tmm.tmm_id = tjr.tjr_fk_tmm_id
            WHERE tjr.tjr_isenable = true 
            AND tcm.tcm_isenable = true
            AND tm.tm_isenable = true 
            AND tim.tim_isenable = true
            AND tmm.tmm_isenable = true 
            AND DATE(tjr.tjr_next_calibration_date) BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'`;
    if (customer_id) {
      st_name += ` AND tcm.tcm_id = ` + customer_id + ``;
    }
    let results = await models.sequelize.query(st_name, {
      type: Sequelize.QueryTypes.SELECT,
    });
    return results;
  } catch (error) {
    console.error("Database error:", error);
    return [];
  }
};

const generatePDF = (data, filePath) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A2", margin: 50 });
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Title
      doc.fontSize(16).text("Calibration Due Instruments", { align: "center" });
      doc.moveDown();

      // Table Structure
      const startX = 50;
      let startY = doc.y + 10;
      const rowHeight = 30;
      const colWidths = [150, 140, 200, 120, 120, 100, 130, 130];

      // Headers
      const headers = [
        "Customer Id",
        "Serial No",
        "Instrument Name",
        "Range",
        "Resolution",
        "Make",
        "Cal Date",
        "Due Date",
      ];

      // Draw Header Background
      doc
        .fillColor("#90acd1")
        .rect(
          startX,
          startY,
          colWidths.reduce((a, b) => a + b, 0),
          rowHeight
        )
        .fill();

      doc.fillColor("white"); // White text for headers
      doc.font("Times-Bold").fontSize(10);

      let x = startX;
      headers.forEach((header, index) => {
        doc.text(header, x + 5, startY + 10);
        x += colWidths[index];
      });

      // Draw Header Borders
      doc
        .moveTo(startX, startY)
        .lineTo(startX + colWidths.reduce((a, b) => a + b, 0), startY)
        .stroke(); // Top
      doc
        .moveTo(startX, startY + rowHeight)
        .lineTo(
          startX + colWidths.reduce((a, b) => a + b, 0),
          startY + rowHeight
        )
        .stroke(); // Bottom

      // Draw Column Lines for Header
      x = startX;
      colWidths.forEach((width) => {
        doc
          .moveTo(x, startY)
          .lineTo(x, startY + rowHeight)
          .stroke();
        x += width;
      });
      doc
        .moveTo(x, startY)
        .lineTo(x, startY + rowHeight)
        .stroke(); // Last column border

      startY += rowHeight; // Move to next row

      // Data Rows
      doc.fillColor("black").font("Times-Roman").fontSize(10);
      data.forEach((row) => {
        let x = startX;
        const values = [
          row.customer_id || "N/A",
          row.serial_no || "N/A",
          row.instrument_name || "N/A",
          row.range_size || "N/A",
          row.resolution_lc || "N/A",
          row.make || "N/A",
          row.tjr_calibration_date || "N/A",
          row.tjr_next_calibration_date || "N/A",
        ];

        values.forEach((text, index) => {
          doc.text(text, x + 5, startY + 10);
          x += colWidths[index];
        });

        // Draw row borders
        doc
          .moveTo(startX, startY)
          .lineTo(startX + colWidths.reduce((a, b) => a + b, 0), startY)
          .stroke();
        doc
          .moveTo(startX, startY + rowHeight)
          .lineTo(
            startX + colWidths.reduce((a, b) => a + b, 0),
            startY + rowHeight
          )
          .stroke();

        // Draw column lines
        x = startX;
        colWidths.forEach((width) => {
          doc
            .moveTo(x, startY)
            .lineTo(x, startY + rowHeight)
            .stroke();
          x += width;
        });
        doc
          .moveTo(x, startY)
          .lineTo(x, startY + rowHeight)
          .stroke();

        startY += rowHeight; // Move to next row
      });

      doc.end();
      stream.on("finish", () => resolve(filePath));
    } catch (error) {
      reject(error);
    }
  });
};

// Function to send email
const sendEmail = async (email, name, pdfFilePath) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_ID,
        pass: EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `${EMAIL_NAME} <${EMAIL_ID}>`,
      to: email,
      subject: "Calibration Due Notification",
      text: `Dear ${name} Sir,\n\nAs per our records, the instruments listed in the attached document are due.\nKindly review the details and take the necessary action.\n\nBest Regards,\n\nSandeep Jadhav (+91-9850535303) \nKushal Enterprises.\n453, Jyotiba Nagar, Behind Vishnuraj Mangal Karyalay,\nNear Ashwini Colony, Kalewadi, Pimpri, Pune - 411 017.`,
      attachments: [
        {
          filename: "Calibration_Due.pdf",
          path: pdfFilePath,
          contentType: "application/pdf",
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${email}`);
  } catch (error) {
    console.error(`❌ Error sending email to ${email}:`, error);
  }
};

// Main function to process data and send emails
const processAndSendEmails = async (customer_id) => {
  const data = await fetchData(customer_id);

  if (data.length === 0) {
    console.log("⚠ No calibration due instruments found. No email sent.");
    return;
  }

  // Group data by customer email
  const customerDataMap = {};
  data.forEach((row) => {
    const email = row.company_email;
    if (!customerDataMap[email]) {
      customerDataMap[email] = {
        name: row.contact_name,
        data: [],
      };
    }
    customerDataMap[email].data.push(row);
  });

  // Send separate email to each customer
  for (const email in customerDataMap) {
    const { name, data } = customerDataMap[email];
    const pdfFilePath = `./Calibration_Due_${email.replace(/[@.]/g, "_")}.pdf`;

    try {
      await generatePDF(data, pdfFilePath);
      await sendEmail(email, name, pdfFilePath);
      await addDataInReminderTable(data);

      // Remove the PDF file after sending
      fs.unlinkSync(pdfFilePath);
    } catch (error) {
      console.error(`❌ Error processing email for ${email}:`, error);
    }
  }
};

const addDataInReminderTable = async (data) => {
  try {
    var data_ = data[0];
    var dt = data[0].tjr_next_calibration;
    await models.tbl_email_reminder.create({
      ter_fk_tcm_id: data_.tcm_id,
      ter_for_month: dt,
      ter_isenable: true,
      ter_createdby: 1,
      ter_createdat: moment().utc().format(),
      ter_updatedby: 1,
      ter_updatedat: moment().utc().format(),
    });
  } catch (error) {
    console.error(`❌ Error sending email to ${email}:`, error);
  }
};

// Schedule job to run every day at 8 AM
cron.schedule(
  "0 10 * * *",
  () => {
    // cron.schedule('*/1 * * * *', () => {
    console.log("Running cron job at 8 AM");
    processAndSendEmails();
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata", // Change this to your timezone
  }
);

const getDashboardData = async (req, res, next) => {
  try {
    var st_name = ` SELECT 
                tcm.tcm_id as customer_id,
                tcm.tcm_contact_person AS contact_name,
                tcm.tcm_email AS company_email,
                tcm.tcm_mobile AS contact_mobile,
                tcm.tcm_company_name as company_name,
                TO_CHAR(tjr.tjr_calibration_date, 'DD-MM-YYYY') AS tjr_calibration_date,
                TO_CHAR(tjr.tjr_next_calibration_date, 'DD-MM-YYYY') AS tjr_next_calibration_date,
                (
                    SELECT COUNT(*)
                    FROM tbl_email_reminder ter
                    WHERE 
                        ter.ter_fk_tcm_id = tcm.tcm_id
                        AND TO_CHAR(ter.ter_for_month, 'DD-MM-YYYY') = TO_CHAR(tjr.tjr_next_calibration_date, 'DD-MM-YYYY')
                ) AS isreminder_sent
            FROM tbl_job_register tjr
            INNER JOIN tbl_customer_master tcm ON tcm.tcm_id = tjr.tjr_fk_tcm_id
            WHERE tjr.tjr_isenable = true 
            AND tcm.tcm_isenable = true
            AND DATE(tjr.tjr_next_calibration_date) BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
			      GROUP BY tcm.tcm_id,
                tcm.tcm_contact_person,
                tcm.tcm_email,
                tcm.tcm_mobile,
                tcm.tcm_company_name,
                tjr.tjr_calibration_date,
                tjr.tjr_next_calibration_date;`;
    let due_customer = await models.sequelize.query(st_name, {
      type: Sequelize.QueryTypes.SELECT,
    });

    var st_name1 = ` SELECT count(*) as toatl_customer
            FROM tbl_customer_master;`;
    let total_customer = await models.sequelize.query(st_name1, {
      type: Sequelize.QueryTypes.SELECT,
    });

    var st_name2 = ` SELECT count(*) as active_customer
            FROM tbl_customer_master WHERE tcm_isenable = true;`;
    let active_customer = await models.sequelize.query(st_name2, {
      type: Sequelize.QueryTypes.SELECT,
    });

    var st_name3 = `SELECT count(*) as total_due
            FROM tbl_job_register tjr
            INNER JOIN tbl_customer_master tcm ON tcm.tcm_id = tjr.tjr_fk_tcm_id
            WHERE tjr.tjr_isenable = true 
            AND tcm.tcm_isenable = true
            AND DATE(tjr.tjr_next_calibration_date) BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
            GROUP BY tcm.tcm_id,
                tcm.tcm_contact_person,
                tcm.tcm_email,
                tcm.tcm_mobile,
                TO_CHAR(tjr.tjr_calibration_date, 'DD-MM-YYYY'),
                TO_CHAR(tjr.tjr_next_calibration_date, 'DD-MM-YYYY');`;
    let total_due_customer = await models.sequelize.query(st_name3, {
      type: Sequelize.QueryTypes.SELECT,
    });
    res.json({
      status: true,
      message: "Success",
      data: {
        due_customer: due_customer,
        total_customer: total_customer,
        active_customer: active_customer,
        total_due_customer: total_due_customer,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

const getCustomerDueData = async (req, res, next) => {
  try {
    const { customer_id } = req.body;

    var st_name = `SELECT 
                tcm.tcm_contact_person AS contact_name,
                tcm.tcm_email AS company_email,
                tcm.tcm_mobile AS contact_mobile,
                tjr.tjr_srno AS serial_no,
                tim.tim_name AS instrument_name,
                tjr.tjr_range AS range_size,
                tjr.tjr_resolution AS resolution_lc,
                tm.tm_name AS make,
                TO_CHAR(tjr.tjr_calibration_date, 'DD-MM-YYYY') AS tjr_calibration_date,
                TO_CHAR(tjr.tjr_next_calibration_date, 'DD-MM-YYYY') AS tjr_next_calibration_date
            FROM tbl_job_register tjr
            INNER JOIN tbl_customer_master tcm ON tcm.tcm_id = tjr.tjr_fk_tcm_id
            INNER JOIN tbl_make_master tm ON tm.tm_id = tjr.tjr_fk_tm_id
            INNER JOIN tbl_instruments_master tim ON tim.tim_id = tjr.tjr_fk_tim_id
            INNER JOIN tbl_material_master tmm ON tmm.tmm_id = tjr.tjr_fk_tmm_id
            WHERE tjr.tjr_isenable = true 
            AND tcm.tcm_isenable = true
            AND tm.tm_isenable = true 
            AND tim.tim_isenable = true
            AND tmm.tmm_isenable = true 
            AND DATE(tjr.tjr_next_calibration_date) BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
            AND tcm.tcm_id = ${customer_id}`;

    let due_customer = await models.sequelize.query(st_name, {
      type: Sequelize.QueryTypes.SELECT,
    });

    res.json({
      status: true,
      message: "Success",
      data: due_customer,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

const sendReminder = async (req, res, next) => {
  try {
    const { customer_id } = req.body;
    await processAndSendEmails(customer_id);
    res.json({
      status: true,
      message: "Success",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

const getcustomerdata = async (req, res, next) => {
  try {
    const customer = await models.tbl_customer_master.findAll({
      where: {
        tcm_isenable: true,
      },
    });

    res.json({
      status: true,
      message: "Success",
      data: customer,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

const updatecustomers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { contact_name, company_name, email, mobile, address } = req.body;

    if (!contact_name || !company_name || !email || !mobile || !address) {
      return res
        .status(400)
        .json({ status: false, message: "All fields are required." });
    }

    const customer = await models.tbl_customer_master.findByPk(id);

    if (!customer) {
      return res
        .status(404)
        .json({ status: false, message: "Customer not found." });
    }

    await customer.update({
      tcm_contact_person: contact_name,
      tcm_company_name: company_name,
      tcm_mobile: mobile,
      tcm_email: email,
      tcm_address: address,
    });

    res.json({
      status: true,
      message: "Customer Mangement updated successfully.",
    });
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ status: false, message: "Internal server error." });
  }
};

const deleteCustomerManagement = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if the record exists
    const customer = await models.tbl_customer_master.findByPk(id);

    if (!customer) {
      return res
        .status(404)
        .json({ status: false, message: "Customer not found." });
    }

    // Soft delete the record by updating the isEnabled field
    await customer.update({ tcm_isenable: false });

    res.json({
      status: true,
      message: "Customer management deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting customer management:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error.",
    });
  }
};

const getjobregister = async (req, res, next) => {
  try {
    var st_name = `SELECT
  tcm.tcm_company_name,
  tcm.tcm_id AS customer_id,
  tmm.tmm_name,
  tmm.tmm_id AS material_id,
  tm.tm_name,
  tm.tm_id AS make_id,
  tim.tim_name,
  tim.tim_id AS instrument_id,
  tjr.tjr_id,
  tjr.tjr_range,
  tjr.tjr_resolution,
  tjr.tjr_srno,
  tjr.tjr_customer_id,
  tjr.tjr_modelno,
  tjr.tjr_grande,
  tjr.tjr_customer_challan_no,
  tjr.tjr_lab_ref_no,
  tjr.tjr_labid,
  tjr.tjr_certificate_no,
  tjr.tjr_ulr_no,
  tjr.tjr_reciept_date,
  tjr.tjr_calibration_date,
  tjr.tjr_next_calibration_date,
  tjr.tjr_certificate_date,
  tjr.tjr_remark,
  tjr.tjr_additional_details,
  tcl.tcl_id,
  tcl.tcl_name,
  tjr.tjr_location,
  tjr.tjr_status,
  tjr.tjr_frequency_month
FROM
  tbl_job_register tjr
  LEFT JOIN tbl_customer_master tcm ON tcm.tcm_id = tjr.tjr_fk_tcm_id
  LEFT JOIN tbl_instruments_master tim ON tim.tim_id = tjr.tjr_fk_tim_id
  LEFT JOIN tbl_material_master tmm ON tmm.tmm_id = tjr.tjr_fk_tmm_id
  LEFT JOIN tbl_calibration_lab tcl ON tcl.tcl_id = tjr.tjr_fk_tcl_id
  LEFT JOIN tbl_make_master tm ON tm.tm_id = tjr.tjr_fk_tm_id where tjr.tjr_isenable = true order by tjr.tjr_id desc`;
    let job_register = await models.sequelize.query(st_name, {
      type: Sequelize.QueryTypes.SELECT,
    });

    res.json({
      status: true,
      message: "Success",
      data: job_register,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

const updateJobRegistrationData = async (req, res, next) => {
  try {
    const { id } = req.params;

    var st_name = `SELECT
  tcm.tcm_company_name,
  tcm.tcm_id AS customer_id,
  tmm.tmm_name,
  tmm.tmm_id AS material_id,
  tm.tm_name,
  tm.tm_id AS make_id,
  tim.tim_name,
  tim.tim_id AS instrument_id,
  tjr.tjr_id,
  tjr.tjr_range,
  tjr.tjr_resolution,
  tjr.tjr_srno,
  tjr.tjr_customer_id,
  tjr.tjr_modelno,
  tjr.tjr_grande,
  tjr.tjr_customer_challan_no,
  tjr.tjr_lab_ref_no,
  tjr.tjr_labid,
  tjr.tjr_certificate_no,
  tjr.tjr_ulr_no,
  tjr.tjr_reciept_date,
  tjr.tjr_calibration_date,
  tjr.tjr_next_calibration_date,
  tjr.tjr_certificate_date,
  tjr.tjr_remark,
  tjr.tjr_additional_details,
  tcl.tcl_id,
  tcl.tcl_name,
  tjr.tjr_location,
  tjr.tjr_status,
  tjr.tjr_frequency_month
FROM
  tbl_job_register tjr
  LEFT JOIN tbl_customer_master tcm ON tcm.tcm_id = tjr.tjr_fk_tcm_id
  LEFT JOIN tbl_instruments_master tim ON tim.tim_id = tjr.tjr_fk_tim_id
  LEFT JOIN tbl_material_master tmm ON tmm.tmm_id = tjr.tjr_fk_tmm_id
  LEFT JOIN tbl_calibration_lab tcl ON tcl.tcl_id = tjr.tjr_fk_tcl_id
  LEFT JOIN tbl_make_master tm ON tm.tm_id = tjr.tjr_fk_tm_id where tjr.tjr_isenable = true and tjr.tjr_id = ${id}`;
    let job_register = await models.sequelize.query(st_name, {
      type: Sequelize.QueryTypes.SELECT,
    });

    res.json({
      status: true,
      message: "Success",
      data: job_register,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};
const updatejobregister = async (req, res, next) => {
  try {
    const { id } = req.params;
    let {
      customer_name,
      instrument_master,
      make_manufacturer,
      material,
      size_range,
      lc_resolution,
      serial_no,
      customer_id,
      model_no,
      grade,
      customer_ref,
      lab_ref_no,
      lab_id,
      certificate_no,
      ulr_no,
      date_receipt,
      calibration_date,
      next_calibration_date,
      certificate_issue_date,
      remark,
      additional_details,
      cal_lab,
      status,
      frequency_month,
      location,
    } = req.body;

    if (
      !id ||
      !customer_name ||
      !instrument_master ||
      !make_manufacturer ||
      !material ||
      !size_range
    ) {
      return res
        .status(400)
        .json({ status: "error", message: "Missing required fields" });
    }
    if (date_receipt == "") date_receipt = null;
    if (calibration_date == "") calibration_date = null;
    if (next_calibration_date == "") next_calibration_date = null;
    if (certificate_issue_date == "") certificate_issue_date = null;

    const jobRegister = await models.tbl_job_register.findByPk(id);

    if (!jobRegister) {
      return res
        .status(404)
        .json({ status: "error", message: "Job Register not found." });
    }

    await jobRegister.update({
      tjr_fk_tcm_id: customer_name,
      tjr_fk_tim_id: instrument_master,
      tjr_fk_tm_id: make_manufacturer,
      tjr_fk_tmm_id: material,
      tjr_range: size_range,
      tjr_resolution: lc_resolution,
      tjr_srno: serial_no,
      tjr_customer_id: customer_id,
      tjr_modelno: model_no,
      tjr_grande: grade,
      tjr_customer_challan_no: customer_ref,
      tjr_lab_ref_no: lab_ref_no,
      tjr_labid: lab_id,
      tjr_certificate_no: certificate_no,
      tjr_ulr_no: ulr_no,
      tjr_reciept_date: date_receipt,
      tjr_calibration_date: calibration_date,
      tjr_next_calibration_date: next_calibration_date,
      tjr_certificate_date: certificate_issue_date,
      tjr_remark: remark,
      tjr_additional_details: additional_details,
      tjr_fk_tcl_id: cal_lab,
      tjr_location: location,
      tjr_status: status,
      tjr_frequency_month: frequency_month,
    });

    res.json({ status: true, message: "Job Register updated successfully." });
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ status: false, message: "Internal server error." });
  }
};

const getcompanymaster = async (req, res, next) => {
  var comapny_id = req.body.comapny_id;
  try {
    var st_name = `select
  tcm.tcm_company_name,
  tcm.tcm_id AS company_id,
  tcm.tcm_address,
  tmm.tmm_name,
  tm.tm_name,
  tim.tim_name,
  tjr_range,
  tjr_resolution,
  tjr_srno,
  tjr_customer_id,
  tjr_calibration_date,
  tjr_next_calibration_date,
  tjr_remark,
  tjr_location
from
  tbl_job_register tjr
  left join tbl_customer_master tcm on tcm.tcm_id = tjr.tjr_fk_tcm_id
  left join tbl_instruments_master tim on tim.tim_id = tjr.tjr_fk_tim_id
  left join tbl_material_master tmm on tmm.tmm_id = tjr.tjr_fk_tmm_id
  left join tbl_make_master tm on tm.tm_id = tjr.tjr_fk_tm_id  Where tjr.tjr_isenable = true And tcm.tcm_id = ${comapny_id}`;
    let company_master = await models.sequelize.query(st_name, {
      type: Sequelize.QueryTypes.SELECT,
    });

    res.json({
      status: true,
      message: "Success",
      data: company_master,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

const deletejobregister = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if the record exists
    const jobregister = await models.tbl_job_register.findByPk(id);

    if (!jobregister) {
      return res
        .status(404)
        .json({ status: false, message: "jobregister not found." });
    }

    // Soft delete the record by updating the isEnabled field
    await jobregister.update({ tjr_isenable: false });

    res.json({
      status: true,
      message: "Job register deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting jobregister :", error);
    res.status(500).json({
      status: false,
      message: "Internal server error.",
    });
  }
};

const deleteCalibrationlab = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if the record exists
    const calibrationLab = await models.tbl_calibration_lab.findByPk(id);

    if (!calibrationLab) {
      return res.status(404).json({
        status: false,
        message: "Calibrationlab not found",
      });
    }

    // Soft delete by updating the isenable flag
    await calibrationLab.update({ tcl_isenable: false });

    res.json({
      status: true,
      message: "Calibrationlab deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting Calibrationlab:", error);
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

const updateCalibrationlab = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { Calibrationlab_name } = req.body;

    if (!Calibrationlab_name || !Calibrationlab_name.trim()) {
      return res
        .status(400)
        .json({ status: false, message: "Calibrationlab Name is required" });
    }

    const calibrationLab = await models.tbl_calibration_lab.findByPk(id);

    if (!calibrationLab) {
      return res
        .status(404)
        .json({ status: false, message: "Calibrationlab not found" });
    }

    await calibrationLab.update({ tcl_name: Calibrationlab_name.trim() });

    return res.json({
      status: true,
      message: "Calibrationlab updated successfully",
    });
  } catch (error) {
    console.error("Error updating Calibrationlab:", error);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
};

const addCalibrationlab = async (req, res, next) => {
  try {
    const { Calibrationlab_name } = req.body;

    if (!Calibrationlab_name) {
      return res
        .status(400)
        .json({ status: false, message: "Calibrationlab Name is required" });
    }

    const newCalibrationlab = await models.tbl_calibration_lab.create({
      tcl_name: Calibrationlab_name.trim(),
      tcl_isenable: true,
    });

    return res.status(201).json({
      status: true,
      message: "Calibrationlab added successfully",
      data: newCalibrationlab,
    });
  } catch (error) {
    console.error("Error adding Calibrationlab:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

const loadAllcalbrationlabData = async (req, res, next) => {
  try {
    const makes = await models.tbl_calibration_lab.findAll({
      where: {
        tcl_isenable: true,
      },
      order: [["tcl_name", "ASC"]],
    });

    res.json({
      status: true,
      message: "Success",
      data: makes,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

const getjobregisterExcelfileDownloadPage = async (req, res, next) => {
  try {
    const { company_id } = req.params; 

    let whereCondition = "tjr.tjr_isenable = TRUE";
    if (company_id) {
      whereCondition += ` AND tcm.tcm_id = ${company_id}`;
    }

    const st_name = `
      SELECT
        tcm.tcm_company_name      AS company_name,
        tmm.tmm_name              AS material_name,
        tm.tm_name                AS make_name,
        tjr.tjr_customer_id       AS customer_id,
        tim.tim_name              AS instrument_name,
        tjr.tjr_range             AS measuring_range,
        tjr.tjr_resolution        AS resolution,
        tjr.tjr_srno              AS serial_no,
        tjr.tjr_modelno           AS model_no,
        tjr.tjr_grande            AS grade,
        tjr.tjr_customer_challan_no AS customer_challan_no,
        tjr.tjr_lab_ref_no        AS lab_ref_no,
        tjr.tjr_certificate_no    AS certificate_no,
        tjr.tjr_ulr_no            AS ulr_no,
        tjr.tjr_reciept_date      AS receipt_date,
        tjr.tjr_calibration_date  AS calibration_date,
        tjr.tjr_next_calibration_date AS next_calibration_date,
        tjr.tjr_certificate_date  AS certificate_date,
        tjr.tjr_remark            AS remarks,
        tjr.tjr_additional_details AS additional_details,
        tcl.tcl_name              AS lab_name,
        tjr.tjr_location          AS location,
        tjr.tjr_status            AS status,
        tjr.tjr_frequency_month   AS frequency_month
      FROM
        tbl_job_register tjr
        LEFT JOIN tbl_customer_master tcm ON tcm.tcm_id = tjr.tjr_fk_tcm_id
        LEFT JOIN tbl_instruments_master tim ON tim.tim_id = tjr.tjr_fk_tim_id
        LEFT JOIN tbl_material_master tmm ON tmm.tmm_id = tjr.tjr_fk_tmm_id
        LEFT JOIN tbl_calibration_lab tcl ON tcl.tcl_id = tjr.tjr_fk_tcl_id
        LEFT JOIN tbl_make_master tm ON tm.tm_id = tjr.tjr_fk_tm_id
      WHERE
        ${whereCondition}
      ORDER BY
        tjr.tjr_id DESC`;

    let job_register = await models.sequelize.query(st_name, {
      type: Sequelize.QueryTypes.SELECT,
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Job Register");

    if (job_register.length > 0) {
      worksheet.columns = Object.keys(job_register[0]).map((key) => ({
        header: key,
        key: key,
        width: 25,
      }));

      job_register.forEach((row) => {
        const formattedRow = {};
        for (const key in row) {
          if (row[key] instanceof Date) {
            formattedRow[key] = row[key].toISOString().split("T")[0];
          } else if (row[key] === null) {
            formattedRow[key] = "";
          } else {
            formattedRow[key] = row[key];
          }
        }
        worksheet.addRow(formattedRow);
      });
    }

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=job_register.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};



const generatecompanymasterPDF = async (req, res, next) => {
   const { company_id } = req.params; 
  try {
    var st_name = `select
  tcm.tcm_company_name,
  tcm.tcm_id AS company_id,
  tcm.tcm_address,
  tmm.tmm_name,
  tm.tm_name,
  tim.tim_name,
  tjr_range,
  tjr_resolution,
  tjr_srno,
  tjr_customer_id,
  tjr_calibration_date,
  tjr_next_calibration_date,
  tjr_remark,
  tjr_location
from
  tbl_job_register tjr
  left join tbl_customer_master tcm on tcm.tcm_id = tjr.tjr_fk_tcm_id
  left join tbl_instruments_master tim on tim.tim_id = tjr.tjr_fk_tim_id
  left join tbl_material_master tmm on tmm.tmm_id = tjr.tjr_fk_tmm_id
  left join tbl_make_master tm on tm.tm_id = tjr.tjr_fk_tm_id  Where tjr.tjr_isenable = true And tcm.tcm_id = ${company_id}`;
    let company_master = await models.sequelize.query(st_name, {
      type: Sequelize.QueryTypes.SELECT,
    });

    res.json({
      status: true,
      message: "Success",
      data: company_master,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};
module.exports = {
  generatecompanymasterPDF,
  getjobregisterExcelfileDownloadPage,
  loadAllcalbrationlabData,
  deleteCalibrationlab,
  updateCalibrationlab,
  addCalibrationlab,
  updateJobRegistrationData,
  deletejobregister,
  getcompanymaster,
  updatejobregister,
  getjobregister,
  deleteCustomerManagement,
  updatecustomers,
  getcustomerdata,
  jobregister,
  getAllinstrument_make_material,
  customers,
  signout,
  signin,
  loadAllMAkeData,
  deleteMake,
  updateMake,
  addMake,
  loadAllMaterialData,
  deleteMaterial,
  updateMaterial,
  addMaterial,
  loadAllInstrumentsData,
  deleteInstruments,
  updateInstruments,
  addInstruments,
  resetPassWord,
  updatepassword,
  getCustomerDueData,
  getDashboardData,
  sendReminder,
};
