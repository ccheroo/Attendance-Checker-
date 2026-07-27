// ======================================================
// ATTENDANCE CHECKER
// COURSES MANAGEMENT
// VERSION 5.0
// ======================================================

import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    serverTimestamp,
    orderBy,
    query
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const courseCollection = collection(db, "courses");

let courses = [];



// ======================================
// LOAD COURSES
// ======================================

export async function loadCourses() {

    try {

        const snapshot = await getDocs(
            query(
                courseCollection,
                orderBy("college"),
                orderBy("course")
            )
        );

        courses = [];

        snapshot.forEach(docItem => {

            courses.push({

                id: docItem.id,

                ...docItem.data()

            });

        });

        renderCourses();

    }

    catch (error) {

        console.error(error);

    }

}



// ======================================
// ADD COURSE
// ======================================

export async function addCourse(course) {

    try {

        await addDoc(

            courseCollection,

            {

                college: course.college,

                course: course.course,

                code: course.code,

                createdAt: serverTimestamp()

            }

        );

        await loadCourses();

        return true;

    }

    catch (error) {

        console.error(error);

        alert(error.message);

        return false;

    }

}



// ======================================
// DELETE COURSE
// ======================================

export async function deleteCourse(id) {

    if (!confirm("Delete this course?")) return;

    try {

        await deleteDoc(

            doc(db, "courses", id)

        );

        await loadCourses();

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

}



// ======================================
// GET COURSES
// ======================================

export function getCourses() {

    return courses;

}



// ======================================
// GET COURSES BY COLLEGE
// ======================================

export function getCoursesByCollege(college) {

    return courses.filter(item => item.college === college);

}



// ======================================
// GET COLLEGES
// ======================================

export function getColleges() {

    return [...new Set(

        courses.map(item => item.college)

    )];

}



// ======================================
// SEARCH
// ======================================

export function searchCourses(keyword) {

    keyword = keyword.toLowerCase();

    const filtered = courses.filter(item => {

        return (

            item.course.toLowerCase().includes(keyword)

            ||

            item.code.toLowerCase().includes(keyword)

            ||

            item.college.toLowerCase().includes(keyword)

        );

    });

    renderCourses(filtered);

}



// ======================================
// DISPLAY
// ======================================

export function renderCourses(data = courses) {

    const container = document.getElementById("courseContainer");

    if (!container) return;

    container.innerHTML = "";

    if (data.length === 0) {

        container.innerHTML = `

        <div class="empty-card">

            <h2>No Courses</h2>

            <p>Add your first course.</p>

        </div>

        `;

        return;

    }

    let grouped = {};

    data.forEach(course => {

        if (!grouped[course.college]) {

            grouped[course.college] = [];

        }

        grouped[course.college].push(course);

    });

    Object.keys(grouped).forEach(college => {

        container.innerHTML += `

        <div class="card">

            <h2>🏫 ${college}</h2>

            <div id="college-${college.replace(/\s/g,'')}"></div>

        </div>

        `;

        const collegeBox = document.getElementById(

            `college-${college.replace(/\s/g,'')}`

        );

        grouped[college].forEach(course => {

            collegeBox.innerHTML += `

            <div class="student-card">

                <div class="student-avatar">

                    📘

                </div>

                <div class="student-info">

                    <h2>${course.course}</h2>

                    <p>

                        <strong>Code:</strong>

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
