// ======================================================
// ATTENDANCE CHECKER
// DASHBOARD MODULE
// VERSION 7.0 FINAL
// PART 1 OF 6
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
// DASHBOARD PAGE
// ================================

export function loadDashboard(){

return `

<h1 class="page-title">

Dashboard

</h1>

<div class="dashboard-grid">

<div class="card dashboard-card">

<h2>

👨‍🎓 Students

</h2>

<h1 id="studentCount">

0

</h1>

<p>

Registered Students

</p>

</div>

<div class="card dashboard-card">

<h2>

📚 Subjects

</h2>

<h1 id="subjectCount">

0

</h1>

<p>

Available Subjects

</p>

</div>

<div class="card dashboard-card">

<h2>

✅ Present Today

</h2>

<h1 id="presentToday">

0

</h1>

<p>

Today's Attendance

</p>

</div>

<div class="card dashboard-card">

<h2>

📈 Attendance Rate

</h2>

<h1 id="attendanceRate">

0%

</h1>

<p>

Overall Attendance

</p>

</div>

</div>



<div class="dashboard-row">

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

<div
style="height:320px">

<canvas
id="attendanceChart">

</canvas>

</div>

</div>

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

}

}

}

);

}
// ================================
// RECENT ATTENDANCE
// ================================

function loadRecentAttendance(){

const attendanceQuery =

query(

collection(db,"attendance"),

orderBy(
"createdAt",
"desc"
),

limit(10)

);

onSnapshot(

attendanceQuery,

(snapshot)=>{

const container =

document.getElementById(
"recentAttendance"
);

if(!container) return;

container.innerHTML = "";

if(snapshot.empty){

container.innerHTML = `

<div class="empty-card">

<h3>

No Attendance Yet

</h3>

<p>

No student has scanned today.

</p>

</div>

`;

return;

}

snapshot.forEach(doc=>{

const record =
doc.data();

container.innerHTML += `

<div class="recent-item">

<div class="recent-avatar">

${(record.fullName || "?")
.charAt(0)
.toUpperCase()}

</div>

<div class="recent-info">

<h4>

${record.fullName}

</h4>

<p>

${record.subjectName || "Unknown Subject"}

</p>

<small>

${record.time || ""}

</small>

</div>

<div class="recent-status">

<span class="status-present">

${record.status || "Present"}

</span>

</div>

</div>

`;

});

}

);

}
// ================================
// ATTENDANCE CHART
// ================================

let attendanceChart = null;

function loadAttendanceChart(){

const attendanceQuery =

query(

collection(db,"attendance")

);

onSnapshot(

attendanceQuery,

(snapshot)=>{

const totals = {};

snapshot.forEach(doc=>{

const record = doc.data();

const subject =

record.subjectCode ||

record.subjectName ||

"Unknown";

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

// Prevent Chart.js error
if(typeof Chart === "undefined"){

console.warn(
"Chart.js not loaded."
);

return;

}

const ctx =
canvas.getContext("2d");

if(attendanceChart){

attendanceChart.destroy();

}

attendanceChart =
new Chart(ctx,{

type:"bar",

data:{

labels,

datasets:[{

label:"Attendance",

data:values,

backgroundColor:[

"#2563EB",
"#10B981",
"#F59E0B",
"#EF4444",
"#8B5CF6",
"#06B6D4",
"#EC4899",
"#14B8A6",
"#84CC16",
"#F97316"

],

borderRadius:8,

maxBarThickness:45

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

);

}
// ================================
// DASHBOARD DATE
// ================================

function updateDashboardDate(){

const element =
document.getElementById(
"dashboardDate"
);

if(!element) return;

element.textContent =
new Date().toLocaleDateString(

"en-PH",

{

weekday:"long",

year:"numeric",

month:"long",

day:"numeric"

}

);

}



// ================================
// DASHBOARD AUTO REFRESH
// ================================

let dashboardTimer = null;

export function startDashboardRefresh(){

stopDashboardRefresh();

dashboardTimer =

setInterval(()=>{

loadStudentCount();

loadSubjectCount();

loadPresentToday();

},60000);

}



// ================================
// STOP REFRESH
// ================================

export function stopDashboardRefresh(){

if(dashboardTimer){

clearInterval(
dashboardTimer
);

dashboardTimer = null;

}

}
