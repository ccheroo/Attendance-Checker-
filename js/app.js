// ================================
// ATTENDANCE CHECKER
// MAIN APPLICATION
// VERSION 1.2
// ================================


import { loadDashboard } from "./dashboard.js";

import {

    addStudent,

    renderStudents,

    searchStudents

} from "./students.js";



const mainContent = document.getElementById("mainContent");

const menuButtons = document.querySelectorAll(".menu");



// ================================
// MENU
// ================================

menuButtons.forEach(button => {


    button.addEventListener("click",()=>{


        menuButtons.forEach(btn=>{

            btn.classList.remove("active");

        });


        button.classList.add("active");


        loadPage(button.dataset.page);



    });



});




// ================================
// PAGE LOADER
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

            placeholder("Courses");

            break;



        case "subjects":

            placeholder("Subjects");

            break;



        case "scanner":

            placeholder("Scanner");

            break;



        case "attendance":

            placeholder("Attendance");

            break;



        case "reports":

            placeholder("Reports");

            break;



        case "settings":

            placeholder("Settings");

            break;


    }


}



// ================================
// DASHBOARD
// ================================

function dashboard(){


    mainContent.innerHTML = loadDashboard();


}




// ================================
// STUDENTS PAGE
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

id="course"

placeholder="Course"

>




<input

id="yearLevel"

placeholder="Year Level"

>




<input

id="photo"

placeholder="Photo URL"

>




<button

class="button"

id="addStudentBtn"

>

Add Student

</button>



</div>





<div class="card"

style="margin-top:25px">


<input

id="searchStudent"

placeholder="Search Student"

>


</div>





<div

id="studentContainer"

class="grid"

style="margin-top:25px">


</div>



`;





// ADD BUTTON

document
.getElementById("addStudentBtn")
.addEventListener("click",()=>{


const student = {


fullName:

document.getElementById("fullName").value,


studentID:

document.getElementById("studentID").value,


course:

document.getElementById("course").value,


yearLevel:

document.getElementById("yearLevel").value,


photo:

document.getElementById("photo").value

||
"assets/students/default.png"



};



addStudent(student);




document.getElementById("fullName").value="";

document.getElementById("studentID").value="";

document.getElementById("course").value="";

document.getElementById("yearLevel").value="";

document.getElementById("photo").value="";



});





// SEARCH

document
.getElementById("searchStudent")
.addEventListener("input",(e)=>{


searchStudents(e.target.value);



});



renderStudents();



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

This module will be built next.

</p>



</div>


`;



}



// START

loadPage("dashboard");
