// ======================================================
// ATTENDANCE CHECKER
// REPORTS MODULE
// VERSION 9.0 FINAL
// PART 1 OF 6
// ======================================================

// ================================
// PDF IMPORTS
// ================================

import {

jsPDF

}

from

"https://cdn.jsdelivr.net/npm/jspdf@2.5.1/+esm";

import

"https://cdn.jsdelivr.net/npm/jspdf-autotable@3.8.2/+esm";

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

📄 Generate PDF Report

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

generateButton.onclick = ()=>{

generatePDFReport();

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
// GENERATE PDF REPORT
// ================================

function generatePDFReport(){

const records =

getFilteredReports();

if(records.length===0){

alert(

"No attendance records found."

);

return;

}

const doc =

new jsPDF({

orientation:"landscape",

unit:"mm",

format:"a4"

});



// ==================================
// HEADER
// ==================================

doc.setFont(

"helvetica",

"bold"

);

doc.setFontSize(18);

doc.text(

"ATTENDANCE REPORT",

148,

18,

{

align:"center"

}

);

doc.setFontSize(10);

doc.setFont(

"helvetica",

"normal"

);

doc.text(

`Date Generated: ${new Date().toLocaleString()}`,

14,

28

);



// ==================================
// FILTERS
// ==================================

const subject =

document.getElementById(

"reportSubject"

)?.value || "All Subjects";

const date =

document.getElementById(

"reportDate"

)?.value || "All Dates";

doc.text(

`Subject: ${subject}`,

14,

35

);

doc.text(

`Date Filter: ${date}`,

110,

35

);

// ==================================
// SUMMARY
// ==================================

const totalRecords = records.length;

const totalPresent =

records.filter(record=>

(record.status || "Present")
.toLowerCase() === "present"

).length;

const totalLate =

records.filter(record=>

(record.status || "")
.toLowerCase() === "late"

).length;

const totalAbsent =

records.filter(record=>

(record.status || "")
.toLowerCase() === "absent"

).length;

const attendanceRate =

totalRecords === 0

? 0

: Math.round(

(totalPresent / totalRecords) * 100

);

doc.setFont(

"helvetica",

"bold"

);

doc.setFontSize(12);

doc.text(

"ATTENDANCE SUMMARY",

14,

48

);

doc.setFont(

"helvetica",

"normal"

);

doc.setFontSize(10);

doc.text(

`Total Records : ${totalRecords}`,

18,

56

);

doc.text(

`Present : ${totalPresent}`,

18,

63

);

doc.text(

`Late : ${totalLate}`,

18,

70

);

doc.text(

`Absent : ${totalAbsent}`,

18,

77

);

doc.text(

`Attendance Rate : ${attendanceRate}%`,

18,

84

);

// Divider line

doc.setDrawColor(180);

doc.line(

14,

90,

283,

90

);

// ==================================
// ATTENDANCE TABLE
// ==================================

const tableData = records.map(record => [

    record.studentID || "-",

    record.fullName || "-",

    record.subjectName || "-",

    record.date || "-",

    record.time || "-",

    record.status || "Present"

]);

doc.autoTable({

    startY: 96,

    head: [[

        "Student ID",

        "Student Name",

        "Subject",

        "Date",

        "Time",

        "Status"

    ]],

    body: tableData,

    theme: "grid",

    styles: {

        font: "helvetica",

        fontSize: 9,

        cellPadding: 2,

        valign: "middle",

        halign: "center",

        lineWidth: 0.2

    },

    headStyles: {

        fillColor: [41, 128, 185],

        textColor: [255,255,255],

        fontStyle: "bold",

        halign: "center"

    },

    alternateRowStyles: {

        fillColor: [245,245,245]

    },

    columnStyles: {

        0: {

            cellWidth: 30

        },

        1: {

            cellWidth: 70,

            halign: "left"

        },

        2: {

            cellWidth: 55,

            halign: "left"

        },

        3: {

            cellWidth: 35

        },

        4: {

            cellWidth: 30

        },

        5: {

            cellWidth: 35

        }

    },

    margin: {

        left: 14,

        right: 14

    }

});

// ==================================
// FOOTER
// ==================================

const pageCount =

doc.getNumberOfPages();

for(

let page = 1;

page <= pageCount;

page++

){

doc.setPage(page);

doc.setFont(

"helvetica",

"normal"

);

doc.setFontSize(9);

// Left Footer

doc.text(

"Generated by Attendance Checker System",

14,

200

);

// Right Footer

doc.text(

`Page ${page} of ${pageCount}`,

283,

200,

{

align:"right"

}

);

// Bottom Divider

doc.setDrawColor(180);

doc.line(

14,

194,

283,

194

);

}



// ==================================
// FILE NAME
// ==================================

const today =

new Date()

.toISOString()

.split("T")[0];

const filename =

`Attendance_Report_${today}.pdf`;



// ==================================
// DOWNLOAD PDF
// ==================================

doc.save(filename);

// ==================================
// FORMAT DATE
// ==================================

function formatReportDate(dateValue){

if(!dateValue) return "-";

try{

return new Date(dateValue)

.toLocaleDateString(

"en-US",

{

year:"numeric",

month:"long",

day:"numeric"

}

);

}

catch{

return dateValue;

}

}



// ==================================
// FORMAT TIME
// ==================================

function formatReportTime(timeValue){

if(!timeValue) return "-";

return timeValue;

}



// ==================================
// FORMAT STATUS
// ==================================

function formatStatus(status){

if(!status) return "Present";

return status.charAt(0).toUpperCase()

+

status.slice(1).toLowerCase();

}



// ==================================
// PDF MODULE READY
// ==================================

console.log(

"📄 PDF Report Generator Ready"

);


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
