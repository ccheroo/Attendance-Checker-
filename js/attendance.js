// ======================================================
// ATTENDANCE CHECKER
// FIRESTORE ATTENDANCE MANAGEMENT
// VERSION 2.0 QR CONNECTED STABLE
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
// RECORD ATTENDANCE
// ================================

export async function recordAttendance(student){


    try{


        const today =
        new Date()
        .toISOString()
        .split("T")[0];





        const check =
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
        await getDocs(check);







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



                status:
                "Present",



                createdAt:
                serverTimestamp()



            }


        );







        alert(

            student.fullName
            +
            " attendance recorded!"

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

            "Load attendance error:",
            error

        );


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

${

(record.fullName || "?")
.charAt(0)
.toUpperCase()

}

</div>





<div class="student-info">


<h2>

${record.fullName}

</h2>





<p>

<strong>
ID:
</strong>

${record.studentID}

</p>





<p>

<strong>
Course:
</strong>

${record.course || "N/A"}

</p>





<p>

<strong>
Date:
</strong>

${record.date}

</p>





<p>

<strong>
Time:
</strong>

${record.time}

</p>





<p>

<strong>
Status:
</strong>

${record.status}

</p>





</div>



</div>


`;



});



}
