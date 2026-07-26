// ======================================================
// ATTENDANCE CHECKER
// QR SCANNER MODULE
// VERSION 5.0 PROFESSIONAL SCANNER UX
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

let audioContext = null;







// ================================
// SOUND SYSTEM
// ================================


function playBeep(type="success"){



try{



if(!audioContext){


audioContext =
new (
window.AudioContext ||
window.webkitAudioContext
)();


}






const oscillator =
audioContext.createOscillator();



const gain =
audioContext.createGain();






if(type==="success"){


oscillator.frequency.value = 1200;


}

else if(type==="warning"){


oscillator.frequency.value = 500;


}

else{


oscillator.frequency.value = 300;


}






oscillator.type="square";



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


console.log(
"Sound blocked:",
error
);


}



}








// ================================
// VIBRATION
// ================================


function vibrate(){


if(
navigator.vibrate
){


navigator.vibrate(150);


}


}









// ================================
// OPEN SCANNER
// ================================


export function openScanner(){



const result =
document.getElementById(
"scanResult"
);





if(!result)
return;






startScanner(result);



}








// ================================
// START SCANNER
// ================================


function startScanner(result){



if(scanner){


try{


scanner.clear();


}

catch(e){}



}







scanner =
new Html5QrcodeScanner(

"reader",

{

fps:10,

qrbox:250,

rememberLastUsedCamera:true


},

false

);







scanner.render(



async(decodedText)=>{



if(processing)
return;





processing=true;





result.innerHTML=`


<div class="card">


<h2>
⏳ Processing...
</h2>


<p>
Checking student record...
</p>


</div>


`;





await findStudent(

decodedText,

result

);




},



(error)=>{


}



);



}
// ================================
// FIND STUDENT
// ================================


async function findStudent(
qr,
result
){



try{



const q =
query(

collection(
db,
"students"
),


where(
"qrCode",
"==",
qr
)

);






let snapshot =
await getDocs(q);







// FALLBACK USING STUDENT ID

if(snapshot.empty){



const oldQuery =
query(

collection(
db,
"students"
),


where(
"studentID",
"==",
qr
)

);



snapshot =
await getDocs(oldQuery);



}









if(snapshot.empty){



playBeep("error");

vibrate();



showMessage(

result,

"❌ Student Not Found",

`

QR Code:

<br>

<strong>
${qr}
</strong>


<br><br>

Please register this student first.

`,

"error"

);



processing=false;


return;



}









let student=null;






snapshot.forEach(item=>{


student={


id:item.id,


...item.data()


};



});










const saved =

await recordAttendance(student);









if(saved){



playBeep(
"success"
);


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


Year:

${student.yearLevel || "N/A"}



<br><br>


<span style="
color:green;
font-weight:bold;
font-size:20px;
">

PRESENT

</span>



`,

"success"

);



}







else{



playBeep(
"warning"
);



vibrate();






showMessage(

result,

"⚠ Already Checked In",

`

<strong>

${student.fullName}

</strong>


<br><br>


This student already has attendance today.

`,

"warning"

);



}






}






catch(error){



console.error(

"Scanner error:",

error

);




playBeep(
"error"
);



showMessage(

result,

"❌ Error",

error.message,

"error"

);



}






processing=false;



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


button.onclick=()=>{


processing=false;



container.innerHTML=`


<div class="card">


<h2>

📷 Ready to Scan

</h2>



<p>

Place another QR code inside the scanner.

</p>


</div>



`;



};



}



}
