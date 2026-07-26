// ======================================================
// ATTENDANCE CHECKER
// STUDENT MANAGEMENT MODULE
// VERSION 1.1
// ======================================================


let students = [];


// ADD STUDENT

export function addStudent(student){

    students.push(student);

    renderStudents();

}



// DELETE STUDENT

export function deleteStudent(id){

    students = students.filter(student => 
        student.studentID !== id
    );

    renderStudents();

}



// SEARCH STUDENT

export function searchStudents(keyword){

    keyword = keyword.toLowerCase();


    const filtered = students.filter(student =>

        student.fullName.toLowerCase().includes(keyword)

        ||

        student.studentID.toLowerCase().includes(keyword)

        ||

        student.course.toLowerCase().includes(keyword)

    );


    renderStudents(filtered);

}



// DISPLAY STUDENTS

export function renderStudents(data = students){


    const container = document.getElementById(
        "studentContainer"
    );


    if(!container) return;



    container.innerHTML = "";



    if(data.length === 0){

        container.innerHTML = `

        <div class="card">

        <h2>No Students Added</h2>

        <p>
        Add students to create your attendance list.
        </p>

        </div>

        `;

        return;

    }



    data.forEach(student=>{


        container.innerHTML += `

        <div class="card">


        <img 
        src="${student.photo}"
        style="
        width:120px;
        height:120px;
        border-radius:50%;
        object-fit:cover;
        ">


        <h2>
        ${student.fullName}
        </h2>


        <p>
        ID: ${student.studentID}
        </p>


        <p>
        ${student.course}
        </p>


        <p>
        ${student.yearLevel}
        </p>


        <button 
        class="button"
        onclick="removeStudent('${student.studentID}')">

        Delete

        </button>


        </div>

        `;


    });


}



window.removeStudent = deleteStudent;
