// ======================================================
// ATTENDANCE CHECKER
// FIRESTORE ATTENDANCE MANAGEMENT
// VERSION 1.0 QR READY
// ======================================================


import { db } from "./firebase.js";


import {

    collection,
    addDoc,
    getDocs,
    query,
    where,
    serverTimestamp

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





const attendanceCollection =
collection(db,"attendance");







// ================================
// RECORD ATTENDANCE
// ================================

export async function recordAttendance(student){


    try{


        const today =
        new Date()
        .toISOString()
        .split("T")[0];




        // CHECK DUPLICATE

        const q =
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
        await getDocs(q);





        if(!existing.empty){


            alert(
                "Student already checked in today."
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
                student.course,



                yearLevel:
                student.yearLevel,



                date:
                today,



                time:
                new Date()
                .toLocaleTimeString(),



                createdAt:
                serverTimestamp()



            }


        );





        alert(
            "Attendance recorded!"
        );



        return true;



    }



    catch(error){


        console.error(
            "Attendance error:",
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
            attendanceCollection
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
            "Load attendance error:",
            error
        );


    }



}








// ================================
// DISPLAY
// ================================

export function renderAttendance(records){


const container =
document.getElementById(
"attendanceContainer"
);



if(!container)
return;




container.innerHTML="";






if(records.length===0){


container.innerHTML=`

<div class="empty-card">

<h2>
No Attendance Yet
</h2>

<p>
Scan student QR codes.
</p>

</div>

`;

return;


}







records.forEach(record=>{


container.innerHTML += `


<div class="student-card">


<div class="student-avatar">

${record.fullName
.charAt(0)
.toUpperCase()}

</div>



<div class="student-info">


<h2>

${record.fullName}

</h2>



<p>

<strong>ID:</strong>

${record.studentID}

</p>



<p>

<strong>Date:</strong>

${record.date}

</p>



<p>

<strong>Time:</strong>

${record.time}

</p>



</div>



</div>


`;



});



}
