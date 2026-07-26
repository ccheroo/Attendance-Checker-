// ================================
// ATTENDANCE CHECKER
// MAIN APPLICATION
// VERSION 2.3 FIXED BUTTON SYSTEM
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


        menuButtons.forEach(btn => {

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
// STUDENTS
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
placeholder="Full Name">



<input 
id="studentID"
placeholder="Student ID">



<input 
id="course"
placeholder="Course">



<input 
id="yearLevel"
placeholder="Year Level">



<button 
class="button" 
id="addStudentBtn">

Add Student

</button>



</div>





<div class="card" style="margin-top:25px">


<input 
id="searchStudent"
placeholder="Search Student">


</div>





<div 
id="studentContainer"
class="grid">

</div>



`;






// ================================
// ADD BUTTON
// ================================


const addButton = document.getElementById(
    "addStudentBtn"
);



console.log(
    "ADD BUTTON:",
    addButton
);




if(addButton){



addButton.onclick = async function(){



console.log(
    "ADD BUTTON CLICKED"
);




const student = {


fullName:

document
.getElementById("fullName")
.value
.trim(),



studentID:

document
.getElementById("studentID")
.value
.trim(),



course:

document
.getElementById("course")
.value
.trim(),



yearLevel:

document
.getElementById("yearLevel")
.value
.trim(),



photo:""



};






if(

!student.fullName ||

!student.studentID ||

!student.course ||

!student.yearLevel

){


alert(
"Please complete all fields."
);


return;


}





try{


await addStudent(student);



alert(
"Student saved successfully!"
);




document.getElementById("fullName").value="";

document.getElementById("studentID").value="";

document.getElementById("course").value="";

document.getElementById("yearLevel").value="";



}


catch(error){


console.error(error);


alert(
"Saving failed: " + error.message
);


}



};



}





else{


console.error(
"ADD STUDENT BUTTON NOT FOUND"
);


}








// ================================
// SEARCH
// ================================


const searchBox =
document.getElementById(
"searchStudent"
);



if(searchBox){


searchBox.addEventListener(
"input",
(e)=>{


searchStudents(
e.target.value
);


});


}







// ================================
// LOAD FIREBASE DATA
// ================================

try{


loadStudents();



}

catch(error){


console.error(
"Loading failed:",
error
);


}



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
// START
// ================================

console.log(
"APP JS LOADED"
);


loadPage("dashboard");
