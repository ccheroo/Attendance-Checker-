// ======================================================
// ATTENDANCE CHECKER
// FIRESTORE ATTENDANCE MANAGEMENT
// VERSION 3.0 QR + DASHBOARD READY
// ======================================================


import { db } from "./firebase.js";


import {

    collection,
    addDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





// ================================
// COLLECTION
// ================================


const attendanceCollection =
collection(
    db,
    "attendance"
);






let attendanceRecords = [];









// ================================
// RECORD ATTENDANCE
// ================================


export async function recordAttendance(student){



    try{



        const today =
        new Date()
        .toISOString()
        .split("T")[0];







        // CHECK IF ALREADY PRESENT


        const checkQuery =

        query(


            attendanceCollection,


            where(
                "studentID",
                "==",
                student.studentID
            ),


            where(
                "date",
                "==",
                today
            )


        );






        const existing =

        await getDocs(
            checkQuery
        );







        if(!existing.empty){



            alert(

                student.fullName
                +
                " already checked in today."

            );



            return false;


        }









        const attendanceData = {



            studentID:

            student.studentID,



            fullName:

            student.fullName,



            course:

            student.course || "",



            yearLevel:

            student.yearLevel || "",



            qrCode:

            student.qrCode ||
            student.studentID,



            date:

            today,



            time:

            new Date()
            .toLocaleTimeString(),



            status:

            "Present",



            createdAt:

            serverTimestamp()



        };









        await addDoc(

            attendanceCollection,

            attendanceData

        );







        alert(

            "Attendance recorded for "
            +
            student.fullName

        );






        await loadAttendance();





        return true;




    }





    catch(error){



        console.error(

            "Record attendance error:",
            error

        );



        alert(

            "Attendance failed: "
            +
            error.message

        );



        return false;



    }



}
// ================================
// SEARCH ATTENDANCE
// ================================


export function searchAttendance(keyword){


    keyword =
    keyword
    .toLowerCase()
    .trim();



    const filtered =

    attendanceRecords.filter(record=>{


        const name =
        (record.fullName || "")
        .toLowerCase();



        const id =
        (record.studentID || "")
        .toLowerCase();



        const course =
        (record.course || "")
        .toLowerCase();




        return (

            name.includes(keyword)

            ||

            id.includes(keyword)

            ||

            course.includes(keyword)

        );


    });




    renderAttendance(filtered);



}









// ================================
// GET ATTENDANCE COUNT
// ================================


export function getAttendanceCount(){


    return attendanceRecords.length;


}









// ================================
// GET TODAY ATTENDANCE
// ================================


export function getTodayAttendance(){


    const today =

    new Date()
    .toISOString()
    .split("T")[0];




    return attendanceRecords.filter(record=>{


        return record.date === today;


    });



}









// ================================
// CLEAR ATTENDANCE VIEW
// ================================


export function clearAttendance(){



const container =

document.getElementById(
"attendanceContainer"
);



if(container){


    container.innerHTML="";


}



}









// ================================
// EXPORT DATA
// ================================


export function getAttendanceRecords(){


    return attendanceRecords;


}









console.log(

"📅 Attendance Module Ready"

);
