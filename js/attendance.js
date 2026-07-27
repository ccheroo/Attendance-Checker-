// ======================================================
// ATTENDANCE CHECKER
// FIRESTORE ATTENDANCE MANAGEMENT
// VERSION 3.0 FINAL QR INTEGRATED
// ======================================================


import { db } from "./firebase.js";


import {

    collection,

    addDoc,

    getDocs,

    query,

    where,

    orderBy,

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









// ================================
// RECORD ATTENDANCE
// ================================


export async function recordAttendance(student){
student,
subject
){
try{
if(!student){
console.error(
 "No student data."
            );

            return false;

        }





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
            student.qrCode || student.studentID,



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







        return true;



    }





    catch(error){


        console.error(

            "Attendance save error:",
            error

        );



        alert(
            error.message
        );



        return false;



    }



}
// ================================
// LOAD ATTENDANCE RECORDS
// ================================


export async function loadAttendance(){


    try{


        const snapshot =

        await getDocs(

            query(

                attendanceCollection,

                orderBy(
                    "createdAt",
                    "desc"
                )

            )

        );





        let records = [];





        snapshot.forEach(item=>{


            records.push({

                id:item.id,

                ...item.data()

            });



        });






        renderAttendance(records);




    }



    catch(error){


        console.error(

            "Load attendance error:",
            error

        );


    }



}









// ================================
// GET TODAY ATTENDANCE
// ================================


export async function getTodayAttendance(){


    try{


        const today =

        new Date()
        .toISOString()
        .split("T")[0];





        const snapshot =

        await getDocs(

            query(

                attendanceCollection,

                where(
                    "date",
                    "==",
                    today
                )

            )

        );





        let records=[];





        snapshot.forEach(item=>{


            records.push({

                id:item.id,

                ...item.data()

            });


        });





        return records;



    }



    catch(error){


        console.error(
            error
        );


        return [];


    }



}









// ================================
// DISPLAY ATTENDANCE
// ================================


export function renderAttendance(records){



    const container =

    document.getElementById(
        "attendanceContainer"
    );





    if(!container)
    return;







    container.innerHTML="";







    if(records.length === 0){



        container.innerHTML = `


        <div class="empty-card">


            <h2>
            No Attendance Records
            </h2>


            <p>
            Scan student QR codes to record attendance.
            </p>


        </div>


        `;


        return;


    }









    records.forEach(record=>{


        const initial =

        (

            record.fullName ||
            "?"

        )

        .charAt(0)

        .toUpperCase();








        container.innerHTML += `


        <div class="student-card">



            <div class="student-avatar">

                ${initial}

            </div>





            <div class="student-info">



                <h2>

                ${record.fullName || "Unknown"}

                </h2>





                <p>

                <strong>
                Student ID:
                </strong>

                ${record.studentID || "N/A"}

                </p>





                <p>

                <strong>
                Course:
                </strong>

                ${record.course || "N/A"}

                </p>





                <p>

                <strong>
                Year Level:
                </strong>

                ${record.yearLevel || "N/A"}

                </p>





                <p>

                <strong>
                Date:
                </strong>

                ${record.date || "N/A"}

                </p>





                <p>

                <strong>
                Time:
                </strong>

                ${record.time || "N/A"}

                </p>





                <span class="status-present">

                ${record.status || "Present"}

                </span>



            </div>



        </div>


        `;



    });



}









// ================================
// COUNT ATTENDANCE
// ================================


export function countAttendance(records){


    return records.length;


}







console.log(
    "📅 Attendance Module Ready"
);
