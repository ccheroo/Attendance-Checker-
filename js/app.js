// ================================
// ATTENDANCE CHECKER
// MAIN APPLICATION
// VERSION 4.0 QR ATTENDANCE SYSTEM
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
    loadCourses

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
// COURSES MODULE
// ================================


function courses(){


mainContent.innerHTML = `


<h1 class="page-title">
Courses
</h1>




<div class="card">


<h2>
Add Course
</h2>




<input

id="courseName"

type="text"

placeholder="Course Name"

>




<input

id="courseCode"

type="text"

placeholder="Course Code"

>




<button

class="button"

id="addCourseBtn">

Save Course

</button>



</div>







<div class="card">


<h2>
Course List
</h2>




<div

id="courseContainer"

class="student-grid">


</div>



</div>



`;







const button =
document.getElementById(
"addCourseBtn"
);





if(!button){

console.error(
"Course button not found"
);

return;

}







button.onclick = async()=>{



const course = {


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







try{


button.disabled=true;


button.innerText=
"Saving...";






const saved =
await addCourse(course);







if(saved){



document
.getElementById("courseName")
.value="";



document
.getElementById("courseCode")
.value="";



alert(
"Course saved successfully!"
);



}



}



catch(error){



console.error(
"Course save error:",
error
);



alert(
error.message
);



}



finally{


button.disabled=false;


button.innerText=
"Save Course";


}



};







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
"Subject save error:",
error
);



alert(
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





if(!button){

console.error(
"Subject button not found"
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
"Subject error:",
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
// SCANNER MODULE
// ================================


function scanner(){



mainContent.innerHTML = `


<h1 class="page-title">
QR Scanner
</h1>






<div class="card">


<h2>
Attendance Scanner
</h2>





<p>
Point the camera to the student's QR code.
</p>





<div

id="reader"

style="
width:100%;
max-width:500px;
margin:auto;
margin-top:20px;
">

</div>







<div

id="scanResult"

style="
margin-top:20px;
">

Waiting for QR scan...

</div>





</div>

`;







openScanner();



}








// ================================
// ATTENDANCE PAGE
// ================================


function attendance(){



mainContent.innerHTML = `


<h1 class="page-title">

Attendance Records

</h1>






<div class="card">


<h2>
Attendance History
</h2>





<div

id="attendanceContainer"

class="student-grid">


</div>



</div>



`;






// NEXT: connect attendance.js



}








// ================================
// REPORTS
// ================================


function reports(){


mainContent.innerHTML = `


<h1 class="page-title">

Reports

</h1>





<div class="card">


<h2>
Reports Module
</h2>




<p>

Attendance reports will appear here.

</p>



</div>



`;



}








// ================================
// SETTINGS
// ================================


function settings(){


mainContent.innerHTML = `


<h1 class="page-title">

Settings

</h1>






<div class="card">


<h2>
System Settings
</h2>




<p>

Configuration module coming soon.

</p>



</div>



`;



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

This module will be developed next.

</p>



</div>



`;



}








// ================================
// START APPLICATION
// ================================


console.log(
"🔥 ATTENDANCE CHECKER READY"
);



loadPage(
"dashboard"
);
