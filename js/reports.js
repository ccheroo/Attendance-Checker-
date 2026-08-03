// ======================================================
// ATTENDANCE CHECKER
// REPORTS MODULE
// VERSION 12.0 FINAL
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
orderBy

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



// ================================
// REPORT CACHE
// ================================

let reportData = [];



// ================================
// LOAD REPORTS PAGE
// ================================

export async function loadReports(){

const mainContent =

document.getElementById(
"mainContent"
);

if(!mainContent){

console.error(

"mainContent not found."

);

return;

}

mainContent.innerHTML = `

<div class="reports-page">

<div class="page-header">

<h1>

Attendance Reports

</h1>

<p>

Generate, print, and export attendance records.

</p>

</div>



<div class="card">

<div class="report-toolbar">

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

placeholder="Search Student">



<button

class="button"

id="generatePDFBtn">

Export PDF

</button>

</div>

</div>



<div

id="pdfReport"

class="pdf-report">

<div

id="reportSummary">

Loading summary...

</div>



<div

id="reportContainer">

Loading attendance records...

</div>

</div>

</div>

`;

await loadSubjectFilter();

initializeEvents();

await generateReport();

}

// ================================
// LOAD SUBJECT FILTER
// ================================

async function loadSubjectFilter(){

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

const subject = doc.data();

const option =

document.createElement(
"option"
);

option.value =

subject.name || "";

option.textContent =

subject.code

? `${subject.code} - ${subject.name}`

: subject.name;

select.appendChild(option);

});

}

catch(error){

console.error(

"Load Subject Filter:",

error

);

}

}



// ================================
// INITIALIZE EVENTS
// ================================

function initializeEvents(){

const pdfButton =

document.getElementById(
"generatePDFBtn"
);

const searchInput =

document.getElementById(
"reportSearch"
);

const subjectFilter =

document.getElementById(
"reportSubject"
);

const dateFilter =

document.getElementById(
"reportDate"
);



if(searchInput){

searchInput.addEventListener(

"input",

()=>{

displayReports();

updateSummary();

}

);

}



if(subjectFilter){

subjectFilter.addEventListener(

"change",

()=>{

displayReports();

updateSummary();

}

);

}



if(dateFilter){

dateFilter.addEventListener(

"change",

()=>{

displayReports();

updateSummary();

}

);

}



if(pdfButton){

pdfButton.addEventListener(

"click",

async()=>{

await exportPDF();

}

);

}

}

// ================================
// LOAD REPORT DATA
// ================================

async function generateReport(){

try{

const attendanceQuery =

query(

collection(
db,
"attendance"
),

orderBy(
"createdAt",
"desc"

)

);

const snapshot =

await getDocs(
attendanceQuery
);

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

<h3>

Unable to load attendance records

</h3>

<p>

${error.message}

</p>

</div>

`;

}

}

}



// ================================
// FILTER REPORTS
// ================================

function getFilteredReports(){

const keyword =

document

.getElementById(
"reportSearch"
)

.value

.trim()

.toLowerCase();

const subject =

document

.getElementById(
"reportSubject"
)

.value;

const date =

document

.getElementById(
"reportDate"
)

.value;

return reportData.filter(record=>{

const fullName =

(record.fullName || "")
.toLowerCase();

const studentID =

(record.studentID || "")
.toLowerCase();

const subjectName =

(record.subjectName || "");

const recordDate =

(record.date || "");

const matchesSearch =

fullName.includes(keyword)

||

studentID.includes(keyword);

const matchesSubject =

subject === ""

||

subjectName === subject;

const matchesDate =

date === ""

||

recordDate === date;

return (

matchesSearch &&

matchesSubject &&

matchesDate

);

});

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

const records =

getFilteredReports();

if(records.length===0){

container.innerHTML = `

<div class="card">

<h3>

No Attendance Records Found

</h3>

<p>

There are no attendance records matching your filters.

</p>

</div>

`;

return;

}

let html = `

<table class="report-table">

<thead>

<tr>

<th>No.</th>

<th>Student ID</th>

<th>Student Name</th>

<th>Subject</th>

<th>Date</th>

<th>Time</th>

<th>Status</th>

</tr>

</thead>

<tbody>

`;

records.forEach((record,index)=>{

const status =

record.status || "Present";

html += `

<tr>

<td>${index+1}</td>

<td>${record.studentID || "-"}</td>

<td>${record.fullName || "-"}</td>

<td>${record.subjectName || "-"}</td>

<td>${record.date || "-"}</td>

<td>${record.time || "-"}</td>

<td>

<span class="status ${status.toLowerCase()}">

${status}

</span>

</td>

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

const records =

getFilteredReports();

const total = records.length;

const present =

records.filter(record=>

(record.status || "Present")
.toLowerCase()==="present"

).length;

const late =

records.filter(record=>

(record.status || "")
.toLowerCase()==="late"

).length;

const absent =

records.filter(record=>

(record.status || "")
.toLowerCase()==="absent"

).length;

const attendanceRate =

total===0

?0

:Math.round(

(present/total)*100

);

summary.innerHTML = `

<div class="report-header">

<h1>

ATTENDANCE REPORT

</h1>

<p>

Generated on

${new Date().toLocaleString()}

</p>

</div>

<div class="summary-grid">

<div class="summary-card">

<h4>Total Records</h4>

<h2>${total}</h2>

</div>

<div class="summary-card">

<h4>Present</h4>

<h2>${present}</h2>

</div>

<div class="summary-card">

<h4>Late</h4>

<h2>${late}</h2>

</div>

<div class="summary-card">

<h4>Absent</h4>

<h2>${absent}</h2>

</div>

<div class="summary-card">

<h4>Attendance Rate</h4>

<h2>${attendanceRate}%</h2>

</div>

</div>

`;

}

async function exportPDF(){

const report = document.getElementById("pdfReport");

if(!report){

alert("Report not found.");

return;

}

// Hintayin munang matapos ang rendering
await new Promise(resolve=>requestAnimationFrame(resolve));
await new Promise(resolve=>setTimeout(resolve,300));

const options={

margin:10,

filename:`Attendance_Report_${
new Date().toISOString().split("T")[0]
}.pdf`,

image:{
type:"jpeg",
quality:1
},

html2canvas:{
scale:2,
useCORS:true,
logging:false,
backgroundColor:"#ffffff",
scrollX:0,
scrollY:0
},

jsPDF:{
unit:"mm",
format:"a4",
orientation:"landscape"
}

};

window.html2pdf()

.set(options)

.from(report)

.save();

}

// ================================
// REFRESH REPORTS
// ================================

export async function refreshReports(){

await generateReport();

}



// ================================
// INITIALIZE REPORTS
// ================================

export async function initializeReports(){

await loadReports();

}



// ================================
// CLEAR REPORT CACHE
// ================================

export function clearReports(){

reportData = [];

const summary =

document.getElementById(
"reportSummary"
);

const container =

document.getElementById(
"reportContainer"
);

if(summary){

summary.innerHTML = "";

}

if(container){

container.innerHTML = "";

}

}



// ================================
// MODULE READY
// ================================

console.log(

"📄 Reports Module v12.0 Final Loaded"

);
