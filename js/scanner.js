// ======================================================
// ATTENDANCE CHECKER
// QR SCANNER MODULE
// VERSION 6.0
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



let scanner = null;

let processing = false;

let currentSubject = null;

let audioContext = null;



// ================================
// OPEN SCANNER
// ================================

export function openScanner(subjectId){

currentSubject = subjectId;

const result =

document.getElementById(
"scanResult"
);

if(!result) return;

startScanner(result);

}



// ================================
// SOUND
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

oscillator.frequency.value=600;

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
// VIBRATE
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

()=>{}

);

}
