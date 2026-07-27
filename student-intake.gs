// Google Apps Script: Student Intake Endpoint for Tuition Manager
// Deploy as Web App:
// - Execute as: Me
// - Who has access: Anyone
//
// After deploying, copy the Web App URL into STUDENT_INTAKE_ENDPOINT
// in Tuition_index_new.html.
// Redeploy after any change: Deploy → Manage deployments → New version → Deploy

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents || "{}");

    var teacherEmail = String(body.teacherEmail || "").trim().toLowerCase();
    var batchTab     = String(body.batch || "").trim(); // e.g. "G12 Wed"
    var studentName  = String(body.studentName || "").trim();
    var studentWA    = String(body.studentWhatsapp || "").trim();
    var parentName   = String(body.parentName || "").trim();
    var parentWA     = String(body.parentWhatsapp || "").trim();

    if (!teacherEmail || !batchTab || !studentName || !studentWA) {
      return json({ ok: false, message: "Missing required fields." });
    }

    // Must match your app's sheet naming convention
    var ssName = "MasterTuitionSheet - " + teacherEmail;
    var files = DriveApp.getFilesByName(ssName);
    if (!files.hasNext()) {
      return json({ ok: false, message: "Teacher sheet not found." });
    }

    var ss = SpreadsheetApp.open(files.next());
    var sheet = ss.getSheetByName(batchTab);
    if (!sheet) {
      return json({ ok: false, message: "Batch tab not found: " + batchTab });
    }

    // Prevent duplicate by student WhatsApp in col B (rows 2+)
    var lastRow = Math.max(sheet.getLastRow(), 1);
    if (lastRow >= 2) {
      var existing = sheet.getRange(2, 2, lastRow - 1, 1).getValues(); // col B
      for (var i = 0; i < existing.length; i++) {
        if (String(existing[i][0] || "").trim() === studentWA) {
          return json({ ok: false, message: "Student already exists in this batch." });
        }
      }
    }

    // Read batch defaults (day/time/fees) from Batches tab by batch name
    var day = "", time = "", fees = 0;
    var batches = ss.getSheetByName("Batches");
    if (batches) {
      var rows = batches.getDataRange().getValues(); // headers in row 1
      for (var r = 1; r < rows.length; r++) {
        var batchName = String(rows[r][0] || "").trim();
        if (batchName === batchTab) {
          day  = String(rows[r][1] || "").trim();
          time = String(rows[r][2] || "").trim();
          fees = Number(rows[r][3] || 0);
          break;
        }
      }
    }

    var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    var row = [
      studentName, studentWA, parentName, parentWA,
      day, time, fees, new Date().toISOString()
    ];
    for (var m = 0; m < months.length; m++) row.push("Not Paid");

    sheet.appendRow(row);
    return json({ ok: true, message: "Saved" });

  } catch (err) {
    return json({ ok: false, message: err.message });
  }
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
