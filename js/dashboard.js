// ======================================================
// ATTENDANCE CHECKER
// DASHBOARD
// VERSION 2.1 QUICK ACTIONS FUNCTIONAL
// ======================================================


import { db } from "./firebase.js";


import {

    collection,

    onSnapshot,

    getDocs,

    query,

    where,

    orderBy,

    limit

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";




// ================================
// LOAD DASHBOARD
// ================================

export function loadDashboard(){


loadStudentCount();

loadSubjectCount();

loadPresentToday();

loadRecentAttendance();

loadAttendanceChart();

setupQuickActions();


    },100);





    const today = new Date();



    const date = today.toLocaleDateString(
        "en-US",
        {

        weekday:"long",

        year:"numeric",

        month:"long",

        day:"numeric"

        }
    );



    const time = today.toLocaleTimeString(
        "en-US",
        {

        hour:"2-digit",

        minute:"2-digit"

        }
    );





return `


<h1 class="page-title">

Dashboard

</h1>




<p class="dashboard-date">

${date} • ${time}

</p>





<div class="grid">



<div class="card stat-card">


<h3>
Total Students
</h3>


<h1 id="totalStudents">

Loading...

</h1>


</div>





<div class="card stat-card">


<h3>
Present Today
</h3>


<h1 id="presentToday">
0
</h1>


</div>





<div class="card stat-card">


<h3>
Subjects
</h3>


<h1 id="totalSubjects">
0
</h1>


</div>





<div class="card stat-card">


<h3>
Attendance Rate
</h3>


<h1 id="attendanceRate">
0%
</h1>


</div>




</div>









<div

style="

margin-top:35px;

display:grid;

grid-template-columns:repeat(auto-fit,minmax(300px,1fr));

gap:25px;

">





<div class="card">


<h2>
Quick Actions
</h2>




<button

class="button"

id="openStudents">


Student Management

</button>




<br><br>




<button

class="button"

id="openScanner">


Open QR Scanner

</button>




<br><br>




<button

class="button"

id="openReports">


Download Reports

</button>




</div>









<div class="card">


<h2>
Recent Attendance
</h2>



<div id="recentAttendance">

No attendance records yet.

</div>



</div>






</div>




`;



}









// ================================
// QUICK ACTIONS
// ================================


function setupQuickActions(){



const studentBtn =
document.getElementById(
"openStudents"
);



const scannerBtn =
document.getElementById(
"openScanner"
);



const reportsBtn =
document.getElementById(
"openReports"
);





if(studentBtn){


studentBtn.onclick = ()=>{


const menu =
document.querySelector(
'[data-page="students"]'
);



if(menu){

menu.click();

}



};


}







if(scannerBtn){


scannerBtn.onclick = ()=>{


const menu =
document.querySelector(
'[data-page="scanner"]'
);



if(menu){

menu.click();

}



};


}







if(reportsBtn){


reportsBtn.onclick = ()=>{


const menu =
document.querySelector(
'[data-page="reports"]'
);



if(menu){

menu.click();

}



};


}



}









// ================================
// STUDENT COUNT
// ================================


function loadStudentCount(){



const studentRef =
collection(db,"students");



onSnapshot(

studentRef,

(snapshot)=>{


const counter =
document.getElementById(
"totalStudents"
);



if(counter){


counter.innerHTML =
snapshot.size;


}



}


);



}








// ================================
// SUBJECT COUNT
// ================================


async function loadSubjectCount(){



try{


const snapshot =
await getDocs(
collection(db,"subjects")
);



const counter =
document.getElementById(
"totalSubjects"
);



if(counter){


counter.innerHTML =
snapshot.size;


}



}






const counter =
document.getElementById(
"totalSubjects"
);



if(counter){

counter.innerHTML = 0;

}


}



}

// ================================
// PRESENT TODAY (REALTIME)
// ================================

function loadPresentToday(){

const today =
new Date()
.toISOString()
.split("T")[0];

const attendanceQuery =
query(

collection(db,"attendance"),

where(
"date",
"==",
today
)

);

onSnapshot(

attendanceQuery,

async(snapshot)=>{

const present =
document.getElementById(
"presentToday"
);

if(present){

present.innerHTML =
snapshot.size;

}

const students =
await getDocs(
collection(db,"students")
);

const rate =
document.getElementById(
"attendanceRate"
);

if(rate){

if(students.size===0){

rate.innerHTML="0%";

}

else{

const percent =
Math.round(

(snapshot.size / students.size) * 100

);

rate.innerHTML =
percent + "%";

}

}

// Refresh recent attendance automatically
loadRecentAttendance();

}

);

}

// ================================
// RECENT ATTENDANCE
// ================================

function loadRecentAttendance(){

try{

const attendanceQuery = query(

collection(db,"attendance"),

orderBy(
"createdAt",
"desc"
),

limit(5)

);

onSnapshot(

attendanceQuery,

(snapshot)=>{

const container =
document.getElementById(
"recentAttendance"
);

if(!container) return;

container.innerHTML="";

if(snapshot.empty){

container.innerHTML=`

<p>

No attendance records yet.

</p>

`;

return;

}

snapshot.forEach(doc=>{

const record = doc.data();

container.innerHTML += `

<div class="recent-item">

<strong>

${record.fullName}

</strong>

<br>

<small>

${record.subjectName || "No Subject"}

</small>

<br>

<small>

${record.time || ""}

</small>

<hr>

</div>

`;

});

}

);
const container =
document.getElementById(
"recentAttendance"
);

if(!container) return;

container.innerHTML = "";

if(snapshot.empty){

container.innerHTML = `

<p>

No attendance records yet.

</p>

`;

return;

}

snapshot.forEach(doc=>{

const record = doc.data();

container.innerHTML += `

<div class="recent-item">

<strong>

${record.fullName}

</strong>

<br>

<small>

${record.subjectName || "No Subject"}

</small>

<br>

<small>

${record.time || ""}

</small>

<hr>

</div>

`;

});

}

catch(error){

console.error(
"Recent Attendance Error:",
error
);

}

}

// ================================
// ATTENDANCE CHART
// ================================

async function loadAttendanceChart(){

try{

const snapshot =
await getDocs(
collection(db,"attendance")
);

const totals = {};

snapshot.forEach(doc=>{

const record = doc.data();

const subject =
record.subjectName || "Unknown";

totals[subject] =
(totals[subject] || 0) + 1;

});

const labels =
Object.keys(totals);

const values =
Object.values(totals);

const canvas =
document.getElementById(
"attendanceChart"
);

if(!canvas) return;

new Chart(canvas,{

type:"bar",

data:{

labels:labels,

datasets:[{

label:"Attendance",

data:values,

borderWidth:1

}]

},

options:{

responsive:true,

plugins:{

legend:{

display:false

}

},

scales:{

y:{

beginAtZero:true

}

}

}

});

}

catch(error){

console.log(error);

}

}
