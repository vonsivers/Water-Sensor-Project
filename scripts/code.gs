// google script to write LSN50v2 data from TTN v3 to a Google Spreadsheet
//

// test function that renames the sheet upon execution
function test(e){
  var sheet = SpreadsheetApp.openById("YOURSheetdID"); // enter sheet ID here
  var firstSheet = sheet.getSheets()[0];
  sheet.setName("LoraDatenspeicher");
}

// executed upon http post request
function doPost(e) {
    
  // open sheet
  var sheet = SpreadsheetApp.openById("YOURSheetdID"); // enter sheet ID here
  var firstSheet = sheet.getSheets()[0];

  // parse JSON content
  var jsonData = JSON.parse (e.postData.contents);

  // get values from payload data
  var V_ADC = jsonData.uplink_message.decoded_payload.ADC_CH0V
  var V_BAT = jsonData.uplink_message.decoded_payload.BatV
  var tempC = jsonData.uplink_message.decoded_payload.TempC1
  var timeString = jsonData.uplink_message.settings.time

  // calculate water level (in cm)
  var level = -212*V_ADC/(V_BAT-V_ADC) + 58.3 // replace according to sensor calibration

  // append to spreadsheet
  firstSheet.appendRow([timeString, V_ADC, V_BAT, tempC, level])
  
  return ContentService.createTextOutput(JSON.stringify(e))
}

// executed upon http get request (not needed here)
function doGet(e){
  test(e);
}