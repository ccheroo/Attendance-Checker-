// ======================================================
// ATTENDANCE CHECKER
// REPORTS MODULE
// VERSION 10.0 FINAL
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

import {

jsPDF

}

from

"https://cdn.jsdelivr.net/npm/jspdf@2.5.1/+esm";

import

"https://cdn.jsdelivr.net/npm/jspdf-autotable@3.8.2/+esm";



// ================================
// MODULE DATA
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

📄 Generate PDF Report

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

const subject = doc.data();

const option =

document.createElement(
"option"
);

option.value =
subject.name || "";

option.textContent =

subject.name || "Unknown Subject";

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

function initializeReportEvents(){

const generateButton =

document.getElementById(
"generateReportBtn"
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



if(generateButton){

generateButton.addEventListener(

"click",

()=>{

generatePDFReport();

}

);

}



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
}

// ================================
// LOAD ATTENDANCE DATA
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

container.innerHTML =

`

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
// FILTER REPORTS
// ================================

function getFilteredReports(){

const keyword =

document

.getElementById(
"reportSearch"
)

.value

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

subject === ""

||

record.subjectName === subject;

const matchDate =

date === ""

||

record.date === date;

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

<h3>

No Attendance Records Found

</h3>

<p>

Try changing your filters.

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

records.filter(record=>

(record.status || "Present")
.toLowerCase() === "present"

).length;

const late =

records.filter(record=>

(record.status || "")
.toLowerCase() === "late"

).length;

const absent =

records.filter(record=>

(record.status || "")
.toLowerCase() === "absent"

).length;

const rate =

total === 0

? 0

: Math.round(

(present / total) * 100

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
// GENERATE PDF REPORT
// ================================

function generatePDFReport(){

const records =

getFilteredReports();

if(records.length===0){

alert(

"No attendance records available."

);

return;

}

const doc =

new jsPDF({

orientation:"landscape",

unit:"mm",

format:"a4"

});



// ================================
// HEADER
// ================================

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

doc.setFont(

"helvetica",

"normal"

);

doc.setFontSize(10);

doc.text(

`Generated: ${new Date().toLocaleString()}`,

14,

28

);

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

100,

35

);



// ================================
// SUMMARY
// ================================

const total = records.length;

const present =

records.filter(r=>

(r.status||"Present")
.toLowerCase()==="present"

).length;

const late =

records.filter(r=>

(r.status||"")
.toLowerCase()==="late"

).length;

const absent =

records.filter(r=>

(r.status||"")
.toLowerCase()==="absent"

).length;

const rate =

total===0

?0

:Math.round(

(present/total)*100

);

doc.setFont(

"helvetica",

"bold"

);

doc.setFontSize(12);

doc.text(

"SUMMARY",

14,

48

);

doc.setFont(

"helvetica",

"normal"

);

doc.setFontSize(10);

doc.text(

`Total Records : ${total}`,

18,

56

);

doc.text(

`Present : ${present}`,

18,

63

);

doc.text(

`Late : ${late}`,

18,

70

);

doc.text(

`Absent : ${absent}`,

18,

77

);

doc.text(

`Attendance Rate : ${rate}%`,

18,

84

);

doc.line(

14,

90,

283,

90

);



// ================================
// TABLE
// ================================

const rows =

records.map(record=>[

record.studentID || "-",

record.fullName || "-",

record.subjectName || "-",

record.date || "-",

record.time || "-",

record.status || "Present"

]);

doc.autoTable({

startY:96,

head:[[

"Student ID",

"Student Name",

"Subject",

"Date",

"Time",

"Status"

]],

body:rows,

theme:"grid",

styles:{

fontSize:9,

cellPadding:2,

halign:"center"

},

headStyles:{

fillColor:[52,73,94],

textColor:[255,255,255],

fontStyle:"bold"

},

alternateRowStyles:{

fillColor:[245,245,245]

},

columnStyles:{

1:{halign:"left"},

2:{halign:"left"}

}

});
// ================================
// FOOTER
// ================================

const pageCount = doc.getNumberOfPages();

for(let page = 1; page <= pageCount; page++){

    doc.setPage(page);

    doc.setDrawColor(180);

    doc.line(14,194,283,194);

    doc.setFontSize(9);

    doc.setFont("helvetica","normal");

    doc.text(

        "Attendance Checker System",

        14,

        200

    );

    doc.text(

        `Page ${page} of ${pageCount}`,

        283,

        200,

        {

            align:"right"

        }

    );

}



// ================================
// SAVE PDF
// ================================

const today =

new Date()

.toISOString()

.split("T")[0];

doc.save(

`Attendance_Report_${today}.pdf`

);

}



// ================================
// REFRESH REPORTS
// ================================

export async function refreshReports(){

await generateReport();

}



// ================================
// RELOAD REPORTS
// ================================

export async function reloadReports(){

await generateReport();

}



// ================================
// CLEAR REPORTS
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

reportContainer.innerHTML="";

}

if(summaryContainer){

summaryContainer.innerHTML="";

}

}



// ================================
// MODULE READY
// ================================

console.log(

"📄 Reports Module v10.0 Loaded"

);
