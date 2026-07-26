// ======================================================
// ATTENDANCE CHECKER
// FIREBASE STUDENT MANAGEMENT
// VERSION 2.3 STABLE SAVE SYSTEM
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


const studentCollection = collection(db,"students");








// ======================================
// LOAD STUDENTS
// ======================================

export async function loadStudents(){


    try{


        const snapshot = await getDocs(
            studentCollection
        );


        students = [];


        snapshot.forEach((item)=>{


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


    console.log(
        "START SAVING STUDENT",
        student
    );



    try{


        const savePromise = addDoc(

            studentCollection,

            {


                fullName: student.fullName,

                studentID: student.studentID,

                course: student.course,

                yearLevel: student.yearLevel,

                photo: student.photo || "",


                createdAt:
                serverTimestamp()


            }

        );




        const timeout = new Promise(

            (_, reject)=>{

                setTimeout(()=>{

                    reject(
                        new Error(
                            "Saving timeout. Check Firestore Rules."
                        )
                    );


                },15000);


            }

        );





        const result = await Promise.race([

            savePromise,

            timeout

        ]);




        console.log(
            "STUDENT SAVED:",
            result.id
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

            "Student was not saved:\n"

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
            error.message
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


        return (

            (student.fullName || "")
            .toLowerCase()
            .includes(keyword)


            ||


            (student.studentID || "")
            .toLowerCase()
            .includes(keyword)


            ||


            (student.course || "")
            .toLowerCase()
            .includes(keyword)


        );


    });



    renderStudents(filtered);



}









// ======================================
// DISPLAY
// ======================================

export function renderStudents(data = students){



    const container =
    document.getElementById(
        "studentContainer"
    );



    if(!container)
        return;



    container.innerHTML="";




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
        ID: ${student.studentID}
        </p>


        <p>
        Course: ${student.course}
        </p>


        <p>
        Year: ${student.yearLevel}
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








window.removeStudent = deleteStudent;
