// ================================
// ATTENDANCE CHECKER
// MAIN APPLICATION
// VERSION 2.8 FIRESTORE ONLY FINAL
// ================================


import { loadDashboard } from "./dashboard.js";


import {

    addStudent,

    searchStudents,

    loadStudents

} from "./students.js";





const mainContent =
document.getElementById("mainContent");


const menuButtons =
document.querySelectorAll(".menu");







// ================================
// MENU
// ================================

menuButtons.forEach(button=>{


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

    mainContent.innerHTML =
    loadDashboard();

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
type="text"
placeholder="Full Name"
>


<input
id="studentID"
type="text"
placeholder="Student ID"
>


<input
id="course"
type="text"
placeholder="Course"
>


<input
id="yearLevel"
type="text"
placeholder="Year Level"
>



<button
type="button"
class="button"
id="addStudentBtn">

Save Student

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
class="grid">

</div>


`;









// ================================
// SAVE STUDENT
// ================================


const addButton =
document.getElementById(
"addStudentBtn"
);



if(!addButton){

console.error(
"Save button missing"
);

return;

}





addButton.onclick = async ()=>{


const fullName =
document.getElementById("fullName")
.value.trim();



const studentID =
document.getElementById("studentID")
.value.trim();



const course =
document.getElementById("course")
.value.trim();



const yearLevel =
document.getElementById("yearLevel")
.value.trim();





if(

!fullName ||
!studentID ||
!course ||
!yearLevel

){

alert(
"Please complete all fields."
);

return;

}





const student = {


    fullName,

    studentID,

    course,

    yearLevel


};





try{


addButton.disabled = true;

addButton.innerHTML =
"Saving...";





const result =
await addStudent(student);





if(result){


alert(
"Student saved successfully!"
);



document.getElementById("fullName").value="";

document.getElementById("studentID").value="";

document.getElementById("course").value="";

document.getElementById("yearLevel").value="";


}



}



catch(error){


console.error(
"SAVE ERROR:",
error
);


alert(
"Saving failed: "
+
error.message
);



}



finally{


addButton.disabled=false;


addButton.innerHTML =
"Save Student";


}



};









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
// LOAD FIRESTORE DATA
// ================================


try{


await loadStudents();


}

catch(error){


console.error(
"LOAD STUDENTS ERROR:",
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








console.log(
"🔥 ATTENDANCE CHECKER READY"
);



loadPage("dashboard");
