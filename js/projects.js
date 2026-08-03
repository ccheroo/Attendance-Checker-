// ======================================================
// ATTENDANCE CHECKER
// REPORTS MODULE
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
orderBy

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



// ================================
// REPORT DATA
// ================================

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

Generate Attendance Report

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
style="display:flex;
gap:10px;
flex-wrap:wrap;">

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

Export Excel

</button>

</div>

</div>



<div class="card">

<h2>

Attendance Summary

</h2>

<div
id="reportSummary">

Loading...

</div>

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

await loadSubjectsToFilter();

initializeReportEvents();

}
// ================================
// LOAD SUBJECTS TO FILTER
// ================================

async function loadSubjectsToFilter(){

const select =

document.getElementById(
"reportSubject"
);

if(!select) return;

try{

const snapshot =

await getDocs(
collection(db,"subjects")
);

snapshot.forEach(doc=>{

const subject =
doc.data();

const option =
document.createElement("option");

option.value =
subject.name;

option.textContent =
subject.name;

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

const printButton =

document.getElementById(
"printReportBtn"
);

const excelButton =

document.getElementById(
"excelReportBtn"
);

const searchBox =

document.getElementById(
"reportSearch"
);

if(generateButton){

generateButton.onclick = ()=>{

generateReport();

};

}

if(printButton){

printButton.onclick = ()=>{

window.print();

};

}

if(excelButton){

excelButton.onclick = ()=>{

exportExcel();

};

}

if(searchBox){

searchBox.addEventListener(

"input",

()=>{

displayReports();

}

);

}

}



// ================================
// GENERATE REPORT
// ================================

async function generateReport(){

try{

const attendanceQuery =

query(

collection(db,"attendance"),

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

let filtered =

reportData.filter(record=>{

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

matchSearch

&&

matchSubject

&&

matchDate

);

});

if(filtered.length===0){

container.innerHTML=`

<div class="card">

<h3>

No Attendance Records

</h3>

<p>

No matching attendance records found.

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

filtered.forEach(record=>{

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

${record.status || "Present"}

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

const container =

document.getElementById(
"reportSummary"
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

const filtered =

reportData.filter(record=>{

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

matchSearch

&&

matchSubject

&&

matchDate

);

});

const totalRecords =
filtered.length;

const totalPresent =
filtered.filter(record=>

(record.status || "Present")
.toLowerCase() === "present"

).length;

const totalLate =
filtered.filter(record=>

(record.status || "")
.toLowerCase() === "late"

).length;

const totalAbsent =
filtered.filter(record=>

(record.status || "")
.toLowerCase() === "absent"

).length;

const attendanceRate =

totalRecords === 0

? 0

: Math.round(

(totalPresent / totalRecords) * 100

);

container.innerHTML = `

<div class="dashboard-grid">

<div class="card dashboard-card">

<h3>Total Records</h3>

<h1>${totalRecords}</h1>

</div>

<div class="card dashboard-card">

<h3>Present</h3>

<h1>${totalPresent}</h1>

</div>

<div class="card dashboard-card">

<h3>Late</h3>

<h1>${totalLate}</h1>

</div>

<div class="card dashboard-card">

<h3>Absent</h3>

<h1>${totalAbsent}</h1>

</div>

<div class="card dashboard-card">

<h3>Attendance Rate</h3>

<h1>${attendanceRate}%</h1>

</div>

</div>

`;

}
// ================================
// EXPORT REPORT (CSV)
// ================================

function exportExcel(){

if(reportData.length===0){

alert(
"No report data available."
);

return;

}

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

const filtered =

reportData.filter(record=>{

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

matchSearch

&&

matchSubject

&&

matchDate

);

});

let csv =

"Student ID,Student Name,Subject,Date,Time,Status\n";

filtered.forEach(record=>{

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

const today =
new Date()
.toISOString()
.split("T")[0];

link.href = url;

link.download =

`Attendance_Report_${today}.csv`;

document.body.appendChild(link);

link.click();

document.body.removeChild(link);

URL.revokeObjectURL(url);

alert(
"Report exported successfully!"
);

}



// ================================
// PRINT REPORT
// ================================

function printReport(){

window.print();

}

// ======================================================
// FINAL INITIALIZATION
// ======================================================

// Auto-update summary kapag nagbago ang filters

document.addEventListener(

"change",

(event)=>{

if(

event.target.id==="reportSubject"

||

event.target.id==="reportDate"

){

displayReports();

updateSummary();

}

}

);



// ================================
// AUTO LOAD REPORTS
// ================================

export async function initializeReports(){

try{

await loadReports();

await generateReport();

}

catch(error){

console.error(

"Reports Initialization:",

error

);

}

}



// ================================
// REFRESH REPORTS
// ================================

export async function refreshReports(){

try{

await generateReport();

}

catch(error){

console.error(

"Refresh Reports:",

error

);

}

}



// ================================
// CLEAR REPORT CACHE
// ================================

export function clearReports(){

reportData = [];

const container =

document.getElementById(
"reportContainer"
);

if(container){

container.innerHTML = "";

}

const summary =

document.getElementById(
"reportSummary"
);

if(summary){

summary.innerHTML = "";

}

}



// ================================
// MODULE READY
// ================================

console.clear();

console.log(

"📄 Reports Module v7.0 Ready"

);
