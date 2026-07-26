// ======================================================
// ATTENDANCE CHECKER
// FIRESTORE ATTENDANCE MANAGEMENT
// VERSION 3.0 FINAL QR CONNECTED
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





const attendanceCollection =
collection(db,"attendance");







// ================================
// SAVE ATTENDANCE
// ================================


export async function recordAttendance(student){



    try{


        const today =

        new Date()
        .toISOString()
        .split("T")[0];





        const duplicateCheck =

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
            duplicateCheck
        );







        if(!existing.empty){


            alert(
                "Student already has attendance today."
            );


            return false;


        }







        await addDoc(

            attendanceCollection,

            {


                studentID:
                student.studentID,


                fullName:
                student.fullName,


                course:
                student.course || "",


                yearLevel:
                student.yearLevel || "",



                date:
                today,



                time:

                new Date()
                .toLocaleTimeString(),




                status:
                "Present",



                createdAt:
                serverTimestamp()



            }


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
// LOAD ATTENDANCE
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







        let records=[];







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

            "Attendance loading error:",
            error

        );


    }



}
// ======================================================
// GET TODAY ATTENDANCE
// ======================================================

export async function getTodayAttendance(){


    try{


        const today =

        new Date()
        .toISOString()
        .split("T")[0];



        const q = query(

            attendanceCollection,

            where(
                "date",
                "==",
                today
            )

        );





        const snapshot =
        await getDocs(q);





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
            "Today attendance error:",
            error
        );


        return [];

    }



}









// ======================================================
// COUNT ATTENDANCE
// ======================================================


export async function getAttendanceCount(){



    try{


        const snapshot =
        await getDocs(
            attendanceCollection
        );



        return snapshot.size;



    }



    catch(error){


        console.error(
            "Attendance count error:",
            error
        );


        return 0;



    }



}









// ======================================================
// SEARCH ATTENDANCE
// ======================================================


export async function searchAttendance(keyword){



    try{


        const snapshot =
        await getDocs(
            attendanceCollection
        );



        let results=[];



        keyword =
        keyword
        .toLowerCase()
        .trim();





        snapshot.forEach(item=>{


            const data =
            item.data();





            const name =

            (
                data.fullName ||
                ""
            )
            .toLowerCase();





            const id =

            (
                data.studentID ||
                ""
            )
            .toLowerCase();





            if(

                name.includes(keyword)

                ||

                id.includes(keyword)

            ){


                results.push({

                    id:item.id,

                    ...data

                });


            }



        });





        renderAttendance(results);



        return results;



    }



    catch(error){


        console.error(
            "Search attendance error:",
            error
        );


        return [];



    }



}









// ======================================================
// DELETE ATTENDANCE
// ======================================================


export async function deleteAttendance(id){



    try{


        await deleteDoc(

            doc(

                db,

                "attendance",

                id

            )

        );



        await loadAttendance();



        alert(
            "Attendance deleted!"
        );



    }



    catch(error){


        console.error(
            "Delete attendance error:",
            error
        );


        alert(
            error.message
        );



    }



}









console.log(
    "📅 Attendance Module Ready"
);
