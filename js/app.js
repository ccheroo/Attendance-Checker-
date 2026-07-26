// ================================
// ATTENDANCE CHECKER
// MAIN APPLICATION
// VERSION 2.5 PHOTO UPLOAD FIXED
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





<div class="photo-upload">


<h3>

Student Photo

</h3>



<input

type="file"

id="studentPhoto"

accept="image/*"

>




<p>

Upload student's profile picture

</p>


</div>





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

class="grid">

</div>



`;








// ================================
// ADD STUDENT
// ================================


const addButton =
document.getElementById(
"addStudentBtn"
);




addButton.onclick = async ()=>{



const fullName =
document.getElementById(
"fullName"
).value.trim();



const studentID =
document.getElementById(
"studentID"
).value.trim();



const course =
document.getElementById(
"course"
).value.trim();



const yearLevel =
document.getElementById(
"yearLevel"
).value.trim();



const photoFile =
document.getElementById(
"studentPhoto"
).files[0];






if(

!fullName ||

!studentID ||

!course ||

!yearLevel ||

!photoFile

){


alert(
"Please complete all information and upload a photo."
);


return;


}







try{



// Upload Image


const imageRef = ref(

storage,

"students/" +

studentID +

"_" +

photoFile.name

);





await uploadBytes(

imageRef,

photoFile

);





const photoURL = await getDownloadURL(

imageRef

);






const student = {


fullName,

studentID,

course,

yearLevel,

photo:photoURL


};






await addStudent(student);





alert(
"Student saved successfully!"
);






document.getElementById("fullName").value="";

document.getElementById("studentID").value="";

document.getElementById("course").value="";

document.getElementById("yearLevel").value="";

document.getElementById("studentPhoto").value="";



}



catch(error){



console.error(error);


alert(

"Saving failed: "

+

error.message

);



}



};








// ================================
// SEARCH
// ================================


const searchBox = document.getElementById(
"searchStudent"
);



searchBox.addEventListener(
"input",
(e)=>{


searchStudents(
e.target.value
);


});








// ================================
// LOAD STUDENTS
// ================================


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
// START
// ================================

console.log(
"ATTENDANCE CHECKER READY"
);


loadPage("dashboard");
