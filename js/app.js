// ================================
// ATTENDANCE CHECKER
// MAIN APPLICATION
// VERSION 3.2 SUBJECTS MODULE ADDED
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

    loadCourses

} from "./courses.js";



import {

    addSubject,

    loadSubjects

} from "./subjects.js";







const mainContent =
document.getElementById("mainContent");



const menuButtons =
document.querySelectorAll(".menu");








// ================================
// MENU SYSTEM
// ================================


menuButtons.forEach(button=>{


    button.addEventListener("click",()=>{


        menuButtons.forEach(btn=>{

            btn.classList.remove("active");

        });



        button.classList.add("active");



        loadPage(
            button.dataset.page
        );


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

            courses();

            break;



        case "subjects":

            subjects();

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
id="course"
placeholder="Course"
>



<input
id="yearLevel"
placeholder="Year Level"
>




<button
class="button"
id="addStudentBtn">

Save Student

</button>



</div>





<div class="card search-card">


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






const addButton =
document.getElementById(
"addStudentBtn"
);




addButton.onclick = async()=>{


const student={


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
.trim()



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





addButton.disabled=true;

addButton.innerText=
"Saving...";





const saved =
await addStudent(student);





if(saved){


document
.getElementById("fullName")
.value="";

document
.getElementById("studentID")
.value="";

document
.getElementById("course")
.value="";

document
.getElementById("yearLevel")
.value="";


alert(
"Student saved successfully!"
);


}




addButton.disabled=false;

addButton.innerText=
"Save Student";


};






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



loadStudents();



}
// ================================
// SUBJECTS MODULE
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

type="text"

placeholder="Subject Name"

>




<input

id="subjectCode"

type="text"

placeholder="Subject Code"

>




<input

id="subjectInstructor"

type="text"

placeholder="Instructor Name"

>




<button

class="button"

id="addSubjectBtn">

Save Subject

</button>



</div>







<div class="card"

style="margin-top:25px;">


<h2>
Subject List
</h2>



<div

id="subjectContainer"

class="student-grid">

</div>



</div>



`;








const button =

document.getElementById(
"addSubjectBtn"
);





if(!button){

console.error(
"Subject button missing"
);

return;

}







button.onclick = async()=>{



const subject = {



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
"Please complete subject name and code."
);


return;


}







try{


button.disabled=true;


button.innerText=
"Saving...";






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



}



catch(error){


console.error(
"SUBJECT SAVE ERROR:",
error
);



alert(
"Saving failed: "
+
error.message
);



}



finally{


button.disabled=false;


button.innerText=
"Save Subject";


}



};








loadSubjects();



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

This module will be developed next.

</p>



</div>



`;



}









// ================================
// APP START
// ================================


console.log(

"🔥 ATTENDANCE CHECKER READY"

);




loadPage("dashboard");
