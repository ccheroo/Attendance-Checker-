// ======================================================
// ATTENDANCE CHECKER
// QR SCANNER MODULE
// VERSION 4.0 BETTER UX
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

qrbox:250

},

false

);







scanner.render(



async(decodedText)=>{



if(processing)
return;




processing = true;




console.log(
"QR:",
decodedText
);





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







// FALLBACK SA OLD STUDENTS

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



showMessage(

result,

"❌ Student Not Found",

"QR Code: " + qr,

"error"

);



processing=false;


return;


}







let student = null;






snapshot.forEach(item=>{


student={


id:item.id,


...item.data()


};


});







const saved =

await recordAttendance(student);







if(saved){



// SUCCESS SOUND

const beep =
new Audio(

"https://actions.google.com/sounds/v1/alarms/beep_short.ogg"

);


beep.play();







showMessage(

result,

"✅ Attendance Recorded",

`

<strong>
${student.fullName}
</strong>

<br><br>

Student ID:
${student.studentID}

<br>

Course:
${student.course || "N/A"}

<br><br>

<span style="color:green">

Present

</span>

`,

"success"

);



}



else{



showMessage(

result,

"⚠ Already Recorded",

`

${student.fullName}

<br><br>

This student already checked in today.

`,

"warning"

);



}






}






catch(error){



console.error(
"Scan error:",
error
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
// RESULT DISPLAY
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


Scan Another QR Code

</button>



</div>



`;







document
.getElementById(
"scanAgainBtn"
)
.onclick = ()=>{


container.innerHTML = `


<div class="card">

<h3>

Ready to Scan

</h3>


<p>

Place another QR code inside the scanner.

</p>


</div>


`;



processing=false;



};



}
