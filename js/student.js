// ==========================================
// ATTENDANCE CHECKER
// STUDENT MANAGEMENT
// VERSION 1.0
// ==========================================

let students = [];

const StudentManager = {

    add(student) {

        students.push(student);

        this.render();

    },

    remove(id) {

        students = students.filter(student => student.studentID !== id);

        this.render();

    },

    search(keyword) {

        keyword = keyword.toLowerCase();

        return students.filter(student =>

            student.fullName.toLowerCase().includes(keyword) ||

            student.studentID.toLowerCase().includes(keyword) ||

            student.course.toLowerCase().includes(keyword)

        );

    },

    render(data = students) {

        const container = document.getElementById("studentContainer");

        if (!container) return;

        container.innerHTML = "";

        if (data.length === 0) {

            container.innerHTML = `

                <div class="card">

                    <h2>No Students Yet</h2>

                    <p>Add your first student to begin using Attendance Checker.</p>

                </div>

            `;

            return;

        }

        data.forEach(student => {

            container.innerHTML += `

            <div class="card student-card">

                <img src="${student.photo}" class="student-photo">

                <h2>${student.fullName}</h2>

                <p>${student.studentID}</p>

                <p>${student.course}</p>

                <p>${student.yearLevel}</p>

                <div class="student-buttons">

                    <button class="button">

                        View

                    </button>

                    <button class="button">

                        QR Code

                    </button>

                    <button

                        class="button"

                        onclick="StudentManager.remove('${student.studentID}')">

                        Delete

                    </button>

                </div>

            </div>

            `;

        });

    }

};

window.StudentManager = StudentManager;
