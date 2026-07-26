// ======================================================
// ATTENDANCE CHECKER
// FIRESTORE STUDENT MANAGEMENT
// VERSION 4.1 QR READY CLEAN
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
            "Students loaded:",
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

            student.photo || "",



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
            "Add student error:",
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
// SEARCH
// ================================

export function searchStudents(keyword){



    keyword =
    keyword
    .toLowerCase()
    .trim();




    const result =

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



    renderStudents(result);



}

// ================================
// DISPLAY STUDENTS
// ================================

export function renderStudents(data = students){



const container =
document.getElementById(
"studentContainer"
);



if(!container)
return;




container.innerHTML="";






if(data.length===0){


container.innerHTML=`


<div class="empty-card">

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


const name =
student.fullName ||
"Unknown Student";



const initial =
name
.charAt(0)
.toUpperCase();





container.innerHTML += `


<div class="student-card">


<div class="student-avatar">

${initial}

</div>



<div 
class="qr-box"
id="qr-${student.id}">
</div>




<div class="student-info">


<h2>

${name}

</h2>



<p>

<strong>
ID:
</strong>

${student.studentID || "N/A"}

</p>



<p>

<strong>
Course:
</strong>

${student.course || "N/A"}

</p>



<p>

<strong>
Year:
</strong>

${student.yearLevel || "N/A"}

</p>



<button

class="delete-btn"

onclick="removeStudent('${student.id}')">


Delete


</button>



</div>



</div>


`;



});





// ================================
// GENERATE QR CODES
// ================================


setTimeout(()=>{


data.forEach(student=>{


const qrBox =
document.getElementById(
"qr-"+student.id
);



if(qrBox){


qrBox.innerHTML="";



new QRCode(

qrBox,

{

text:

student.qrCode ||

student.studentID,


width:120,


height:120


}

);



}


});


},300);





}

// ================================
// GET STUDENT
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
// FILTER COURSE
// ================================

export function filterStudentsByCourse(course){


const result =

students.filter(student=>{


return student.course === course;


});



renderStudents(result);



}








// ================================
// GET ALL STUDENTS
// ================================

export function getStudents(){


return students;


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








// GLOBAL DELETE BUTTON

window.removeStudent =
deleteStudent;
