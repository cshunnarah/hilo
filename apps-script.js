// Paste this entire file into Google Apps Script (script.google.com)
// See README steps below for setup instructions.

const SHEET_NAME = 'Scores';

function doGet(e) {
  const action = e.parameter.action;
  if (action === 'save') return saveScore(e.parameter.name, parseInt(e.parameter.score, 10));
  if (action === 'top')  return getTop();
  return respond({ error: 'Unknown action' });
}

function saveScore(name, score) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) sheet.appendRow(['Timestamp', 'Name', 'Score']);
  sheet.appendRow([new Date().toISOString(), name, score]);
  return respond({ status: 'ok' });
}

function getTop() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet || sheet.getLastRow() <= 1) return respond({ top: [] });
  const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 3).getValues();
  const scores = data
    .filter(row => row[1] && row[2] !== '')
    .map(row => ({ name: String(row[1]), score: Number(row[2]) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  return respond({ top: scores });
}

function respond(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
