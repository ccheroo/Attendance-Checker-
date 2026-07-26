// ================================
// ATTENDANCE CHECKER
// APP
// ================================

const mainContent = document.getElementById("mainContent");
const menuButtons = document.querySelectorAll(".menu");

menuButtons.forEach(button => {

    button.addEventListener("click", () => {

        menuButtons.forEach(b => b.classList.remove("active"));
        button.classList.add("active");

        loadPage(button.dataset.page);

    });

});

function loadPage(page){

    switch(page){

        case "dashboard":
            dashboard();
            break;

        case "students":
            students();
            break;

        case "courses":
            placeholder("Courses");
            break;

        case "subjects":
            placeholder("Subjects");
            break;

        case "scanner":
            placeholder("Scanner");
            break;

        case "attendance":
            placeholder("Attendance");
            break;

        case "reports":
            placeholder("Reports");
            break;

        case "settings":
            placeholder("Settings");
            break;

    }

}

function dashboard(){

    mainContent.innerHTML = `

        <h1 class="page-title">Dashboard</h1>

        <div class="grid">

            <div class="card">
                <h2>Total Students</h2>
                <h1>0</h1>
            </div>

            <div class="card">
                <h2>Present Today</h2>
                <h1>0</h1>
            </div>

            <div class="card">
                <h2>Subjects</h2>
                <h1>0</h1>
            </div>

            <div class="card">
                <h2>Attendance Rate</h2>
                <h1>0%</h1>
            </div>

        </div>

    `;

}

function students(){

    mainContent.innerHTML = `

        <h1 class="page-title">Students</h1>

        <div class="card">

            <h2>Add Student</h2>

            <input id="fullName" placeholder="Full Name">

            <input id="studentID" placeholder="Student ID">

            <input id="course" placeholder="Course">

            <input id="yearLevel" placeholder="Year Level">

            <input id="photo" placeholder="Photo URL (temporary)">

            <button class="button" id="addStudentBtn">
                Add Student
            </button>

        </div>

        <div class="card" style="margin-top:25px">

            <input
                id="searchStudent"
                placeholder="Search student...">

        </div>

        <div
            id="studentContainer"
            class="grid"
            style="margin-top:25px">

        </div>

    `;

}

function placeholder(title){

    mainContent.innerHTML = `

        <h1 class="page-title">${title}</h1>

        <div class="card">

            <h2>${title}</h2>

            <p>This module will be built next.</p>

        </div>

    `;

}

loadPage("dashboard");
