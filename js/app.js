// ======================================================
// ATTENDANCE CHECKER
// MAIN APPLICATION
// VERSION 7.0 FINAL
// PART 1
// ======================================================


// ================================
// IMPORTS
// ================================

import {
    loadDashboard,
    initDashboard
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

import {
    loadReports
} from "./reports.js";

import {
    loadSettings
}from "./settings.js";

import { db } from "./firebase.js";

import {

    collection,
    getDocs

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



// ================================
// GLOBAL VARIABLES
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
// MENU SYSTEM
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
    reports();
    break;

case "settings":
    settings();
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

    initDashboard();

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

alert("Please complete all fields.");

return;

}

button.disabled = true;
button.innerText = "Saving...";

const saved =
await addStudent(student);

if(saved){

document.getElementById("fullName").value="";
document.getElementById("studentID").value="";
document.getElementById("college").value="";
document.getElementById("course").value="";
document.getElementById("yearLevel").value="";
document.getElementById("section").value="";

alert("Student saved successfully!");

}

button.disabled = false;
button.innerText = "Save Student";

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

button.disabled = true;

button.innerText = "Saving...";

const saved =
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

button.disabled = false;

button.innerText = "Save Course";

};

const searchBox =
document.getElementById(
"searchCourse"
);

if(searchBox){

searchBox.addEventListener(
"input",
e=>{

searchCourses(
e.target.value
);

}
);

}

loadCourses();

}
// ================================
// SUBJECTS MODULE
// VERSION 7.0
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

button.disabled = true;

button.innerText = "Saving...";

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

button.disabled = false;

button.innerText = "Save Subject";

};

const search =
document.getElementById(
"searchSubject"
);

if(search){

search.addEventListener(
"input",
e=>{

const keyword =
e.target.value
.toLowerCase();

const filtered =
getSubjects().filter(subject=>{

return (

(subject.name || "")
.toLowerCase()
.includes(keyword)

||

(subject.code || "")
.toLowerCase()
.includes(keyword)

||

(subject.instructor || "")
.toLowerCase()
.includes(keyword)

);

});

const container =
document.getElementById(
"subjectContainer"
);

if(container){

container.innerHTML="";

filtered.forEach(subject=>{

container.innerHTML += `

<div class="student-card">

<div class="student-avatar">

${subject.code.charAt(0)}

</div>

<div class="student-info">

<h2>

${subject.name}

</h2>

<p>

<strong>Code:</strong>

${subject.code}

</p>

<p>

<strong>Instructor:</strong>

${subject.instructor || "Not Assigned"}

</p>

</div>

</div>

`;

});

}

});

}

loadSubjects();

}
// ================================
// QR SCANNER MODULE
// VERSION 7.0
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

style="
display:none;
width:100%;
max-width:500px;
margin:auto;
">

</div>

<div

id="scanResult"

style="margin-top:20px;">

Waiting for subject selection...

</div>

</div>

`;


// ================================
// LOAD SUBJECT DROPDOWN
// ================================

const subjectSelect =
document.getElementById(
"attendanceSubject"
);

const subjectList =
getSubjects();

subjectList.forEach(subject=>{

const option =
document.createElement("option");

option.value =
subject.id;

option.textContent =
`${subject.code} - ${subject.name}`;

option.dataset.name =
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

const option =
subjectSelect.options[
subjectSelect.selectedIndex
];

selectedSubject = {

id:
subjectSelect.value,

name:
option.dataset.name,

code:
option.dataset.code,

instructor:
option.dataset.instructor

};

document
.getElementById("reader")
.style.display="block";

document
.getElementById("scanResult")
.innerHTML = `

<div class="card">

<h2>

${selectedSubject.code}

</h2>

<p>

${selectedSubject.name}

</p>

<p>

Instructor:
${selectedSubject.instructor}

</p>

<p>

Ready to scan student QR codes.

</p>

</div>

`;

openScanner(
selectedSubject
);

};

}
// ================================
// ATTENDANCE MODULE
// ================================

function attendance(){

mainContent.innerHTML = `

<h1 class="page-title">

Attendance Records

</h1>

<div class="card">

<h2>

Today's Attendance

</h2>

<div
id="attendanceContainer"
class="student-grid">

Loading attendance...

</div>

</div>

`;

loadAttendance();

}



// ================================
// PLACEHOLDER MODULES
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

"🚀 ATTENDANCE CHECKER VERSION 7.0 READY"

);

loadPage("dashboard");
