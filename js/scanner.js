// ======================================================
// ATTENDANCE CHECKER
// QR SCANNER MODULE
// VERSION 2.0 FIRESTORE CONNECTED
// ======================================================


import {

    collection,
    getDocs,
    query,
    where

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


import { db } from "./firebase.js";







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
"Scan result missing"
);

return;

}







if(
typeof Html5QrcodeScanner === "undefined"
){


result.innerHTML=`

<p style="color:red">

QR Scanner library not loaded.

</p>

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
"QR RESULT:",
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






const snapshot =
await getDocs(q);







if(snapshot.empty){


result.innerHTML=`

<div class="card">


<h3>
Student Not Found
</h3>


<p>
QR Code:
${qr}
</p>


</div>

`;

return;


}







let student;




snapshot.forEach(item=>{


student={

id:item.id,

...item.data()

};


});









result.innerHTML=`

<div class="card">


<h3>
Attendance Recorded
</h3>


<p>

<strong>
${student.fullName}
</strong>

</p>



<p>
ID:
${student.studentID}
</p>



<p>
Course:
${student.course}
</p>



</div>

`;







// dito natin ikakabit ang attendance saving next



}



catch(error){



console.error(
"QR Search Error:",
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
