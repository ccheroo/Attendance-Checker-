// ==========================================================
// ATTENDANCE CHECKER
// VERSION 1.0
// MAIN APPLICATION
// ==========================================================

// ----------------------------
// MENU
// ----------------------------

const menuButtons = document.querySelectorAll(".menu");
const mainContent = document.getElementById("mainContent");

// ----------------------------
// PAGES
// ----------------------------

const pages = {

dashboard: dashboardPage,

students: studentsPage,

courses: coursesPage,

subjects: subjectsPage,

scanner: scannerPage,

attendance: attendancePage,

reports: reportsPage,

settings: settingsPage

};

// ----------------------------
// MENU EVENTS
// ----------------------------

menuButtons.forEach(button=>{

button.addEventListener("click",()=>{

menuButtons.forEach(btn=>btn.classList.remove("active"));

button.classList.add("active");

const page=button.dataset.page;

loadPage(page);

});

});

// ----------------------------
// LOAD PAGE
// ----------------------------

function loadPage(page){

mainContent.innerHTML=pages[page]();

}

// ==========================================================
// DASHBOARD
// ==========================================================

function dashboardPage(){

return`

<h1 class="page-title">

Dashboard

</h1>

<div class="grid">

<div class="card">

<h2>Total Students</h2>

<h1 id="studentCount">0</h1>

</div>

<div class="card">

<h2>Present Today</h2>

<h1 id="presentToday">0</h1>

</div>

<div class="card">

<h2>Subjects</h2>

<h1 id="subjectCount">0</h1>

</div>

<div class="card">

<h2>Attendance Rate</h2>

<h1 id="attendanceRate">0%</h1>

</div>

</div>

`;

}

// ==========================================================
// STUDENTS
// ==========================================================

function studentsPage(){

return`

<h1 class="page-title">

Students

</h1>

<div class="card">

<h2>

Student Management

</h2>

<p>

Register, edit and manage all students.

</p>

</div>

`;

}

// ==========================================================
// COURSES
// ==========================================================

function coursesPage(){

return`

<h1 class="page-title">

Courses

</h1>

<div class="card">

<h2>

Course Management

</h2>

<p>

Add and organize student courses.

</p>

</div>

`;

}

// ==========================================================
// SUBJECTS
// ==========================================================

function subjectsPage(){

return`

<h1 class="page-title">

Subjects

</h1>

<div class="card">

<h2>

Subject Management

</h2>

<p>

Create and manage your class subjects.

</p>

</div>

`;

}

// ==========================================================
// SCANNER
// ==========================================================

function scannerPage(){

return`

<h1 class="page-title">

QR Scanner

</h1>

<div class="grid">

<div class="card">

<h2>

Camera Scanner

</h2>

<div id="reader"

style="height:420px;border-radius:18px;background:white;">

</div>

</div>

<div class="card">

<h2>

Last Scanned Student

</h2>

<img

src="assets/students/default.png"

style="width:170px;height:170px;border-radius:50%;object-fit:cover;display:block;margin:auto;">

<h3 style="text-align:center;margin-top:20px;">

Waiting for Scan...

</h3>

<p style="text-align:center;">

Student information will appear here.

</p>

</div>

</div>

`;

}

// ==========================================================
// ATTENDANCE
// ==========================================================

function attendancePage(){

return`

<h1 class="page-title">

Attendance

</h1>

<div class="card table-card">

<table>

<thead>

<tr>

<th>Name</th>

<th>Student ID</th>

<th>Course</th>

<th>Subject</th>

<th>Time</th>

<th>Status</th>

</tr>

</thead>

<tbody>

</tbody>

</table>

</div>

`;

}

// ==========================================================
// REPORTS
// ==========================================================

function reportsPage(){

return`

<h1 class="page-title">

Reports

</h1>

<div class="grid">

<div class="card">

<h2>

PDF Report

</h2>

<button class="button">

Download

</button>

</div>

<div class="card">

<h2>

Excel Report

</h2>

<button class="button">

Download

</button>

</div>

<div class="card">

<h2>

CSV Report

</h2>

<button class="button">

Download

</button>

</div>

</div>

`;

}

// ==========================================================
// SETTINGS
// ==========================================================

function settingsPage(){

return`

<h1 class="page-title">

Settings

</h1>

<div class="card">

<h2>

Scanner Sound

</h2>

<label>

<input type="checkbox" checked>

Enable Scanner Sound

</label>

</div>

`;

}

// ----------------------------
// START APP
// ----------------------------

loadPage("dashboard");
