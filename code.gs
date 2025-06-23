const SHEET_ID = '1H1nofcNWNYx22VTsVQTGsI3qiFZjB93raCY96JISSyY';
const FOLDER_ID = '1zaTR7a4zntipk4sca_tAoVpR_OakbsM8';

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index');
}

function uploadFiles(formData) {
  if (!formData || !formData.establishmentName) {
    throw new Error("Missing form data");
  }

  const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd_HHmmss');
  const safeName = formData.establishmentName.replace(/[^\w\s]/g, '').replace(/\s+/g, '_');
  const baseFolderName = `${safeName}_${timestamp}`;

  const parent = DriveApp.getFolderById(FOLDER_ID);
  const folder = parent.createFolder(baseFolderName);
  const fileLinks = [];

  formData.files.forEach((file, index) => {
    const ext = file.filename.split('.').pop();
    const newName = `${safeName}_${timestamp}_${index + 1}.${ext}`;
    const blob = Utilities.newBlob(Utilities.base64Decode(file.bytes), file.contentType).setName(newName);
    const saved = folder.createFile(blob);
    fileLinks.push(saved.getUrl());
  });

  const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
  sheet.appendRow([
    new Date(),
    formData.establishmentName,
    formData.address,
    formData.fboName,
    formData.contactNumber,
    formData.sampleDetails,
    formData.latitude,
    formData.longitude,
    fileLinks.join(', ')
  ]);

  return "✅ Data & Photos Submitted Successfully";
}
