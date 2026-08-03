// ======================================================
// ATTENDANCE CHECKER
// SETTINGS MODULE
// VERSION 7.0 FINAL
// PART 1 OF 6
// ======================================================


// ================================
// IMPORTS
// ================================

import {

db

} from "./firebase.js";

import {

doc,
getDoc,
setDoc

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



// ================================
// SETTINGS DATA
// ================================

let settings = {

schoolName:
"Attendance Checker",

scannerSound:
true,

scannerVibration:
true,

theme:
"light",

attendanceStart:
"07:00",

attendanceEnd:
"22:00"

};



// ================================
// LOAD SETTINGS PAGE
// ================================

export async function loadSettings(){

await loadSettingsData();

mainContent.innerHTML = `

<h1 class="page-title">

Settings

</h1>



<div class="card">

<h2>

General Settings

</h2>

<label>

School Name

</label>

<input

id="schoolName"

class="input"

value="${settings.schoolName}"

>



<label>

Attendance Start

</label>

<input

type="time"

id="attendanceStart"

class="input"

value="${settings.attendanceStart}"

>



<label>

Attendance End

</label>

<input

type="time"

id="attendanceEnd"

class="input"

value="${settings.attendanceEnd}"

>

</div>



<div class="card">

<h2>

Scanner Settings

</h2>

<label>

<input

type="checkbox"

id="scannerSound"

${settings.scannerSound ? "checked" : ""}

>

Enable Scanner Sound

</label>

<br><br>

<label>

<input

type="checkbox"

id="scannerVibration"

${settings.scannerVibration ? "checked" : ""}

>

Enable Vibration

</label>

</div>



<div class="card">

<h2>

Appearance

</h2>

<select

id="theme"

class="input">

<option

value="light"

${settings.theme==="light"?"selected":""}

>

Light Theme

</option>

<option

value="dark"

${settings.theme==="dark"?"selected":""}

>

Dark Theme

</option>

</select>

</div>



<div class="card">

<button

class="button"

id="saveSettingsBtn">

Save Settings

</button>

</div>

`;

initializeSettingsEvents();

}

// ================================
// LOAD SETTINGS DATA
// ================================

async function loadSettingsData(){

try{

const settingsRef =

doc(

db,

"settings",

"system"

);

const snapshot =

await getDoc(
settingsRef
);

if(snapshot.exists()){

settings = {

...settings,

...snapshot.data()

};

}

else{

await setDoc(

settingsRef,

settings

);

}

}

catch(error){

console.error(

"Load Settings:",

error

);

}

}



// ================================
// INITIALIZE EVENTS
// ================================

function initializeSettingsEvents(){

const saveButton =

document.getElementById(
"saveSettingsBtn"
);

if(saveButton){

saveButton.onclick = ()=>{

saveSettings();

};

}

}

// ================================
// SAVE SETTINGS
// ================================

async function saveSettings(){

const saveButton =

document.getElementById(
"saveSettingsBtn"
);

if(saveButton){

saveButton.disabled = true;

saveButton.textContent =
"Saving...";

}

try{

const schoolName =

document
.getElementById("schoolName")
.value
.trim();

const attendanceStart =

document
.getElementById("attendanceStart")
.value;

const attendanceEnd =

document
.getElementById("attendanceEnd")
.value;

const scannerSound =

document
.getElementById("scannerSound")
.checked;

const scannerVibration =

document
.getElementById("scannerVibration")
.checked;

const theme =

document
.getElementById("theme")
.value;



if(!schoolName){

alert(
"School Name is required."
);

if(saveButton){

saveButton.disabled = false;

saveButton.textContent =
"Save Settings";

}

return;

}



settings = {

schoolName,

attendanceStart,

attendanceEnd,

scannerSound,

scannerVibration,

theme

};



await setDoc(

doc(

db,

"settings",

"system"

),

settings

);



alert(

"Settings saved successfully!"

);

}

catch(error){

console.error(

"Save Settings:",

error

);

alert(

"Failed to save settings."

);

}

finally{

if(saveButton){

saveButton.disabled = false;

saveButton.textContent =
"Save Settings";

}

}

}

// ================================
// APPLY THEME
// ================================

function applyTheme(){

const theme =

document
.getElementById("theme")
.value;

document.body
.setAttribute(

"data-theme",

theme

);

}



// ================================
// LIVE THEME PREVIEW
// ================================

function initializeThemePreview(){

const themeSelect =

document.getElementById(
"theme"
);

if(!themeSelect) return;

themeSelect.addEventListener(

"change",

()=>{

applyTheme();

}

);

}



// ================================
// LOAD SAVED THEME
// ================================

function loadSavedTheme(){

if(settings.theme){

document.body.setAttribute(

"data-theme",

settings.theme

);

}

}



// ================================
// RESET SETTINGS
// ================================

function resetSettings(){

document
.getElementById("schoolName")
.value =
"Attendance Checker";

document
.getElementById("attendanceStart")
.value =
"07:00";

document
.getElementById("attendanceEnd")
.value =
"22:00";

document
.getElementById("scannerSound")
.checked = true;

document
.getElementById("scannerVibration")
.checked = true;

document
.getElementById("theme")
.value = "light";

applyTheme();

}



// ================================
// UPDATE INITIALIZER
// ================================

const oldInitialize =
initializeSettingsEvents;

initializeSettingsEvents = function(){

oldInitialize();

initializeThemePreview();

loadSavedTheme();

};

// ================================
// EXPORT SETTINGS (BACKUP)
// ================================

function exportSettings(){

const data = JSON.stringify(

settings,

null,

2

);

const blob =

new Blob(

[data],

{

type:"application/json"

}

);

const url =

URL.createObjectURL(blob);

const link =

document.createElement("a");

link.href = url;

link.download =

"attendance_settings_backup.json";

document.body.appendChild(link);

link.click();

document.body.removeChild(link);

URL.revokeObjectURL(url);

alert(

"Settings backup created successfully."

);

}



// ================================
// IMPORT SETTINGS (RESTORE)
// ================================

function importSettings(file){

const reader = new FileReader();

reader.onload = async(event)=>{

try{

const imported =

JSON.parse(

event.target.result

);

settings = {

...settings,

...imported

};

await setDoc(

doc(

db,

"settings",

"system"

),

settings

);

alert(

"Settings restored successfully."

);

await loadSettings();

}

catch(error){

console.error(

"Restore Settings:",

error

);

alert(

"Invalid backup file."

);

}

};

reader.readAsText(file);

}



// ================================
// CLEAR ATTENDANCE CONFIRMATION
// ================================

function confirmClearAttendance(){

const confirmed = confirm(

"Are you sure you want to clear all attendance records?\n\nThis action cannot be undone."

);

if(!confirmed){

return;

}

alert(

"Attendance clearing will be implemented in the Attendance module."

);

}



// ================================
// ABOUT SYSTEM
// ================================

function showAboutSystem(){

alert(

`Attendance Checker

Version 7.0

Developed for Student Attendance Management.

Powered by Firebase Firestore & Storage.`

);

}

// ======================================================
// SETTINGS MODULE
// FINAL INITIALIZATION
// PART 6 OF 6
// ======================================================


// ================================
// REFRESH SETTINGS
// ================================

export async function refreshSettings(){

try{

await loadSettingsData();

await loadSettings();

}

catch(error){

console.error(

"Refresh Settings:",

error

);

}

}



// ================================
// RESET TO DEFAULT SETTINGS
// ================================

export async function restoreDefaultSettings(){

const confirmed = confirm(

"Restore all settings to default?"

);

if(!confirmed) return;

settings = {

schoolName:
"Attendance Checker",

scannerSound:
true,

scannerVibration:
true,

theme:
"light",

attendanceStart:
"07:00",

attendanceEnd:
"22:00"

};

try{

await setDoc(

doc(

db,

"settings",

"system"

),

settings

);

alert(

"Default settings restored successfully."

);

await loadSettings();

}

catch(error){

console.error(

"Restore Default:",

error

);

alert(

"Unable to restore default settings."

);

}

}



// ================================
// MODULE READY
// ================================

console.clear();

console.log(

"⚙️ Settings Module v7.0 Ready"

);
