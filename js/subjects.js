// ======================================================
// ATTENDANCE CHECKER
// FIRESTORE SUBJECT MANAGEMENT
// VERSION 1.1 POLISHED
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



let subjects = [];



const subjectCollection =
collection(db,"subjects");






// ================================
// LOAD SUBJECTS
// ================================

export async function loadSubjects(){


    try{


        const snapshot =
        await getDocs(subjectCollection);



        subjects=[];



        snapshot.forEach(item=>{


            subjects.push({

                id:item.id,

                ...item.data()

            });


        });



        renderSubjects();



        console.log(
            "Subjects loaded:",
            subjects.length
        );



    }


    catch(error){


        console.error(
            "Load subjects error:",
            error
        );


    }


}









// ================================
// ADD SUBJECT
// ================================

export async function addSubject(subject){


    try{


        await addDoc(

            subjectCollection,

            {


                name:
                subject.name,


                code:
                subject.code,


                instructor:
                subject.instructor || "Not Assigned",


                createdAt:
                serverTimestamp()


            }

        );



        await loadSubjects();



        return true;



    }



    catch(error){


        console.error(
            "Add subject error:",
            error
        );


        alert(
            error.message
        );


        return false;


    }


}









// ================================
// DELETE SUBJECT
// ================================

export async function deleteSubject(id){


    try{


        await deleteDoc(

            doc(

                db,

                "subjects",

                id

            )

        );



        await loadSubjects();



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
// DISPLAY SUBJECTS
// ================================

export function renderSubjects(){



const container =
document.getElementById(
"subjectContainer"
);



if(!container)
return;





container.innerHTML="";






if(subjects.length===0){


container.innerHTML=`

<div class="empty-card">

<h2>No Subjects Yet</h2>

<p>Add your first subject.</p>

</div>

`;


return;


}








subjects.forEach(subject=>{



container.innerHTML+=`


<div class="student-card">


<div class="student-avatar">

${subject.code.charAt(0)}

</div>




<div class="student-info">


<h2>

${subject.name}

</h2>



<p>

<strong>
Code:
</strong>

${subject.code}

</p>




<p>

<strong>
Instructor:
</strong>

${subject.instructor || "Not Assigned"}

</p>





<button

class="delete-btn"

onclick="removeSubject('${subject.id}')">

Delete

</button>



</div>



</div>


`;



});



}




// ================================
// GET ALL SUBJECTS
// ================================

export function getSubjects(){

    return subjects;

}


window.removeSubject =
deleteSubject;
