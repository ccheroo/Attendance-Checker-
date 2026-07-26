// ======================================================
// ATTENDANCE CHECKER
// FIREBASE STUDENT MANAGEMENT
// VERSION 2.2 STABLE FIRESTORE + STORAGE READY
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


    const container =
    document.getElementById(
        "studentContainer"
    );


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




        renderStudents();



        console.log(
            "Students loaded:",
            students.length
        );



    }



    catch(error){


        console.error(
            "Loading students failed:",
            error
        );



        if(container){

            container.innerHTML = `

            <div class="card">

            <h2>
            Error loading students
            </h2>

            <p>
            ${error.message}
            </p>

            </div>

            `;

        }



    }



}








// ======================================
// ADD STUDENT
// ======================================

export async function addStudent(student){


    try{


        console.log(
            "Saving student to Firestore..."
        );



        const docRef = await addDoc(

            studentCollection,


            {


                ...student,


                createdAt:
                serverTimestamp()



            }


        );



        console.log(
            "Student saved ID:",
            docRef.id
        );



        await loadStudents();



        return true;



    }



    catch(error){


        console.error(
            "Adding student failed:",
            error
        );



        alert(

            "Cannot save student: "

            +

            error.message

        );



        return false;



    }



}









// ======================================
// DELETE STUDENT
// ======================================

export async function deleteStudent(id){



    try{


        console.log(
            "Deleting:",
            id
        );



        await deleteDoc(

            doc(

                db,

                "students",

                id

            )

        );



        await loadStudents();



        alert(
            "Student deleted successfully!"
        );



    }



    catch(error){



        console.error(
            "Delete failed:",
            error
        );



        alert(
            "Delete failed: "
            +
            error.message
        );



    }



}









// ======================================
// SEARCH STUDENT
// ======================================

export function searchStudents(keyword){



    keyword =
    keyword
    .toLowerCase();



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



    if(!container) return;



    container.innerHTML="";





    if(data.length === 0){


        container.innerHTML = `


        <div class="card">


        <h2>
        No Students Yet
        </h2>


        <p>
        Add your first student.
        </p>



        </div>



        `;


        return;


    }







    data.forEach(student=>{



        container.innerHTML += `


        <div class="card student-card">


        <img


        src="${student.photo || 'assets/students/default.png'}"



        onerror="this.src='assets/students/default.png'"



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
