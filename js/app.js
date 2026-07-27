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



// ================================
// GLOBALS
// ================================

const mainContent =
document.getElementById(
"mainContent"
);

const menuButtons =
document.querySelectorAll(
".menu"
);

let selectedSubject = null;



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
