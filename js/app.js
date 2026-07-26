// ================================
// ATTENDANCE CHECKER
// MAIN APPLICATION
// VERSION 3.1 COURSES MODULE ADDED
// ================================


import { loadDashboard } from "./dashboard.js";


import {

    addStudent,

    searchStudents,

    loadStudents

} from "./students.js";



import {

    addCourse,

    loadCourses

} from "./courses.js";






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

            courses();

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
document.getElementById("fullName").value.trim(),


studentID:
document.getElementById("studentID").value.trim(),


course:
document.getElementById("course").value.trim(),


yearLevel:
document.getElementById("yearLevel").value.trim()



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

addButton.innerText="Saving...";





const saved =
await addStudent(student);





if(saved){


document.getElementById("fullName").value="";

document.getElementById("studentID").value="";

document.getElementById("course").value="";

document.getElementById("yearLevel").value="";


alert(
"Student saved successfully!"
);


}





addButton.disabled=false;

addButton.innerText="Save Student";



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
// COURSES MODULE
// ================================


function courses(){



mainContent.innerHTML=`


<h1 class="page-title">

Courses

</h1>





<div class="card">


<h2>

Add Course

</h2>




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


name:

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

!course.name ||
!course.code

){


alert(
"Please complete all fields."
);


return;


}







button.disabled=true;

button.innerText="Saving...";






const saved =
await addCourse(course);






if(saved){


document.getElementById("courseName").value="";


document.getElementById("courseCode").value="";



alert(
"Course saved successfully!"
);



}





button.disabled=false;

button.innerText="Save Course";



};





loadCourses();



}









// ================================
// PLACEHOLDER
// ================================


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
"🔥 ATTENDANCE CHECKER READY"
);




loadPage("dashboard");
