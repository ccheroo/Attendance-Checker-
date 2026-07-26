// ================================
// ATTENDANCE CHECKER
// MAIN APPLICATION
// VERSION 2.2 FIRESTORE STABLE
// ================================


import { loadDashboard } from "./dashboard.js";


import {

    addStudent,

    searchStudents,

    loadStudents

} from "./students.js";



const mainContent = document.getElementById("mainContent");

const menuButtons = document.querySelectorAll(".menu");





menuButtons.forEach(button => {


    button.addEventListener("click",()=>{


        menuButtons.forEach(btn => {

            btn.classList.remove("active");

        });


        button.classList.add("active");


        loadPage(button.dataset.page);


    });


});





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





function dashboard(){


    mainContent.innerHTML = loadDashboard();


}






function students(){


mainContent.innerHTML = `


<h1 class="page-title">
Students
</h1>



<div class="card">


<h2>
Register Student
</h2>



<input id="fullName" placeholder="Full Name">


<input id="studentID" placeholder="Student ID">


<input id="course" placeholder="Course">


<input id="yearLevel" placeholder="Year Level">


<button class="button" id="addStudentBtn">

Add Student

</button>



</div>




<div class="card" style="margin-top:25px">


<input id="searchStudent" placeholder="Search Student">


</div>



<div id="studentContainer" class="grid"></div>



`;





const addButton = document.getElementById("addStudentBtn");



addButton.addEventListener("click", async ()=>{


const student = {


fullName:
document.getElementById("fullName").value.trim(),


studentID:
document.getElementById("studentID").value.trim(),


course:
document.getElementById("course").value.trim(),


yearLevel:
document.getElementById("yearLevel").value.trim(),


photo:""


};




if(

!student.fullName ||

!student.studentID ||

!student.course ||

!student.yearLevel

){

alert("Please complete all fields.");

return;

}




await addStudent(student);



alert("Student saved successfully!");



document.getElementById("fullName").value="";

document.getElementById("studentID").value="";

document.getElementById("course").value="";

document.getElementById("yearLevel").value="";



});






document
.getElementById("searchStudent")
.addEventListener("input",(e)=>{


searchStudents(e.target.value);


});





loadStudents();



}







function placeholder(title){


mainContent.innerHTML = `


<h1 class="page-title">

${title}

</h1>


<div class="card">


<h2>${title}</h2>


<p>
This module will be built next.
</p>


</div>


`;

}



loadPage("dashboard");
