// ================================
// ATTENDANCE CHECKER
// MAIN APPLICATION
// VERSION 2.1 FIREBASE + PHOTO UPLOAD
// ================================


import { loadDashboard } from "./dashboard.js";


import {

    addStudent,

    searchStudents,

    loadStudents

} from "./students.js";



import { storage } from "./firebase.js";


import {

    ref,

    uploadBytes,

    getDownloadURL

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";





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




<label>

Student Photo

</label>



<input

type="file"

id="studentPhoto"

accept="image/*"

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


const photoFile =
document.getElementById("studentPhoto").files[0];





if(

!fullName ||

!studentID ||

!course ||

!yearLevel ||

!photoFile

){


alert("Please complete all information and upload a photo.");

return;


}







try {



const imageRef = ref(

storage,

"students/" + studentID + "_" + photoFile.name

);





await uploadBytes(

imageRef,

photoFile

);





const photoURL = await getDownloadURL(imageRef);






const student = {


fullName,

studentID,

course,

yearLevel,

photo: photoURL


};






await addStudent(student);






document.getElementById("fullName").value="";

document.getElementById("studentID").value="";

document.getElementById("course").value="";

document.getElementById("yearLevel").value="";

document.getElementById("studentPhoto").value="";





alert("Student saved successfully!");




}

catch(error){


console.error(error);


alert(

"Upload failed: " + error.message

);


}



});









// ================================
// SEARCH
// ================================

const searchBox = document.getElementById("searchStudent");



searchBox.addEventListener("input",(event)=>{


searchStudents(event.target.value);


});







// LOAD STUDENTS

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
