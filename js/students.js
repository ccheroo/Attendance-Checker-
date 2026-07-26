// ======================================================
// ATTENDANCE CHECKER
// FIREBASE STUDENT MANAGEMENT
// VERSION 2.5 NO PHOTO STABLE
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








// ======================================
// LOAD STUDENTS
// ======================================

export async function loadStudents(){


    try{


        const snapshot =
        await getDocs(studentCollection);



        students = [];



        snapshot.forEach(item=>{


            students.push({

                id:item.id,

                ...item.data()

            });


        });



        console.log(
            "Students loaded:",
            students.length
        );



        renderStudents();



    }


    catch(error){


        console.error(
            "LOAD ERROR:",
            error
        );


        alert(
            "Cannot load students: "
            + error.message
        );


    }


}









// ======================================
// ADD STUDENT
// ======================================

export async function addStudent(student){


    try{


        console.log(
            "Saving student..."
        );



        const docRef =
        await addDoc(

            studentCollection,

            {


                fullName:
                student.fullName,


                studentID:
                student.studentID,


                course:
                student.course,


                yearLevel:
                student.yearLevel,


                createdAt:
                serverTimestamp()


            }


        );



        console.log(
            "Saved ID:",
            docRef.id
        );



        await loadStudents();



        return true;



    }



    catch(error){


        console.error(
            "SAVE ERROR:",
            error
        );



        alert(
            "Save failed: "
            + error.message
        );



        return false;


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



        alert(
            "Student deleted!"
        );



    }



    catch(error){


        console.error(
            "DELETE ERROR:",
            error
        );


        alert(
            "Delete failed: "
            + error.message
        );


    }



}









// ======================================
// SEARCH
// ======================================

export function searchStudents(keyword){


    keyword =
    keyword.toLowerCase();



    const filtered =
    students.filter(student=>{


        const name =
        (student.fullName || "")
        .toLowerCase();


        const id =
        (student.studentID || "")
        .toLowerCase();


        const course =
        (student.course || "")
        .toLowerCase();



        return (

            name.includes(keyword)

            ||

            id.includes(keyword)

            ||

            course.includes(keyword)

        );


    });



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



    if(!container)
        return;



    container.innerHTML = "";





    if(data.length === 0){


        container.innerHTML = `


        <div class="card">


        <h2>
        No Students Yet
        </h2>


        <p>
        Register your first student.
        </p>


        </div>


        `;


        return;


    }







    data.forEach(student=>{


        container.innerHTML += `


        <div class="card student-card">


        <div class="student-avatar">

            ${student.fullName
            .charAt(0)
            .toUpperCase()}

        </div>



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


        class="button delete-btn"


        onclick="removeStudent('${student.id}')">


        Delete


        </button>



        </div>


        `;



    });



}








window.removeStudent =
deleteStudent;
