// ======================================================
// ATTENDANCE CHECKER
// FIRESTORE STUDENT MANAGEMENT
// VERSION 5.0 STABLE
// PART 1
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

const studentCollection = collection(db, "students");



// ================================
// LOAD STUDENTS
// ================================

export async function loadStudents(){

    try{

        const snapshot = await getDocs(studentCollection);

        students = [];

        snapshot.forEach(item=>{

            students.push({

                id:item.id,

                ...item.data()

            });

        });

        console.log(
            "Students Loaded:",
            students.length
        );

        renderStudents();

    }

    catch(error){

        console.error(
            "Load Students Error:",
            error
        );

    }

}



// ================================
// ADD STUDENT
// ================================

export async function addStudent(student){

    try{

        await addDoc(

            studentCollection,

            {

                fullName:
                student.fullName,

                studentID:
                student.studentID,

                qrCode:
                student.qrCode ||
                student.studentID,

                college:
                student.college,

                course:
                student.course,

                yearLevel:
                student.yearLevel,

                section:
                student.section,

                photo:
                student.photo || "",

                createdAt:
                serverTimestamp()

            }

        );

        await loadStudents();

        return true;

    }

    catch(error){

        console.error(
            "Save Student Error:",
            error
        );

        alert(
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
            "Update Student Error:",
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
            "Student deleted successfully."
        );

    }

    catch(error){

        console.error(
            "Delete Student Error:",
            error
        );

        alert(
            error.message
        );

    }

}



// ================================
// SEARCH STUDENTS
// ================================

export function searchStudents(keyword){

    keyword =
    keyword
    .toLowerCase()
    .trim();

    const filtered =
    students.filter(student=>{

        return(

            (student.fullName || "")
            .toLowerCase()
            .includes(keyword)

            ||

            (student.studentID || "")
            .toLowerCase()
            .includes(keyword)

            ||

            (student.college || "")
            .toLowerCase()
            .includes(keyword)

            ||

            (student.course || "")
            .toLowerCase()
            .includes(keyword)

            ||

            (student.section || "")
            .toLowerCase()
            .includes(keyword)

        );

    });

    renderStudents(filtered);

}
// ================================
// DISPLAY STUDENTS
// ================================

export function renderStudents(data = students){

    const container =
    document.getElementById("studentContainer");

    if(!container) return;

    container.innerHTML = "";

    if(data.length === 0){

        container.innerHTML = `

        <div class="empty-card">

            <h2>No Students Yet</h2>

            <p>Register your first student.</p>

        </div>

        `;

        return;

    }

    data.forEach(student=>{

        const initial =
        (student.fullName || "?")
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

                    ${student.fullName}

                </h2>

                <p>

                    <strong>ID:</strong>

                    ${student.studentID}

                </p>

                <p>

                    <strong>College:</strong>

                    ${student.college || "N/A"}

                </p>

                <p>

                    <strong>Course:</strong>

                    ${student.course || "N/A"}

                </p>

                <p>

                    <strong>Year:</strong>

                    ${student.yearLevel || "N/A"}

                </p>

                <p>

                    <strong>Section:</strong>

                    ${student.section || "N/A"}

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

    // ==========================
    // QR CODE GENERATOR
    // ==========================

    setTimeout(()=>{

        data.forEach(student=>{

            const qrBox =
            document.getElementById(
                "qr-" + student.id
            );

            if(!qrBox) return;

            qrBox.innerHTML = "";

            new QRCode(qrBox,{

                text:
                student.qrCode ||
                student.studentID,

                width:120,

                height:120

            });

        });

    },200);

}



// ================================
// GETTERS
// ================================

export function getStudent(id){

    return students.find(

        student => student.id === id

    );

}



export function getStudents(){

    return students;

}



export function getStudentCount(){

    return students.length;

}



export function filterStudentsByCourse(course){

    renderStudents(

        students.filter(

            student => student.course === course

        )

    );

}



export function resetStudentSearch(){

    renderStudents();

}



// ================================
// GLOBALS
// ================================

window.removeStudent = deleteStudent;

console.log("👨‍🎓 Student Module Ready");
