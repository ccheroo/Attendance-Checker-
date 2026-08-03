// ======================================================
// ATTENDANCE CHECKER
// MAIN APPLICATION
// VERSION 8.0 FINAL
// PART 1 OF 6
// ======================================================


// ================================
// IMPORT MODULES
// ================================

import {

loadDashboard

} from "./dashboard.js";



import {

loadStudents

} from "./students.js";



import {

loadCourses

} from "./courses.js";



import {

loadSubjects

} from "./subjects.js";



import {

loadScanner

} from "./scanner.js";



import {

loadAttendance

} from "./attendance.js";



import {

loadReports

} from "./reports.js";



import {

loadSettings

} from "./settings.js";



// ================================
// GLOBAL ELEMENTS
// ================================

const mainContent =

document.getElementById(
"mainContent"
);

const sidebar =

document.getElementById(
"sidebar"
);



// ================================
// CURRENT PAGE
// ================================

let currentPage =

"dashboard";



// ================================
// PAGE LOADER
// ================================

export async function loadPage(page){

currentPage = page;

await router(page);

highlightMenu(page);

}
// ================================
// APPLICATION ROUTER
// ================================

async function router(page){

try{

switch(page){

case "dashboard":

await loadDashboard();

break;



case "students":

await loadStudents();

break;



case "courses":

await loadCourses();

break;



case "subjects":

await loadSubjects();

break;



case "scanner":

await loadScanner();

break;



case "attendance":

await loadAttendance();

break;



case "reports":

await loadReports();

break;



case "settings":

await loadSettings();

break;



default:

await loadDashboard();

break;

}

}

catch(error){

console.error(

"Router Error:",

error

);

mainContent.innerHTML = `

<div class="card">

<h2>

⚠ Module Error

</h2>

<p>

${error.message}

</p>

</div>

`;

}

}



// ================================
// MENU HIGHLIGHT
// ================================

function highlightMenu(page){

const items =

document.querySelectorAll(

"[data-page]"

);

items.forEach(item=>{

item.classList.remove("active");

if(

item.dataset.page===page

){

item.classList.add("active");

}

});

}

// ================================
// SIDEBAR NAVIGATION
// ================================

function initializeNavigation(){

const menuItems =

document.querySelectorAll(

"[data-page]"

);

menuItems.forEach(item=>{

item.addEventListener(

"click",

async()=>{

const page =

item.dataset.page;

if(!page) return;

await loadPage(page);

}

);

});

}



// ================================
// MOBILE SIDEBAR
// ================================

function initializeSidebar(){

const menuButton =

document.getElementById(
"menuButton"
);

const closeButton =

document.getElementById(
"closeSidebar"
);

if(menuButton){

menuButton.onclick = ()=>{

sidebar.classList.add("show");

};

}

if(closeButton){

closeButton.onclick = ()=>{

sidebar.classList.remove("show");

};

}

document.addEventListener(

"click",

(event)=>{

if(

window.innerWidth <= 768 &&

sidebar.classList.contains("show") &&

!sidebar.contains(event.target) &&

event.target !== menuButton

){

sidebar.classList.remove("show");

}

}

);

}



// ================================
// INITIALIZE APPLICATION
// ================================

export async function initializeApp(){

initializeNavigation();

initializeSidebar();

await loadPage("dashboard");

}

// ================================
// DOM READY
// ================================

document.addEventListener(

"DOMContentLoaded",

async()=>{

try{

await initializeApp();

}

catch(error){

console.error(

"Application Startup Error:",

error

);

mainContent.innerHTML = `

<div class="card">

<h2>

⚠ Application Error

</h2>

<p>

${error.message}

</p>

</div>

`;

}

});



// ================================
// WINDOW RESIZE
// ================================

window.addEventListener(

"resize",

()=>{

if(

window.innerWidth > 768

){

sidebar.classList.remove("show");

}

});



// ================================
// RELOAD CURRENT PAGE
// ================================

export async function reloadCurrentPage(){

await loadPage(

currentPage

);

}



// ================================
// GO TO DASHBOARD
// ================================

export async function goDashboard(){

await loadPage(

"dashboard"

);

}
// ================================
// LOGOUT
// ================================

function initializeLogout(){

const logoutButton =

document.getElementById(
"logoutButton"
);

if(!logoutButton) return;

logoutButton.addEventListener(

"click",

()=>{

const confirmed = confirm(

"Are you sure you want to logout?"

);

if(!confirmed) return;

location.reload();

}

);

}



// ================================
// PAGE TITLE
// ================================

export function setPageTitle(title){

document.title =

`${title} | Attendance Checker`;

}



// ================================
// LOADING SCREEN
// ================================

export function showLoading(message="Loading..."){

mainContent.innerHTML = `

<div class="card">

<h2>

⏳ ${message}

</h2>

</div>

`;

}



// ================================
// ERROR SCREEN
// ================================

export function showError(error){

mainContent.innerHTML = `

<div class="card">

<h2>

❌ Something went wrong

</h2>

<p>

${error}

</p>

</div>

`;

}



// ================================
// UPDATE INITIALIZATION
// ================================

const oldInitializeApp = initializeApp;

initializeApp = async function(){

initializeNavigation();

initializeSidebar();

initializeLogout();

await loadPage("dashboard");

};
// ================================
// APPLICATION STARTUP
// ================================

async function startApplication(){

try{

initializeNavigation();

initializeSidebar();

initializeLogout();

await loadPage("dashboard");

console.log(

"✅ Attendance Checker Started"

);

}

catch(error){

console.error(

"Application Startup:",

error

);

showError(

error.message

);

}

}



// ================================
// DOM READY
// ================================

document.addEventListener(

"DOMContentLoaded",

()=>{

startApplication();

});



// ================================
// GLOBAL HELPERS
// ================================

window.addEventListener(

"resize",

()=>{

if(

window.innerWidth > 768

){

sidebar.classList.remove("show");

}

});



// ================================
// EXPORTS
// ================================

export {

loadPage,

reloadCurrentPage,

goDashboard,

showLoading,

showError,

setPageTitle

};



// ================================
// MODULE READY
// ================================

console.log(

"🚀 app.js v8.0 Ready"

);
