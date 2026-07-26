// ======================================================
// ATTENDANCE CHECKER
// FIREBASE STUDENT MANAGEMENT
// VERSION 2.1 FIXED
// ======================================================


import { db } from "./firebase.js";


import {

    collection,

    addDoc,

    getDocs,

    deleteDoc,

    doc

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





let students = [];

const studentCollection = collection(db,"students");






// ======================================
// LOAD STUDENTS
// ======================================

export async function loadStudents(){


    students = [];


    try {


        const snapshot = await getDocs(studentCollection);



        snapshot.forEach((item)=>{


            students.push({

                id:item.id,

                ...item.data()

            });


        });



        renderStudents();



    }

    catch(error){


        console.error(
            "Loading students failed:",
            error
        );


    }



}








// ======================================
// ADD STUDENT
// ======================================

export async function addStudent(student){


    try{


        await addDoc(studentCollection,{


            ...student,


            createdAt:

            Date.now()


        });



        await loadStudents();



    }


    catch(error){


        console.error(
            "Adding student failed:",
            error
        );


        alert(
            "Cannot save student: "
            + error.message
        );


    }


}








// ======================================
// DELETE STUDENT
// ======================================

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


        console.error(
            "Delete failed:",
            error
        );


    }


}








// ======================================
// SEARCH STUDENT
// ======================================

export function searchStudents(keyword){



    keyword =
    keyword.toLowerCase();



    const filtered =
    students.filter(student =>



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



    renderStudents(filtered);



}








// ======================================
// DISPLAY STUDENTS
// ======================================

export function renderStudents(data = students){



    const container =
    document.getElementById(
        "studentContainer"
    );



    if(!container) return;



    container.innerHTML="";




    if(data.length === 0){


        container.innerHTML = `

        <div class="card">

        <h2>No Students Yet</h2>

        <p>
        Add your first student.
        </p>

        </div>

        `;


        return;

    }





    data.forEach(student=>{


        container.innerHTML += `


        <div class="card">


        <img

        src="${student.photo || 'assets/students/default.png'}"

        style="
        width:120px;
        height:120px;
        border-radius:50%;
        object-fit:cover;
        ">



        <h2>
        ${student.fullName}
        </h2>



        <p>
        ID:
        ${student.studentID}
        </p>



        <p>
        Course:
        ${student.course}
        </p>



        <p>
        Year:
        ${student.yearLevel}
        </p>




        <button

        class="button"

        onclick="removeStudent('${student.id}')">

        Delete

        </button>



        </div>


        `;


    });


}




window.removeStudent = deleteStudent;
