// Code.gs file
// don't forget to save & run (to get permissions)

function onEdit() {
  // hard coded number of column to put the date in
  var s = SpreadsheetApp.getActiveSheet();
  var r = s.getActiveCell(); // r is our active cell

  if( 
        (s.getName() === "SheetName1" && r.getRow() >= 18 && r.getColumn() > 1)
    || (s.getName() === "SheetName2" && r.getRow() >= 7 && r.getColumn() > 1)
    || (s.getName() === "SheetName3" && r.getRow() >= 7 && r.getColumn() > 1)
  ) { 
    var nextCell = s.getRange(r.getRow(),1); // next cell will be on the same row in column #colNum
    if( nextCell.getValue() === '' ) // is nextCell empty? DO NOT OVERWRITE EXISTING TIMESTAMPS
      nextCell.setValue(new Date());  // add current timestamp & date to second column
    
    // Copy current fx to new cell
    /***** 
    var current_fx_value = s.getRange(7, 3).getValue()
    var target_fx_cell = s.getRange(r.getRow(), 3)
    if( target_fx_cell.getValue() === '' ) // is fx_cell_target empty? DO NOT OVERWRITE EXISTING FX
      target_fx_cell.setValue(current_fx_value)
    *****/
  }
}