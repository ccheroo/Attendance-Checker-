// ================================
// ATTENDANCE CHECKER
// MAIN APPLICATION
// VERSION 2.0 FIREBASE CONNECTED
// ================================


import { loadDashboard } from "./dashboard.js";


import {

    addStudent,

    searchStudents,

    loadStudents

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

id="addStudentBtn">

Add Student

</button>



</div>






<div class="card"

style="margin-top:25px">


<input

id="searchStudent"

placeholder="Search Student..."

>


</div>







<div

id="studentContainer"

class="grid"

style="margin-top:25px">

</div>



`;






// ================================
// ADD STUDENT
// ================================

const addButton = document.getElementById("addStudentBtn");



addButton.addEventListener("click", async ()=>{


const fullName =
document.getElementById("fullName").value.trim();


const studentID =
document.getElementById("studentID").value.trim();


const course =
document.getElementById("course").value.trim();


const yearLevel =
document.getElementById("yearLevel").value.trim();


const photo =
document.getElementById("photo").value.trim();





if(

!fullName ||

!studentID ||

!course ||

!yearLevel

){


alert("Please complete all student information.");

return;


}






const student = {


fullName,

studentID,

course,

yearLevel,


photo:

photo || "assets/students/default.png"


};





await addStudent(student);





document.getElementById("fullName").value = "";

document.getElementById("studentID").value = "";

document.getElementById("course").value = "";

document.getElementById("yearLevel").value = "";

document.getElementById("photo").value = "";




alert("Student saved successfully!");



});








// ================================
// SEARCH
// ================================

const searchBox = document.getElementById("searchStudent");



searchBox.addEventListener("input",(event)=>{


searchStudents(event.target.value);



});






// LOAD FIREBASE STUDENTS

loadStudents();



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







// ================================
// START APP
// ================================

loadPage("dashboard");
