// ======================================================
// ATTENDANCE CHECKER
// REPORTS MODULE
// VERSION 9.0 FINAL
// PART 1 OF 6
// ======================================================


// ================================
// IMPORTS
// ================================

import {

db

}

from "./firebase.js";

import {

collection,
getDocs,
query,
orderBy

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



// ================================
// REPORT DATA
// ================================

let reportData = [];



// ================================
// LOAD REPORTS
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

<h1 class="page-title">

Attendance Reports

</h1>

<div class="card">

<h2>

Attendance Summary

</h2>

<div
id="reportSummary">

Loading summary...

</div>

</div>



<div class="card">

<h2>

Filters

</h2>

<input

id="reportSearch"

class="input"

placeholder="Search Student"

>

<br><br>

<select

id="reportSubject"

class="input">

<option value="">

All Subjects

</option>

</select>

<br><br>

<input

type="date"

id="reportDate"

class="input">

<br><br>

<button

class="button"

id="generateReportBtn">

Generate Report

</button>

<button

class="button"

id="exportCSVBtn">

Export CSV

</button>

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

await loadSubjectFilter();

initializeReportEvents();

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

const subject =
doc.data();

const option =
document.createElement("option");

option.value =
subject.name || "";

option.textContent =
`${subject.code || ""} - ${subject.name || ""}`;

select.appendChild(option);

});

}

catch(error){

console.error(

"Load Subjects:",

error

);

}

}



// ================================
// INITIALIZE EVENTS
// ================================

function initializeReportEvents(){

const generateButton =

document.getElementById(
"generateReportBtn"
);

const exportButton =

document.getElementById(
"exportCSVBtn"
);

const searchBox =

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



if(generateButton){

generateButton.onclick =

()=>{

generateReport();

};

}



if(exportButton){

exportButton.onclick =

()=>{

exportCSV();

};

}



if(searchBox){

searchBox.addEventListener(

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

}

// ================================
// GENERATE REPORT
// ================================

async function generateReport(){

try{

const attendanceQuery = query(

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

await getDocs(attendanceQuery);

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

Unable to load attendance records

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
// GET FILTERED DATA
// ================================

function getFilteredReports(){

const keyword =

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

return reportData.filter(record=>{

const studentName =

(record.fullName || "")
.toLowerCase();

const studentID =

(record.studentID || "")
.toLowerCase();

const matchKeyword =

studentName.includes(keyword)

||

studentID.includes(keyword);

const matchSubject =

subject===""

||

record.subjectName===subject;

const matchDate =

date===""

||

record.date===date;

return(

matchKeyword &&

matchSubject &&

matchDate

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

<h2>

No Attendance Records

</h2>

<p>

No matching attendance records were found.

</p>

</div>

`;

return;

}

let html = `

<table class="report-table">

<thead>

<tr>

<th>

Student ID

</th>

<th>

Student Name

</th>

<th>

Subject

</th>

<th>

Date

</th>

<th>

Time

</th>

<th>

Status

</th>

</tr>

</thead>

<tbody>

`;

records.forEach(record=>{

html += `

<tr>

<td>

${record.studentID || "-"}

</td>

<td>

${record.fullName || "-"}

</td>

<td>

${record.subjectName || "-"}

</td>

<td>

${record.date || "-"}

</td>

<td>

${record.time || "-"}

</td>

<td>

<span class="status-badge">

${record.status || "Present"}

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

const total =

records.length;

const present =

records.filter(r=>

(r.status || "Present")
.toLowerCase()==="present"

).length;

const late =

records.filter(r=>

(r.status || "")
.toLowerCase()==="late"

).length;

const absent =

records.filter(r=>

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

<div class="dashboard-grid">

<div class="dashboard-card">

<h3>Total Records</h3>

<h1>${total}</h1>

</div>

<div class="dashboard-card">

<h3>Present</h3>

<h1>${present}</h1>

</div>

<div class="dashboard-card">

<h3>Late</h3>

<h1>${late}</h1>

</div>

<div class="dashboard-card">

<h3>Absent</h3>

<h1>${absent}</h1>

</div>

<div class="dashboard-card">

<h3>Attendance Rate</h3>

<h1>${rate}%</h1>

</div>

</div>

`;

}
// ================================
// EXPORT CSV
// ================================

function exportCSV(){

const records = getFilteredReports();

if(records.length===0){

alert(

"No attendance records to export."

);

return;

}

let csv =

"Student ID,Student Name,Subject,Date,Time,Status\n";

records.forEach(record=>{

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

const url =

URL.createObjectURL(blob);

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

alert(

"Attendance report exported successfully."

);

}



// ================================
// PRINT REPORT
// ================================

function printReport(){

window.print();

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

reportData = [];

const reportContainer =

document.getElementById(
"reportContainer"
);

const summaryContainer =

document.getElementById(
"reportSummary"
);

if(reportContainer){

reportContainer.innerHTML = "";

}

if(summaryContainer){

summaryContainer.innerHTML = "";

}

}
// ================================
// INITIALIZER
// ================================

export async function initializeReports(){

try{

await loadReports();

console.log(

"📄 Reports initialized successfully."

);

}

catch(error){

console.error(

"Reports Initialization:",

error

);

}

}



// ================================
// RELOAD REPORTS
// ================================

export async function reloadReports(){

try{

await generateReport();

}

catch(error){

console.error(

"Reload Reports:",

error

);

}

}



// ================================
// DESTROY REPORTS
// ================================

export function destroyReports(){

reportData = [];

const container =

document.getElementById(
"reportContainer"
);

const summary =

document.getElementById(
"reportSummary"
);

if(container){

container.innerHTML = "";

}

if(summary){

summary.innerHTML = "";

}

}



// ================================
// MODULE READY
// ================================

console.log(

"📄 Reports Module v9.0 Ready"

);
