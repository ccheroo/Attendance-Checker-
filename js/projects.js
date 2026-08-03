// ======================================================
// ATTENDANCE CHECKER
// REPORTS MODULE
// VERSION 8.0 FINAL
// PART 1 OF 3
// ======================================================

// ================================
// IMPORTS
// ================================

import { db } from "./firebase.js";

import {

collection,
getDocs,
query,
orderBy

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



// ================================
// GLOBAL VARIABLES
// ================================

const mainContent =
document.getElementById("mainContent");

let reportData = [];



// ================================
// LOAD REPORTS PAGE
// ================================

export async function loadReports(){

mainContent.innerHTML = `

<h1 class="page-title">

Attendance Reports

</h1>

<div class="card">

<h2>

Filters

</h2>

<div class="report-filters">

<input
type="date"
id="reportDate"
class="input">

<select
id="reportSubject"
class="input">

<option value="">

All Subjects

</option>

</select>

<input
type="text"
id="reportSearch"
class="input"
placeholder="Search Student...">

</div>

<br>

<div
style="
display:flex;
gap:10px;
flex-wrap:wrap;
">

<button
class="button"
id="generateReportBtn">

Generate Report

</button>

<button
class="button"
id="printReportBtn">

Print

</button>

<button
class="button"
id="excelReportBtn">

Export CSV

</button>

</div>

</div>



<div
id="reportSummary"
class="dashboard-grid">

</div>



<div class="card">

<h2>

Attendance Records

</h2>

<div
id="reportContainer">

Loading...

</div>

</div>

`;

await loadSubjects();

initializeEvents();

await generateReport();

}



// ================================
// LOAD SUBJECTS
// ================================

async function loadSubjects(){

const select =

document.getElementById(
"reportSubject"
);

if(!select) return;

try{

const snapshot =

await getDocs(

collection(
db,
"subjects"
)

);

snapshot.forEach(doc=>{

const data =
doc.data();

const option =
document.createElement("option");

option.value =
data.name;

option.textContent =
data.name;

select.appendChild(option);

});

}

catch(error){

console.error(

"Reports:",

error

);

}

}



// ================================
// INITIALIZE EVENTS
// ================================

function initializeEvents(){

document

.getElementById("generateReportBtn")

.onclick = ()=>{

generateReport();

};



document

.getElementById("printReportBtn")

.onclick = ()=>{

window.print();

};



document

.getElementById("excelReportBtn")

.onclick = ()=>{

exportCSV();

};



document

.getElementById("reportSearch")

.addEventListener(

"input",

()=>{

displayReports();

updateSummary();

}

);



document

.getElementById("reportSubject")

.addEventListener(

"change",

()=>{

displayReports();

updateSummary();

}

);



document

.getElementById("reportDate")

.addEventListener(

"change",

()=>{

displayReports();

updateSummary();

}

);

}

// ================================
// GENERATE REPORT
// ================================

async function generateReport(){

try{

const attendanceQuery = query(

collection(db,"attendance"),

orderBy("createdAt","desc")

);

const snapshot = await getDocs(attendanceQuery);

reportData = [];

snapshot.forEach(doc=>{

reportData.push({

id:doc.id,

...doc.data()

});

});

displayReports();

updateSummary();

}

catch(error){

console.error(

"Generate Report:",

error

);

const container =

document.getElementById(
"reportContainer"
);

if(container){

container.innerHTML = `

<div class="card">

<h2>

Unable to load reports

</h2>

<p>

${error.message}

</p>

</div>

`;

}

}

}



// ================================
// DISPLAY REPORTS
// ================================

function displayReports(){

const container =

document.getElementById(
"reportContainer"
);

if(!container) return;

const search =

document
.getElementById("reportSearch")
.value
.toLowerCase();

const subject =

document
.getElementById("reportSubject")
.value;

const date =

document
.getElementById("reportDate")
.value;

const filtered = reportData.filter(record=>{

const matchSearch =

(record.fullName || "")
.toLowerCase()
.includes(search)

||

(record.studentID || "")
.toLowerCase()
.includes(search);

const matchSubject =

subject === ""

||

record.subjectName === subject;

const matchDate =

date === ""

||

record.date === date;

return (

matchSearch &&

matchSubject &&

matchDate

);

});

if(filtered.length===0){

container.innerHTML = `

<div class="card">

<h2>

No Records Found

</h2>

<p>

There are no attendance records that match your filters.

</p>

</div>

`;

return;

}

let html = `

<table class="report-table">

<thead>

<tr>

<th>Student ID</th>

<th>Name</th>

<th>Subject</th>

<th>Date</th>

<th>Time</th>

<th>Status</th>

</tr>

</thead>

<tbody>

`;

filtered.forEach(record=>{

html += `

<tr>

<td>${record.studentID || "-"}</td>

<td>${record.fullName || "-"}</td>

<td>${record.subjectName || "-"}</td>

<td>${record.date || "-"}</td>

<td>${record.time || "-"}</td>

<td>${record.status || "Present"}</td>

</tr>

`;

});

html += `

</tbody>

</table>

`;

container.innerHTML = html;

}



// ================================
// UPDATE SUMMARY
// ================================

function updateSummary(){

const summary =

document.getElementById(
"reportSummary"
);

if(!summary) return;

const total = reportData.length;

const present = reportData.filter(r=>

(r.status || "Present")
.toLowerCase()==="present"

).length;

const late = reportData.filter(r=>

(r.status || "")
.toLowerCase()==="late"

).length;

const absent = reportData.filter(r=>

(r.status || "")
.toLowerCase()==="absent"

).length;

const rate =

total===0

? 0

: Math.round(

(present/total)*100

);

summary.innerHTML = `

<div class="card dashboard-card">

<h3>Total Records</h3>

<h1>${total}</h1>

</div>

<div class="card dashboard-card">

<h3>Present</h3>

<h1>${present}</h1>

</div>

<div class="card dashboard-card">

<h3>Late</h3>

<h1>${late}</h1>

</div>

<div class="card dashboard-card">

<h3>Absent</h3>

<h1>${absent}</h1>

</div>

<div class="card dashboard-card">

<h3>Attendance Rate</h3>

<h1>${rate}%</h1>

</div>

`;

}

// ======================================================
// EXPORT CSV
// ======================================================

function exportCSV(){

if(reportData.length===0){

alert("No attendance data found.");

return;

}

let csv =

"Student ID,Student Name,Subject,Date,Time,Status\n";

reportData.forEach(record=>{

csv += `"${record.studentID || ""}",`;

csv += `"${record.fullName || ""}",`;

csv += `"${record.subjectName || ""}",`;

csv += `"${record.date || ""}",`;

csv += `"${record.time || ""}",`;

csv += `"${record.status || "Present"}"\n`;

});

const blob =

new Blob(

[csv],

{

type:"text/csv;charset=utf-8;"

}

);

const url = URL.createObjectURL(blob);

const link =

document.createElement("a");

link.href = url;

link.download =

`Attendance_Report_${
new Date().toISOString().split("T")[0]
}.csv`;

document.body.appendChild(link);

link.click();

document.body.removeChild(link);

URL.revokeObjectURL(url);

}



// ================================
// REFRESH REPORTS
// ================================

export async function refreshReports(){

await generateReport();

}



// ================================
// CLEAR REPORT CACHE
// ================================

export function clearReports(){

reportData=[];

const summary =

document.getElementById(
"reportSummary"
);

const container =

document.getElementById(
"reportContainer"
);

if(summary){

summary.innerHTML="";

}

if(container){

container.innerHTML="";

}

}



// ================================
// INITIALIZER
// ================================

export async function initializeReports(){

await loadReports();

}



// ================================
// MODULE READY
// ================================

console.log(

"📄 Reports Module v8 Ready"

);
