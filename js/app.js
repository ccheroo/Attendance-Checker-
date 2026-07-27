// ======================================================
// ATTENDANCE CHECKER
// MAIN APPLICATION
// VERSION 6.0
// PART 1
// ======================================================
// ================================
// IMPORTS
// ================================

import {
    loadDashboard
} from "./dashboard.js";

import {
    addStudent,
    searchStudents,
    loadStudents
} from "./students.js";

import {
    addCourse,
    loadCourses,
    searchCourses
} from "./courses.js";

import {
    addSubject,
    loadSubjects,
    getSubjects
} from "./subjects.js";

import {
    openScanner
} from "./scanner.js";

import {
    loadAttendance
} from "./attendance.js";

import { db } from "./firebase.js";

import {

    collection,
    getDocs

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ================================
// MENU
// ================================

menuButtons.forEach(button=>{

button.addEventListener("click",()=>{

menuButtons.forEach(btn=>{

btn.classList.remove(
"active"
);

});

button.classList.add(
"active"
);

loadPage(
button.dataset.page
);

});

});



// ================================
// ROUTER
// ================================

function loadPage(page){

switch(page){

case "dashboard":

dashboard();

break;

case "students":

students();

break;

case "courses":

courses();

break;

case "subjects":

subjects();

break;

case "scanner":

scannerPage();

break;

case "attendance":

attendance();

break;

case "reports":

placeholder(
"Reports"
);

break;

case "settings":

placeholder(
"Settings"
);

break;

default:

dashboard();

}

}



// ================================
// DASHBOARD
// ================================

function dashboard(){

mainContent.innerHTML =
loadDashboard();

}
// ================================
// STUDENTS MODULE
// ================================

function students(){

mainContent.innerHTML = `

<h1 class="page-title">

Students

</h1>

<div class="card">

<h2>

Register Student

</h2>

<input
id="fullName"
placeholder="Full Name"
>

<input
id="studentID"
placeholder="Student ID"
>

<input
id="college"
placeholder="College"
>

<input
id="course"
placeholder="Course"
>

<input
id="yearLevel"
placeholder="Year Level"
>

<input
id="section"
placeholder="Section"
>

<button

class="button"

id="addStudentBtn">

Save Student

</button>

</div>

<div class="card">

<input

id="searchStudent"

placeholder="Search Student..."

>

</div>

<div

id="studentContainer"

class="student-grid">

</div>

`;

const button =

document.getElementById(
"addStudentBtn"
);

button.onclick = async()=>{

const student={

fullName:
document.getElementById("fullName").value.trim(),

studentID:
document.getElementById("studentID").value.trim(),

college:
document.getElementById("college").value.trim(),

course:
document.getElementById("course").value.trim(),

yearLevel:
document.getElementById("yearLevel").value.trim(),

section:
document.getElementById("section").value.trim(),

qrCode:
document.getElementById("studentID").value.trim()

};

if(

!student.fullName ||

!student.studentID ||

!student.college ||

!student.course ||

!student.yearLevel ||

!student.section

){

alert(
"Please complete all fields."
);

return;

}

button.disabled=true;

button.innerText="Saving...";

const saved =
await addStudent(student);

if(saved){

document.getElementById("fullName").value="";
document.getElementById("studentID").value="";
document.getElementById("college").value="";
document.getElementById("course").value="";
document.getElementById("yearLevel").value="";
document.getElementById("section").value="";

alert(
"Student saved successfully!"
);

}

button.disabled=false;

button.innerText="Save Student";

};

const search =

document.getElementById(
"searchStudent"
);

search.addEventListener(

"input",

e=>{

searchStudents(
e.target.value
);

}

);

loadStudents();

}
// ================================
// COURSES MODULE
// ================================

function courses(){

mainContent.innerHTML = `

<h1 class="page-title">

Courses

</h1>

<div class="card">

<h2>

Add Course

</h2>

<input
id="collegeName"
placeholder="College Name"
>

<input
id="courseName"
placeholder="Course Name"
>

<input
id="courseCode"
placeholder="Course Code"
>

<button

class="button"

id="addCourseBtn">

Save Course

</button>

</div>

<div class="card">

<input

id="searchCourse"

placeholder="Search Course..."

>

</div>

<div

id="courseContainer"

class="student-grid">

</div>

`;

const button =
document.getElementById(
"addCourseBtn"
);

button.onclick = async()=>{

const course={

college:
document
.getElementById("collegeName")
.value
.trim(),

course:
document
.getElementById("courseName")
.value
.trim(),

code:
document
.getElementById("courseCode")
.value
.trim()

};

if(

!course.college ||

!course.course ||

!course.code

){

alert(
"Please complete all fields."
);

return;

}

button.disabled=true;

button.innerText="Saving...";

const saved=
await addCourse(course);

if(saved){

document
.getElementById("collegeName")
.value="";

document
.getElementById("courseName")
.value="";

document
.getElementById("courseCode")
.value="";

alert(
"Course saved successfully!"
);

}

button.disabled=false;

button.innerText="Save Course";

};

const searchBox=
document.getElementById(
"searchCourse"
);

searchBox.addEventListener(

"input",

e=>{

searchCourses(
e.target.value
);

}

);

loadCourses();

}
// ================================
// SUBJECTS MODULE
// ================================

function subjects(){

mainContent.innerHTML = `

<h1 class="page-title">

Subjects

</h1>

<div class="card">

<h2>

Add Subject

</h2>

<input
id="subjectName"
placeholder="Subject Name"
>

<input
id="subjectCode"
placeholder="Subject Code"
>

<input
id="subjectInstructor"
placeholder="Instructor Name"
>

<button
class="button"
id="addSubjectBtn">

Save Subject

</button>

</div>

<div class="card">

<input
id="searchSubject"
placeholder="Search Subject..."
>

</div>

<div
id="subjectContainer"
class="student-grid">

</div>

`;

const button =
document.getElementById(
"addSubjectBtn"
);

button.onclick = async()=>{

const subject={

name:
document
.getElementById("subjectName")
.value
.trim(),

code:
document
.getElementById("subjectCode")
.value
.trim(),

instructor:
document
.getElementById("subjectInstructor")
.value
.trim()

};

if(

!subject.name ||

!subject.code

){

alert(
"Please complete all fields."
);

return;

}

button.disabled=true;

button.innerText="Saving...";

const saved =
await addSubject(subject);

if(saved){

document
.getElementById("subjectName")
.value="";

document
.getElementById("subjectCode")
.value="";

document
.getElementById("subjectInstructor")
.value="";

alert(
"Subject saved successfully!"
);

}

button.disabled=false;

button.innerText="Save Subject";

};

loadSubjects();

}
// ================================
// QR SCANNER MODULE
// SUBJECT ATTENDANCE
// ================================

async function scannerPage(){

await loadSubjects();

mainContent.innerHTML = `

<h1 class="page-title">

QR Attendance

</h1>

<div class="card">

<h2>

Start Attendance

</h2>

<p>

Select the subject before scanning.

</p>

<select
id="attendanceSubject"
class="input">

<option value="">

Select Subject

</option>

</select>

<br><br>

<button

class="button"

id="startAttendanceBtn">

Start Attendance

</button>

</div>

<div class="card">

<h2>

Scanner

</h2>

<div

id="reader"

style="display:none;
width:100%;
max-width:500px;
margin:auto;">

</div>

<div

id="scanResult"

style="margin-top:20px;">

Waiting...

</div>

</div>

`;



// ================================
// LOAD SUBJECTS
// ================================

const subjectSelect =
document.getElementById("attendanceSubject");

const subjectList =
getSubjects();

subjectList.forEach(subject=>{

    const option =
    document.createElement("option");

    option.value =
    subject.id;

    option.textContent =
    subject.name;

    option.dataset.code =
    subject.code;

    option.dataset.instructor =
    subject.instructor || "";

    subjectSelect.appendChild(option);

});



// ================================
// START ATTENDANCE
// ================================

document
.getElementById("startAttendanceBtn")
.onclick = ()=>{

    if(!subjectSelect.value){

        alert(
        "Please select a subject first."
        );

        return;

    }

    const selectedOption =
    subjectSelect.options[
        subjectSelect.selectedIndex
    ];

    const selectedSubject = {

        id:
        subjectSelect.value,

        name:
        selectedOption.textContent,

        code:
        selectedOption.dataset.code,

        instructor:
        selectedOption.dataset.instructor

    };

    document
    .getElementById("reader")
    .style.display="block";

    openScanner(
        selectedSubject
    );

};
    
// ================================
// ATTENDANCE MODULE
// ================================

function attendance(){

mainContent.innerHTML = `

<h1 class="page-title">

Attendance

</h1>

<div class="card">

<h2>

Attendance Records

</h2>

<p>

Attendance history will appear here.

</p>

<div

id="attendanceContainer"

class="student-grid">

</div>

</div>

`;

loadAttendance();

}



// ================================
// PLACEHOLDER
// ================================

function placeholder(title){

mainContent.innerHTML = `

<h1 class="page-title">

${title}

</h1>

<div class="card">

<h2>

${title}

</h2>

<p>

This module is under development.

</p>

</div>

`;

}



// ================================
// CURRENT SUBJECT
// ================================

export function getSelectedSubject(){

return selectedSubject;

}



// ================================
// RESET SUBJECT
// ================================

export function clearSelectedSubject(){

selectedSubject = null;

}



// ================================
// APPLICATION START
// ================================

console.clear();

console.log(

"🚀 ATTENDANCE CHECKER v6.0 READY"

);

loadPage("dashboard");
