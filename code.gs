function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('SpeechLogger')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL) 
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function onOpen() {
  SpreadsheetApp.getUi().createMenu('Recorder')
    .addItem('Open Recorder', 'showSidebar').addToUi();
}

function showSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('index').setTitle('Recorder Interface').setWidth(400);
  SpreadsheetApp.getUi().showSidebar(html);
}

// --- SETUP LOGIC ---
function getSetupStatus() {
  var props = PropertiesService.getScriptProperties();
  return {
    isConfigured: !!(props.getProperty('TARGET_FOLDER') && props.getProperty('FEEDBACK_FOLDER') && props.getProperty('NOTES_FOLDER'))
  };
}

function saveSetup(config) {
  var props = PropertiesService.getScriptProperties();
  props.setProperty('TARGET_FOLDER', config.target);
  props.setProperty('FEEDBACK_FOLDER', config.feedback);
  props.setProperty('NOTES_FOLDER', config.notes);
  return { success: true };
}

// --- APPEARANCE PERSISTENCE ---
function saveAppearance(settings) {
  var props = PropertiesService.getScriptProperties();
  props.setProperty('THEME', settings.theme);
  props.setProperty('FONT_INDEX', settings.fontIndex);
  return { success: true };
}

function getAppearance() {
  var props = PropertiesService.getScriptProperties();
  return {
    theme: props.getProperty('THEME') || 'light',
    fontIndex: props.getProperty('FONT_INDEX') || '0'
  };
}

function clearSetupProperties() {
  var props = PropertiesService.getScriptProperties();
  props.deleteProperty('TARGET_FOLDER');
  props.deleteProperty('FEEDBACK_FOLDER');
  props.deleteProperty('NOTES_FOLDER');
  props.deleteProperty('THEME');
  props.deleteProperty('FONT_INDEX');
  return { success: true };
}

// --- UPDATED FOLDER GETTERS ---
function getTargetFolderId() {
  var id = PropertiesService.getScriptProperties().getProperty('TARGET_FOLDER');
  if (id) return id;
  var folders = DriveApp.getFoldersByName("Speech Recordings");
  return folders.hasNext() ? folders.next().getId() : null;
}

function getFeedbackFolderId() {
  var id = PropertiesService.getScriptProperties().getProperty('FEEDBACK_FOLDER');
  if (id) return id;
  var folders = DriveApp.getFoldersByName("Feedback Recordings");
  return folders.hasNext() ? folders.next().getId() : null;
}

function getNotesRootFolderId() {
  var id = PropertiesService.getScriptProperties().getProperty('NOTES_FOLDER');
  if (id) return id;
  var folders = DriveApp.getFoldersByName("Notes Pictures");
  return folders.hasNext() ? folders.next().getId() : null;
}

function getUserFolders() {
  var folders = DriveApp.getFolders(), list = [];
  while (folders.hasNext()) {
    var f = folders.next();
    list.push({name: f.getName(), id: f.getId()});
  }
  return list.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Helper to convert various date formats to specific strings
 */
function formatCustomDate(dateVal, format) {
  if (!dateVal) return "";
  var date;
  if (dateVal instanceof Date) {
    date = dateVal;
  } else if (typeof dateVal === 'string') {
    date = new Date(dateVal);
  } else {
    date = new Date(dateVal);
  }
  
  if (isNaN(date.getTime())) return dateVal;
  return Utilities.formatDate(date, Session.getScriptTimeZone(), format);
}

/**
 * Loads data for a specific code and ensures the date is formatted for display
 */
function getByCode(code) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Speech Tracker");
    if (!sheet) return { success: false, error: "Sheet not found." };
    var data = sheet.getDataRange().getValues();
    
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] == code) {
        var formattedDate = formatCustomDate(data[i][1], "yyyy-MM-dd");
        
        return {
          success: true,
          row: i + 1,
          data: {
            speechCode: data[i][0],
            date: formattedDate, 
            motion: data[i][2],
            style: data[i][3],
            position: data[i][4],
            score: data[i][5],
            fileUrl: data[i][6],
            feedback: data[i][7],
            notes: data[i][8]
          }
        };
      }
    }
    return { success: false, error: "Code not found." };
  } catch (e) { return { success: false, error: e.toString() }; }
}

/**
 * Saves audio and metadata, and renames existing files (Speech, Feedback, Notes) if they exist
 */
