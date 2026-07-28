// ======================================================
// ATTENDANCE CHECKER
// DASHBOARD MODULE
// VERSION 7.0
// PART 1
// ======================================================

// ================================
// IMPORTS
// ================================

import { db } from "./firebase.js";

import {

collection,
getDocs,
query,
where,
orderBy,
limit,
onSnapshot

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



// ================================
// DASHBOARD HTML
// ================================

export function loadDashboard(){

return `

<h1 class="page-title">

Dashboard

</h1>

<div class="dashboard-grid">

<div class="card dashboard-card">

<h2>

👨‍🎓 Total Students

</h2>

<h1 id="studentCount">

0

</h1>

</div>

<div class="card dashboard-card">

<h2>

📖 Total Subjects

</h2>

<h1 id="subjectCount">

0

</h1>

</div>

<div class="card dashboard-card">

<h2>

✅ Present Today

</h2>

<h1 id="presentToday">

0

</h1>

</div>

<div class="card dashboard-card">

<h2>

📈 Attendance Rate

</h2>

<h1 id="attendanceRate">

0%

</h1>

</div>

</div>

<div class="card">

<h2>

🟢 Recent Attendance

</h2>

<div id="recentAttendance">

Loading...

</div>

</div>

<div class="card">

<h2>

📊 Attendance Analytics

</h2>

<canvas

id="attendanceChart"

height="120">

</canvas>

</div>

`;

}
// ================================
// INITIALIZE DASHBOARD
// ================================

export function initDashboard(){

loadStudentCount();

loadSubjectCount();

loadPresentToday();

loadRecentAttendance();

loadAttendanceChart();

}
// ================================
// LOAD STUDENT COUNT
// ================================

async function loadStudentCount(){

try{

const snapshot =
await getDocs(
collection(db,"students")
);

const element =
document.getElementById(
"studentCount"
);

if(element){

element.textContent =
snapshot.size;

}

}

catch(error){

console.error(
"Student Count:",
error
);

}

}



// ================================
// LOAD SUBJECT COUNT
// ================================

async function loadSubjectCount(){

try{

const snapshot =
await getDocs(
collection(db,"subjects")
);

const element =
document.getElementById(
"subjectCount"
);

if(element){

element.textContent =
snapshot.size;

}

}

catch(error){

console.error(
"Subject Count:",
error
);

}

}
// ================================
// PRESENT TODAY
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

present.textContent =
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

rate.textContent="0%";

}

else{

const percent =
Math.round(

(snapshot.size / students.size) * 100

);

rate.textContent =
percent + "%";
loadAttendanceChart();
}

}

}

);

}
// ================================
// ATTENDANCE ANALYTICS
// ================================

let attendanceChart = null;

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

const ctx =
canvas.getContext("2d");

if(attendanceChart){

attendanceChart.destroy();

}

attendanceChart = new Chart(ctx,{

type:"bar",

data:{

labels,

datasets:[{

label:"Attendance",

data:values,

backgroundColor:[
"#2563eb",
"#10b981",
"#f59e0b",
"#ef4444",
"#8b5cf6",
"#06b6d4",
"#ec4899",
"#14b8a6"
],

borderRadius:8,

maxBarThickness:50

}]

},

options:{

responsive:true,

maintainAspectRatio:false,

plugins:{

legend:{

display:false

},

title:{

display:true,

text:"Attendance Per Subject"

}

},

scales:{

y:{

beginAtZero:true,

ticks:{

precision:0

}

}

}

}

});

}

catch(error){

console.error(

"Attendance Chart:",

error

);

}

}
