// ======================================================
// ATTENDANCE CHECKER
// FIRESTORE COURSE MANAGEMENT
// VERSION 1.0 CLEAN
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



        renderCourses();



    }


    catch(error){


        console.error(
            "Load courses error:",
            error
        );


    }


}









// ================================
// ADD COURSE
// ================================

export async function addCourse(course){


    try{


        await addDoc(

            courseCollection,

            {

                ...course,

                createdAt:
                serverTimestamp()

            }

        );



        await loadCourses();



        return true;



    }


    catch(error){


        console.error(error);


        alert(
            error.message
        );


        return false;


    }


}









// ================================
// DELETE COURSE
// ================================

export async function deleteCourse(id){



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






if(courses.length===0){


container.innerHTML=`

<div class="empty-card">

<h2>No Courses Yet</h2>

<p>Add your first course.</p>

</div>

`;


return;


}







courses.forEach(course=>{



container.innerHTML+=`


<div class="student-card">


<div class="student-avatar">

${course.name.charAt(0)}

</div>



<div class="student-info">


<h2>

${course.name}

</h2>



<p>

<strong>
Code:
</strong>

${course.code}

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
