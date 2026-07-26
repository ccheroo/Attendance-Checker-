// ================================
// ATTENDANCE CHECKER
// MAIN APPLICATION
// VERSION 2.6 STABLE PHOTO UPLOAD
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






// MENU

menuButtons.forEach(button=>{


button.addEventListener("click",()=>{


menuButtons.forEach(btn=>{

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









const addButton = document.getElementById(
"addStudentBtn"
);





if(!addButton){

console.error("Save button missing");

return;

}








addButton.onclick = async ()=>{



console.log("SAVE CLICKED");



const fullName =
document.getElementById("fullName").value.trim();



const studentID =
document.getElementById("studentID").value.trim();



const course =
document.getElementById("course").value.trim();



const yearLevel =
document.getElementById("yearLevel").value.trim();



const photoInput =
document.getElementById("studentPhoto");



const photoFile =
photoInput.files[0];







if(

!fullName ||

!studentID ||

!course ||

!yearLevel ||

!photoFile

){


alert(
"Please complete all fields and choose a photo."
);


return;


}







try{



addButton.disabled = true;

addButton.innerHTML =
"Saving...";





// UPLOAD PHOTO


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





console.log(
"PHOTO UPLOADED"
);





const photoURL =
await getDownloadURL(imageRef);







const student = {


fullName,

studentID,

course,

yearLevel,

photo:photoURL


};







await addStudent(student);





console.log(
"STUDENT SAVED"
);





alert(
"Student saved successfully!"
);







document.getElementById("fullName").value="";

document.getElementById("studentID").value="";

document.getElementById("course").value="";

document.getElementById("yearLevel").value="";

document.getElementById("studentPhoto").value="";





addButton.disabled=false;

addButton.innerHTML="Save Student";




}





catch(error){



console.error(error);



alert(

"Saving failed: " +

error.message

);



addButton.disabled=false;

addButton.innerHTML="Save Student";



}



};









const searchBox =
document.getElementById("searchStudent");



if(searchBox){


searchBox.addEventListener(
"input",
(e)=>{


searchStudents(
e.target.value
);



});


}






loadStudents();



}









function placeholder(title){



mainContent.innerHTML=`


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
"ATTENDANCE CHECKER READY"
);



loadPage("dashboard");
