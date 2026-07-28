// ======================================================
// ATTENDANCE CHECKER
// QR SCANNER MODULE
// VERSION 7.0 CLEAN
// PART 1
// ======================================================

import {
collection,
getDocs,
query,
where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { db } from "./firebase.js";

import {
recordAttendance
} from "./attendance.js";


// ================================
// GLOBAL VARIABLES
// ================================

let scanner = null;

let processing = false;

let currentSubject = null;

let audioContext = null;


// ================================
// OPEN SCANNER
// ================================

export function openScanner(subject){

currentSubject = subject;

const result =
document.getElementById(
"scanResult"
);

if(!result) return;

startScanner(result);

}


// ================================
// PLAY BEEP
// ================================

function playBeep(type="success"){

try{

if(!audioContext){

audioContext =
new(
window.AudioContext ||
window.webkitAudioContext
)();

}

const oscillator =
audioContext.createOscillator();

const gain =
audioContext.createGain();

oscillator.type="square";

switch(type){

case "success":

oscillator.frequency.value=1200;

break;

case "warning":

oscillator.frequency.value=650;

break;

default:

oscillator.frequency.value=350;

}

gain.gain.value=0.15;

oscillator.connect(gain);

gain.connect(
audioContext.destination
);

oscillator.start();

setTimeout(()=>{

oscillator.stop();

},120);

}

catch(error){

console.log(error);

}

}


// ================================
// VIBRATION
// ================================

function vibrate(){

if(navigator.vibrate){

navigator.vibrate(150);

}

}
// ================================
// START SCANNER
// ================================

function startScanner(result){

if(scanner){

try{

scanner.clear();

}

catch(error){}

}

scanner = new Html5QrcodeScanner(

"reader",

{

fps:10,

qrbox:250,

rememberLastUsedCamera:true,

aspectRatio:1.0

},

false

);

scanner.render(

async(decodedText)=>{

if(processing) return;

processing = true;

result.innerHTML = `

<div class="card">

<h2>

⏳ Processing...

</h2>

<p>

Checking attendance...

</p>

</div>

`;

try{

await scanner.pause(true);

}

catch(error){}

await findStudent(

decodedText,

result

);

},

(error)=>{

// Ignore scanner errors

}

);

}
// ================================
// FIND STUDENT
// ================================

async function findStudent(qr,result){

try{

const q = query(

collection(db,"students"),

where(
"qrCode",
"==",
qr
)

);

let snapshot =
await getDocs(q);


// ================================
// FALLBACK USING STUDENT ID
// ================================

if(snapshot.empty){

const oldQuery = query(

collection(db,"students"),

where(
"studentID",
"==",
qr
)

);

snapshot =
await getDocs(oldQuery);

}


// ================================
// STUDENT NOT FOUND
// ================================

if(snapshot.empty){

playBeep("error");

vibrate();

showMessage(

result,

"❌ Student Not Found",

`
QR Code:

<br>

<strong>${qr}</strong>

<br><br>

Please register this student first.

`,

"error"

);

processing=false;

try{

scanner.resume();

}

catch(e){}

return;

}


// ================================
// GET STUDENT DATA
// ================================

let student=null;

snapshot.forEach(doc=>{

student={

id:doc.id,

...doc.data()

};

});


// ================================
// SAVE ATTENDANCE
// ================================

const saved =
await recordAttendance(

student,

currentSubject

);


// ================================
// SUCCESS
// ================================

if(saved){

playBeep("success");

vibrate();

showMessage(

result,

"✅ Attendance Recorded",

`

<strong style="font-size:22px">

${student.fullName}

</strong>

<br><br>

Student ID:

${student.studentID}

<br>

Course:

${student.course || "N/A"}

<br>

Year Level:

${student.yearLevel || "N/A"}

<br>

Subject:

${currentSubject.code}

 - 

${currentSubject.name}

<br><br>

<span style="
color:green;
font-size:20px;
font-weight:bold;
">

PRESENT

</span>

`,

"success"

);

}


// ================================
// ALREADY RECORDED
// ================================

else{

playBeep("warning");

vibrate();

showMessage(

result,

"⚠ Already Checked In",

`

<strong>

${student.fullName}

</strong>

<br><br>

Attendance already recorded for

<strong>

${currentSubject.code}

</strong>

today.

`,

"warning"

);

}

}

catch(error){

console.error(error);

playBeep("error");

showMessage(

result,

"❌ Error",

error.message,

"error"

);

}

processing=false;

try{

scanner.resume();

}

catch(e){}

}
// ================================
// MESSAGE DISPLAY
// ================================

function showMessage(

container,
title,
message,
type

){

container.innerHTML = `

<div class="card scan-${type}">

<h2>

${title}

</h2>

<p>

${message}

</p>

<br>

<button

id="scanAgainBtn"

class="button">

📷 Scan Another QR Code

</button>

</div>

`;

const button =

document.getElementById(
"scanAgainBtn"
);

if(button){

button.onclick = ()=>{

processing = false;

container.innerHTML = `

<div class="card">

<h2>

📷 Ready to Scan

</h2>

<p>

Place another QR code inside the scanner.

</p>

</div>

`;

try{

scanner.resume();

}

catch(error){

console.log(error);

}

};

}

}



// ================================
// CLOSE SCANNER
// ================================

export async function closeScanner(){

try{

if(scanner){

await scanner.clear();

scanner = null;

}

}

catch(error){

console.log(error);

}

processing = false;

currentSubject = null;

}



// ================================
// GET CURRENT SUBJECT
// ================================

export function getCurrentSubject(){

return currentSubject;

}



// ================================
// MODULE READY
// ================================

console.log(

"📷 Scanner Module Version 7 Ready"

);
