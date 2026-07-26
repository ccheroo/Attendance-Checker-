// ======================================================
// ATTENDANCE CHECKER
// QR SCANNER MODULE
// VERSION 3.0 AUTO ATTENDANCE
// ======================================================


import { db } from "./firebase.js";


import {

    collection,

    getDocs,

    query,

    where

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


import {

    recordAttendance

} from "./attendance.js";






let scanner = null;







// ================================
// OPEN SCANNER
// ================================


export function openScanner(){



const result =
document.getElementById(
"scanResult"
);





if(!result){

console.error(
"Scan result container missing"
);

return;

}






if(
typeof Html5QrcodeScanner === "undefined"
){


result.innerHTML=`

<div class="card">

<h3>
Scanner Error
</h3>

<p>
QR library not loaded.
</p>

</div>

`;

return;


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



console.log(
"QR SCANNED:",
decodedText
);





await findStudent(
decodedText,
result
);





scanner.clear();



},




(error)=>{


// ignore scanning errors


}



);



}









// ================================
// FIND STUDENT
// ================================


async function findStudent(qr,result){



try{



const q = query(


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






// fallback kapag old student ID ang QR

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


result.innerHTML=`


<div class="card">


<h3>
Student Not Found
</h3>



<p>

QR:

${qr}

</p>


</div>


`;

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



result.innerHTML=`


<div class="card">


<h2>
✅ Attendance Recorded
</h2>



<h3>

${student.fullName}

</h3>



<p>

<strong>
Student ID:
</strong>

${student.studentID}

</p>




<p>

<strong>
Course:
</strong>

${student.course}

</p>



<p>

<strong>
Status:
</strong>

Present

</p>



</div>


`;



}





}



catch(error){



console.error(
"Scanner error:",
error
);



result.innerHTML=`


<div class="card">


<h3>
Error
</h3>


<p>

${error.message}

</p>


</div>


`;



}



}
