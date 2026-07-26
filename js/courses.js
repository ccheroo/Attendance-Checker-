// ======================================================
// ATTENDANCE CHECKER
// FIRESTORE COURSE MANAGEMENT
// VERSION 2.0 STABLE
// ======================================================


import { db } from "./firebase.js";


import {

    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    serverTimestamp

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





let courses = [];



const courseCollection =
collection(db,"courses");







// ================================
// LOAD COURSES
// ================================

export async function loadCourses(){


    try{


        const snapshot =
        await getDocs(courseCollection);



        courses=[];



        snapshot.forEach(item=>{


            courses.push({

                id:item.id,

                ...item.data()

            });


        });




        console.log(
            "Courses loaded:",
            courses.length
        );



        renderCourses();



    }


    catch(error){


        console.error(
            "LOAD COURSES ERROR:",
            error
        );


    }


}









// ================================
// ADD COURSE
// ================================

export async function addCourse(course){



    try{


        console.log(
            "Saving course:",
            course
        );



        await addDoc(

            courseCollection,

            {


                name:
                course.name || "",



                code:
                course.code || "",



                createdAt:
                serverTimestamp()


            }

        );




        await loadCourses();




        return true;



    }



    catch(error){


        console.error(
            "ADD COURSE ERROR:",
            error
        );



        alert(
            "Course save failed: "
            +
            error.message
        );



        return false;



    }



}









// ================================
// DELETE COURSE
// ================================

export async function deleteCourse(id){



    try{


        const confirmDelete =
        confirm(
            "Delete this course?"
        );



        if(!confirmDelete)
        return;



        await deleteDoc(

            doc(
                db,
                "courses",
                id
            )

        );




        await loadCourses();




        alert(
            "Course deleted!"
        );



    }



    catch(error){



        console.error(
            "DELETE COURSE ERROR:",
            error
        );



        alert(
            error.message
        );


    }



}









// ================================
// DISPLAY COURSES
// ================================

export function renderCourses(){



const container =
document.getElementById(
"courseContainer"
);



if(!container)
return;





container.innerHTML="";






if(courses.length === 0){



container.innerHTML=`


<div class="empty-card">


<h2>
No Courses Yet
</h2>


<p>
Add your first course.
</p>


</div>


`;



return;



}






courses.forEach(course=>{



const letter =
(course.name || "C")
.charAt(0)
.toUpperCase();





container.innerHTML += `



<div class="student-card">



<div class="student-avatar">

${letter}

</div>





<div class="student-info">


<h2>

${course.name || "Unnamed Course"}

</h2>




<p>

<strong>
Code:
</strong>

${course.code || "N/A"}

</p>





<button

class="delete-btn"

onclick="removeCourse('${course.id}')">


Delete


</button>




</div>



</div>



`;



});



}








window.removeCourse =
deleteCourse;
