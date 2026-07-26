// ======================================================
// ATTENDANCE CHECKER
// STUDENT MANAGEMENT MODULE
// VERSION 1.0
// ======================================================


let students = [];


// =======================================
// ADD STUDENT
// =======================================

export function addStudent(student){


    students.push(student);


    renderStudents();


}



// =======================================
// DELETE STUDENT
// =======================================

export function deleteStudent(id){


    students = students.filter(student =>

        student.studentID !== id

    );


    renderStudents();


}



// =======================================
// SEARCH STUDENT
// =======================================

export function searchStudents(keyword){


    keyword = keyword.toLowerCase();


    const result = students.filter(student =>

        student.fullName
        .toLowerCase()
        .includes(keyword)

        ||

        student.studentID
        .toLowerCase()
        .includes(keyword)

        ||

        student.course
        .toLowerCase()
        .includes(keyword)


    );


    renderStudents(result);


}



// =======================================
// DISPLAY STUDENTS
// =======================================

export function renderStudents(data = students){


    const container = document.getElementById(
        "studentContainer"
    );


    if(!container) return;



    container.innerHTML = "";



    if(data.length === 0){


        container.innerHTML = `


        <div class="card">


            <h2>
            No Students Added
            </h2>


            <p>
            Register students to begin creating QR attendance.
            </p>


        </div>


        `;


        return;


    }




    data.forEach(student => {



        container.innerHTML += `



        <div class="card student-card">


            <img

            src="${student.photo}"

            class="student-photo"


            >



            <h2>

            ${student.fullName}

            </h2>



            <p>

            Student ID:
            ${student.studentID}

            </p>



            <p>

            Course:
            ${student.course}

            </p>



            <p>

            Year:
            ${student.yearLevel}

            </p>




            <button

            class="button"

            onclick="deleteStudent('${student.studentID}')"

            >

            Delete

            </button>



        </div>



        `;



    });


}



// =======================================
// EXPOSE FUNCTION
// =======================================

window.deleteStudent = deleteStudent;
