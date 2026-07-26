// ======================================================
// ATTENDANCE CHECKER
// FIREBASE STUDENT MANAGEMENT
// VERSION 2.0
// ======================================================


import { db } from "./firebase.js";


import {

    collection,

    addDoc,

    getDocs,

    deleteDoc,

    doc,

    orderBy,

    query

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





let students = [];

const studentCollection = collection(db,"students");





// ======================================
// LOAD STUDENTS
// ======================================

export async function loadStudents(){


    students = [];


    const q = query(

        studentCollection,

        orderBy("createdAt","desc")

    );



    const snapshot = await getDocs(q);



    snapshot.forEach((item)=>{


        students.push({

            id:item.id,

            ...item.data()

        });


    });



    renderStudents();



}






// ======================================
// ADD STUDENT
// ======================================

export async function addStudent(student){



    await addDoc(studentCollection,{

        ...student,

        createdAt:new Date()

    });



    await loadStudents();



}






// ======================================
// DELETE STUDENT
// ======================================

export async function deleteStudent(id){



    await deleteDoc(

        doc(db,"students",id)

    );



    await loadStudents();



}






// ======================================
// SEARCH STUDENT
// ======================================

export function searchStudents(keyword){



    keyword = keyword.toLowerCase();



    const filtered = students.filter(student=>



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
    document.getElementById("studentContainer");



    if(!container) return;




    container.innerHTML="";




    if(data.length===0){


        container.innerHTML=`

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


        container.innerHTML+=`


        <div class="card">


        <img

        src="${student.photo}"

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
