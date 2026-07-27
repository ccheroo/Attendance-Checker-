// ================================
// ATTENDANCE CHECKER
// MAIN APPLICATION
// VERSION 4.0 CLEAN FIXED
// ================================


// ================================
// IMPORTS
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
    loadCourses,
    searchCourses

} from "./courses.js";



import {

    addSubject,

    loadSubjects

} from "./subjects.js";



import {

    openScanner

} from "./scanner.js";



import {

    loadAttendance

} from "./attendance.js";






// ================================
// GLOBAL ELEMENTS
// ================================


const mainContent =
document.getElementById(
    "mainContent"
);



const menuButtons =
document.querySelectorAll(
    ".menu"
);







// ================================
// MENU SYSTEM
// ================================


menuButtons.forEach(button=>{


    button.addEventListener(
        "click",
        ()=>{


            menuButtons.forEach(btn=>{


                btn.classList.remove(
                    "active"
                );


            });



            button.classList.add(
                "active"
            );



            loadPage(
                button.dataset.page
            );


        }
    );


});







// ================================
// ROUTER
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

            scannerPage();

        break;



        case "attendance":

            attendance();

        break;



        case "reports":

            placeholder(
                "Reports"
            );

        break;



        case "settings":

            placeholder(
                "Settings"
            );

        break;



        default:

            dashboard();

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





<div class="card">


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







const button =
document.getElementById(
"addStudentBtn"
);




button.onclick = async()=>{


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







button.disabled=true;

button.innerText=
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





button.disabled=false;

button.innerText=
"Save Student";


};








const search =
document.getElementById(
"searchStudent"
);




if(search){


search.addEventListener(
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
// VERSION 5.0
// ================================

function courses(){

mainContent.innerHTML = `

<h1 class="page-title">

Courses

</h1>


<div class="card">

<h2>Add Course</h2>

<input
id="collegeName"
placeholder="College Name (ex. College of Education)"
>

<input
id="courseName"
placeholder="Course Name (ex. Bachelor of Secondary Education)"
>

<input
id="courseCode"
placeholder="Course Code (ex. BSED)"
>

<button
class="button"
id="addCourseBtn">

Save Course

</button>

</div>


<div class="card">

<input
id="searchCourse"
placeholder="Search Course..."
>

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

college:
document
.getElementById("collegeName")
.value
.trim(),

course:
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

!course.college ||

!course.course ||

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

document.getElementById("collegeName").value="";

document.getElementById("courseName").value="";

document.getElementById("courseCode").value="";

alert("Course saved successfully!");

}



button.disabled=false;

button.innerText="Save Course";

};



const searchBox =
document.getElementById(
"searchCourse"
);



searchBox.addEventListener(
"input",
e=>{

searchCourses(
e.target.value
);

}
);



loadCourses();

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
placeholder="Subject Name"
>



<input
id="subjectCode"
placeholder="Subject Code"
>



<input
id="subjectInstructor"
placeholder="Instructor Name"
>



<button
class="button"
id="addSubjectBtn">

Save Subject

</button>



</div>







<div class="card">


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






button.disabled=false;

button.innerText=
"Save Subject";



};






loadSubjects();



}









// ================================
// SCANNER MODULE
// ================================


function scannerPage(){



mainContent.innerHTML = `


<h1 class="page-title">
QR Scanner
</h1>




<div class="card">


<h2>
Attendance Scanner
</h2>



<p>
Scan student QR code.
</p>




<div
id="reader"
style="
width:100%;
max-width:500px;
margin:auto;
">

</div>




<div
id="scanResult">

Waiting for scan...

</div>



</div>



`;




openScanner();



}

// ================================
// ATTENDANCE MODULE
// ================================


function attendance(){



mainContent.innerHTML = `


<h1 class="page-title">
Attendance
</h1>




<div class="card">


<h2>
Attendance Records
</h2>



<div
id="attendanceContainer"
class="student-grid">

</div>



</div>



`;



loadAttendance();



}









// ================================
// REPORTS / SETTINGS / OTHERS
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
// APPLICATION START
// ================================


console.log(
"🔥 ATTENDANCE CHECKER VERSION 4.0 READY"
);





loadPage(
"dashboard"
);
