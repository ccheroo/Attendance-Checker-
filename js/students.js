// ======================================================
// ATTENDANCE CHECKER
// FIRESTORE STUDENT MANAGEMENT
// VERSION 3.0 CLEAN STABLE
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



let students = [];


const studentCollection =
collection(db,"students");




// ================================
// LOAD STUDENTS
// ================================

export async function loadStudents(){


    try{


        const snapshot =
        await getDocs(studentCollection);



        students=[];



        snapshot.forEach(item=>{


            students.push({

                id:item.id,

                ...item.data()

            });


        });



        renderStudents();



    }


    catch(error){


        console.error(
            "Load error:",
            error
        );


    }


}






// ================================
// ADD STUDENT
// ================================

export async function addStudent(student){


    try{


        await addDoc(

            studentCollection,

            {

                ...student,

                createdAt:
                serverTimestamp()

            }

        );



        await loadStudents();


        return true;


    }


    catch(error){


        console.error(
            error
        );


        alert(
            error.message
        );


        return false;


    }


}






// ================================
// DELETE
// ================================

export async function deleteStudent(id){


    try{


        await deleteDoc(

            doc(
                db,
                "students",
                id
            )

        );



        await loadStudents();



    }


    catch(error){


        alert(
            "Delete failed: "
            +
            error.message
        );


    }


}






// ================================
// SEARCH
// ================================

export function searchStudents(keyword){


    keyword =
    keyword.toLowerCase();



    const result =
    students.filter(student=>{


        return (

            student.fullName
            .toLowerCase()
            .includes(keyword)


            ||

            student.studentID
            .toLowerCase()
            .includes(keyword)


            ||

            student.course
            .toLowerCase()
            .includes(keyword)


        );


    });



    renderStudents(result);


}








// ================================
// DISPLAY
// ================================

export function renderStudents(data=students){


const container =
document.getElementById(
"studentContainer"
);



if(!container)
return;




container.innerHTML="";





if(data.length===0){


container.innerHTML=`

<div class="empty-card">

<h2>No Students Yet</h2>

<p>Add your first student.</p>

</div>

`;

return;


}






data.forEach(student=>{


container.innerHTML+=`


<div class="student-card">


<div class="student-avatar">

${student.fullName.charAt(0)}

</div>


<div class="student-info">


<h2>
${student.fullName}
</h2>


<p>
<strong>ID:</strong>
${student.studentID}
</p>


<p>
<strong>Course:</strong>
${student.course}
</p>


<p>
<strong>Year:</strong>
${student.yearLevel}
</p>


<button
class="delete-btn"
onclick="removeStudent('${student.id}')">

Delete

</button>


</div>


</div>


`;



});



}




window.removeStudent =
deleteStudent;
