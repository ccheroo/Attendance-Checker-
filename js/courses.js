// ======================================================
// ATTENDANCE CHECKER
// COURSES MANAGEMENT
// VERSION 5.1 STABLE
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

const courseCollection = collection(db, "courses");

let courses = [];



// ======================================
// LOAD COURSES
// ======================================

export async function loadCourses(){

    try{

        const snapshot = await getDocs(courseCollection);

        courses = [];

        snapshot.forEach(item=>{

            courses.push({

                id:item.id,

                ...item.data()

            });

        });

        console.log("Courses Loaded:", courses);

        renderCourses();

    }

    catch(error){

        console.error("Load Courses Error:", error);

    }

}



// ======================================
// ADD COURSE
// ======================================

export async function addCourse(course){

    try{

        await addDoc(courseCollection,{

            college:course.college,

            course:course.course,

            code:course.code,

            createdAt:serverTimestamp()

        });

        await loadCourses();

        return true;

    }

    catch(error){

        console.error(error);

        alert(error.message);

        return false;

    }

}



// ======================================
// DELETE COURSE
// ======================================

export async function deleteCourse(id){

    if(!confirm("Delete this course?")) return;

    try{

        await deleteDoc(

            doc(db,"courses",id)

        );

        await loadCourses();

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

}



// ======================================
// SEARCH
// ======================================

export function searchCourses(keyword){

    keyword = keyword.toLowerCase().trim();

    const filtered = courses.filter(item=>{

        return(

            (item.college || "")
            .toLowerCase()
            .includes(keyword)

            ||

            (item.course || "")
            .toLowerCase()
            .includes(keyword)

            ||

            (item.code || "")
            .toLowerCase()
            .includes(keyword)

        );

    });

    renderCourses(filtered);

}



// ======================================
// GETTERS
// ======================================

export function getCourses(){

    return courses;

}



export function getColleges(){

    return [...new Set(

        courses.map(item=>item.college)

    )];

}



export function getCoursesByCollege(college){

    return courses.filter(

        item=>item.college===college

    );

}



// ======================================
// DISPLAY
// ======================================

export function renderCourses(data = courses){

    const container = document.getElementById("courseContainer");

    if(!container) return;

    container.innerHTML = "";

    if(data.length===0){

        container.innerHTML=`

        <div class="empty-card">

            <h2>No Courses Yet</h2>

            <p>Add your first course.</p>

        </div>

        `;

        return;

    }

    const grouped = {};

    data.forEach(course=>{

        if(!grouped[course.college]){

            grouped[course.college]=[];

        }

        grouped[course.college].push(course);

    });

    Object.keys(grouped).forEach(college=>{

        container.innerHTML += `

        <div class="card">

            <h2>🏫 ${college}</h2>

            <div class="course-group" id="college-${college.replace(/\s+/g,"-")}"></div>

        </div>

        `;

        const groupContainer = document.getElementById(

            `college-${college.replace(/\s+/g,"-")}`

        );

        grouped[college].forEach(course=>{

            groupContainer.innerHTML += `

            <div class="student-card">

                <div class="student-avatar">

                    📘

                </div>

                <div class="student-info">

                    <h2>${course.course}</h2>

                    <p>

                        <strong>Course Code:</strong>

                        ${course.code}

                    </p>

                    <button

                        class="delete-btn"

                        onclick="removeCourse('${course.id}')">

                        Delete

                    </button>

                </div>

            </div>

            `;

        });

    });

}

window.removeCourse = deleteCourse;

console.log("📚 Courses Module Ready");
