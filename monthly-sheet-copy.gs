// Configuration variables
const SOURCE_SHEET_NAME = "Template"; // Name of the sheet to copy
const TARGET_CELL = "A1"; // Cell reference to update with last date of month

/**
 * Creates a monthly copy of a sheet and updates it with the last date of the month.
 * This function should be triggered on the 1st of each month.
 */
function createMonthlySheetCopy() {
  // Get the active spreadsheet
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
  // Get the source sheet
  const sourceSheet = spreadsheet.getSheetByName(SOURCE_SHEET_NAME);
  if (!sourceSheet) {
    throw new Error(`Source sheet "${SOURCE_SHEET_NAME}" not found`);
  }
  
  // Get current date and calculate last day of month
  const today = new Date();
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
  // Format the sheet name as YYYY-MM
  const sheetName = Utilities.formatDate(today, Session.getScriptTimeZone(), "yyyy-MM");
  
  // Create a copy of the source sheet
  const newSheet = sourceSheet.copyTo(spreadsheet);
  
  // Rename the new sheet
  newSheet.setName(sheetName);
  
  // Move the new sheet to the second position
  newSheet.activate();
  spreadsheet.moveActiveSheet(2);
  
  // Update the specified cell with the last date of the month
  newSheet.getRange(TARGET_CELL).setValue(lastDayOfMonth);
  
  // Log the operation
  Logger.log(`Created new sheet "${sheetName}" with last day of month: ${lastDayOfMonth}`);
}

/**
 * Creates a time-based trigger to run the function on the 1st of each month.
 * This function should be run once to set up the trigger.
 */
function createMonthlyTrigger() {
  // Delete any existing triggers
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));
  
  // Create new trigger for the 1st of each month
  ScriptApp.newTrigger('createMonthlySheetCopy')
    .timeBased()
    .onMonthDay(1)
    .atHour(1) // Run at 1 AM
    .create();
  
  Logger.log('Monthly trigger created successfully');
} 