function saveAudioFile(base64Data, fileNameIgnored, folderId, info, existingRow) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Speech Tracker") || ss.insertSheet("Speech Tracker");
    
    var formattedDisplayDate = formatCustomDate(info.date, "MMMM d, yyyy");
    var fullMonthName = formatCustomDate(info.date, "MMMM");
    var dayNum = formatCustomDate(info.date, "d");
    var yearNum = formatCustomDate(info.date, "yyyy");
    
    var namingTemplate = "[" + info.speechCode + "].{TYPE}." + info.style + "." + info.position + "." + fullMonthName + "." + dayNum + "." + yearNum;
    
    var speechFileName = namingTemplate.replace("{TYPE}", "Speech");
    var feedbackFileName = namingTemplate.replace("{TYPE}", "Feedback");
    var notesFileName = namingTemplate.replace("{TYPE}", "Notes");
    
    if (info.fileUrl) {
      try {
        var fileId = info.fileUrl.split('id=')[1] || info.fileUrl.split('/d/')[1].split('/')[0];
        DriveApp.getFileById(fileId).setName(speechFileName + ".mp3");
      } catch (err) {}
    }

    var relatedItems = DriveApp.searchFiles("title contains '[" + info.speechCode + "]'");
    while (relatedItems.hasNext()) {
      var item = relatedItems.next();
      var itemName = item.getName();
      if (itemName.includes(".Feedback.")) {
        item.setName(itemName.replace(/^\[.*?\].Feedback\..*?\.(Photo|mp3|txt)/, feedbackFileName + ".$1"));
      } else if (itemName.includes(".Notes.")) {
        item.setName(itemName.replace(/^\[.*?\].Notes\..*?\.(Photo|mp3|txt|jpg)/, notesFileName + ".$1"));
      }
    }
    
    var relatedFolders = DriveApp.searchFolders("title contains '[" + info.speechCode + "]'");
    while (relatedFolders.hasNext()) {
      var folder = relatedFolders.next();
      var fName = folder.getName();
      if (fName.includes(".Feedback.")) folder.setName(feedbackFileName);
      else if (fName.includes(".Notes.")) folder.setName(notesFileName);
    }
    
    var fileUrl = info.fileUrl || "";
    
    if (base64Data) {
      var finalFolderId = folderId;
      var typeTag = info.isFeedback ? "Feedback" : "Speech";
      var currentFileName = namingTemplate.replace("{TYPE}", typeTag);
      
      if (info.isFeedback) {
        var fbFolderId = getFeedbackFolderId();
        if (fbFolderId) finalFolderId = fbFolderId;
      }
      
      var folder = DriveApp.getFolderById(finalFolderId);
      var blob = Utilities.newBlob(Utilities.base64Decode(base64Data), 'audio/mpeg', currentFileName + ".mp3");
      fileUrl = folder.createFile(blob).getUrl();
    }
    
    var rowData = [info.speechCode, formattedDisplayDate, info.motion, info.style, info.position, info.score, fileUrl, info.feedback, info.notes];
    var destRow = existingRow || (sheet.getLastRow() + 1);
    sheet.getRange(destRow, 1, 1, 9).setValues([rowData]);
    
    return { success: true, row: parseInt(destRow), url: fileUrl, formattedDate: formattedDisplayDate };
  } catch (e) { return {error: e.toString()}; }
}

function deleteFeedbackFile(fileUrl) {
  try {
    if (!fileUrl) return { success: false };
    var fileId = fileUrl.split('id=')[1] || fileUrl.split('/d/')[1].split('/')[0];
    DriveApp.getFileById(fileId).setTrashed(true);
    return { success: true };
  } catch (e) { return { success: false, error: e.toString() }; }
}

function uploadImageToFolder(base64Data, metadata, folderId, type) {
  try {
    var fullMonthName = formatCustomDate(metadata.date, "MMMM");
    var dayNum = formatCustomDate(metadata.date, "d");
    var yearNum = formatCustomDate(metadata.date, "yyyy");
    
    var typeTag = (type === 'notes') ? "Notes" : "Feedback";
    var speechCodeTag = "[" + metadata.speechCode + "]";
    
    var rootFolderId = (type === 'notes') ? getNotesRootFolderId() : getFeedbackFolderId();
    if (!rootFolderId) return { success: false, error: "Root folder not found." };
    var rootFolder = DriveApp.getFolderById(rootFolderId);
    
    var folderSearch = rootFolder.getFolders();
    var targetFolder = null;
    while (folderSearch.hasNext()) {
      var f = folderSearch.next();
      if (f.getName().indexOf(speechCodeTag) !== -1) {
        targetFolder = f;
        break;
      }
    }
    
    if (!targetFolder) {
      var newFolderName = speechCodeTag + "." + typeTag + "." + metadata.style + "." + metadata.position + "." + fullMonthName + "." + dayNum + "." + yearNum;
      targetFolder = rootFolder.createFolder(newFolderName);
    }
    
    var count = 0;
    var existingFiles = targetFolder.getFiles();
    while (existingFiles.hasNext()) { existingFiles.next(); count++; }
    
    var finalFileName = targetFolder.getName() + ".Photo " + (count + 1) + ".jpg";
    var blob = Utilities.newBlob(Utilities.base64Decode(base64Data), 'image/jpeg', finalFileName);
    var file = targetFolder.createFile(blob);
    
    return { success: true, folderUrl: targetFolder.getUrl() };
  } catch (e) { return { success: false, error: e.toString() }; }
}

function deleteByCode(code) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Speech Tracker");
    if (!sheet) return { success: false, error: "Sheet not found." };
    var data = sheet.getDataRange().getValues();
    var files = DriveApp.searchFiles("title contains '[" + code + "]'");
    while (files.hasNext()) { files.next().setTrashed(true); }
    var folders = DriveApp.searchFolders("title contains '[" + code + "]'");
    while (folders.hasNext()) { folders.next().setTrashed(true); }
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] == code) { sheet.deleteRow(i + 1); return { success: true }; }
    }
    return { success: false, error: "Code not found." };
  } catch (e) { return { success: false, error: e.toString() }; }
}
