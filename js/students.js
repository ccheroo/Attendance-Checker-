// ======================================================
// ATTENDANCE CHECKER
// FIRESTORE STUDENT MANAGEMENT
// VERSION 4.0 QR READY
// ======================================================


import { db } from "./firebase.js";


import {

    collection,

    addDoc,

    getDocs,

    deleteDoc,

    updateDoc,

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



        console.log(
            "Loaded students:",
            students.length
        );



        renderStudents();



    }



    catch(error){


        console.error(
            "Load students error:",
            error
        );


    }


}









// ================================
// ADD STUDENT
// ================================

export async function addStudent(student){



    try{



        const data = {


            fullName:
            student.fullName,


            studentID:
            student.studentID,



            qrCode:

            student.qrCode ||
            student.studentID,



            course:
            student.course,



            yearLevel:
            student.yearLevel,



            photo:

            student.photo ||
            "",



            createdAt:
            serverTimestamp()



        };





        await addDoc(

            studentCollection,

            data

        );




        await loadStudents();




        return true;



    }




    catch(error){


        console.error(
            "Save student error:",
            error
        );



        alert(
            "Saving failed: "
            +
            error.message
        );



        return false;



    }



}









// ================================
// UPDATE STUDENT
// ================================

export async function updateStudent(id,data){



    try{


        await updateDoc(

            doc(
                db,
                "students",
                id
            ),

            data

        );



        await loadStudents();



        return true;



    }



    catch(error){


        console.error(
            error
        );


        return false;


    }


}









// ================================
// DELETE STUDENT
// ================================

export async function deleteStudent(id){



    const confirmDelete =
    confirm(
        "Delete this student?"
    );



    if(!confirmDelete)
    return;




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


        alert(
            "Delete failed: "
            +
            error.message
        );


    }



}
// ================================
// STUDENT PHOTO SUPPORT
// ================================

export function updateStudentPhoto(id,photoURL){


    const student =
    students.find(
        s=>s.id===id
    );


    if(student){


        student.photo =
        photoURL;


        renderStudents();


    }


}






// ================================
// GET STUDENT BY ID
// ================================

export function getStudent(id){


    return students.find(
        student =>
        student.id === id
    );


}






// ================================
// COUNT STUDENTS
// ================================

export function getStudentCount(){


    return students.length;


}






// ================================
// FILTER BY COURSE
// ================================

export function filterStudentsByCourse(course){


    const result =

    students.filter(student=>{


        return (

            student.course === course

        );


    });



    renderStudents(result);



}







// ================================
// EXPORT STUDENTS DATA
// ================================

export function getStudents(){


    return students;


}






// ================================
// UPDATE STUDENT
// ================================

export async function updateStudent(id,data){


    try{


        const studentRef =
        doc(
            db,
            "students",
            id
        );



        await updateDoc(

            studentRef,

            {


                ...data,


                updatedAt:
                serverTimestamp()


            }


        );



        await loadStudents();



        return true;



    }



    catch(error){


        console.error(
            "Update error:",
            error
        );



        alert(
            error.message
        );


        return false;


    }


}






// ================================
// RESET SEARCH
// ================================

export function resetStudentSearch(){


    renderStudents();



}






console.log(
    "👨‍🎓 Student Module Ready"
);
