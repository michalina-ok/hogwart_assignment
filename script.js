//MODEL

"use strict";

window.addEventListener("DOMContentLoaded", init);

let allStudents = [];
let lastNameArray;
let duplicateNameArray;
let searchField;
let currentList;
let sortedList;
let expelledStudents = [];
let prefectStudents = {
  "gryffindorPrefects": [],
  "hufflepuffPrefects": [],
  "ravenclawPrefects": [],
  "slytherinPrefects": [],
};
let studentsOfHouse = [];

//object example
const Student = {
  firstName: "",
  middleName: "",
  lastName: "",
  nickName: "",
  image: "",
  house: "",
  gender: "",
  expelled: false,
  prefect: false,
};

//object for hacking
const myObject = {
  firstName: "Michalina",
  middleName: "",
  lastName: "Oniszczuk",
  nickName: "",
  image: "",
  house: "Ravenclaw",
  gender: "girl",
  expelled: false,
  prefect: false,
};

//settings for sorting and filtering
const settings = {
  filter: "all",
  sortBy: "firstName",
  sortDir: "asc",
};

function init() {
  loadJSON();
  registerButtons();
  registerSearching();
}

function styling() {
  if (student.house === "Gryffindor") {
    document.querySelector("template#student").style.backgroundColor = "black";
  }
}

//event listeners for sorting and filtering
function registerButtons() {
  document
    .querySelectorAll("[data-action='filter']")
    .forEach((button) => button.addEventListener("click", selectFilter));

  document
    .querySelectorAll("[data-action='sort']")
    .forEach((button) => button.addEventListener("click", selectSort));
}

function findDuplicateNames() {
  lastNameArray = allStudents.map((a) => a.lastName);
  duplicateNameArray = lastNameArray.filter(
    (lastName, i, arr) =>
      arr.indexOf(lastName) === i && arr.lastIndexOf(lastName) !== i
  );

  if (duplicateNameArray.includes(student.lastName)) {
    student.image =
      student.lastName.toLowerCase() +
      "_" +
      student.firstName.toLowerCase() +
      ".png";
  }
  return duplicateNameArray;
}

function loadJSON() {
  fetch("https://petlatkea.dk/2021/hogwarts/students.json")
    .then((response) => response.json())
    .then((data) => {
      //console.log(data);

      createNewObject(data);
    });

  fetch("https://petlatkea.dk/2021/hogwarts/families.json")
    .then((response) => response.json())
    .then((families_data) => {
      console.log(families_data);
    });
}
//new object with students data
function createNewObject(data) {
  allStudents = data.map(prepareObject);
  findDuplicateNames();
  console.log(duplicateNameArray);
  buildList();
}

//cleaning the data and preparing the object
function prepareObject(jsonObject) {
  const student = Object.create(Student);

  //CLEANING THE DATA

  //FIRST NAME

  student.firstName = jsonObject.fullname.trim();
  student.firstName =
    student.firstName.substring(0, 1).toUpperCase() +
    student.firstName.substring(1, jsonObject.fullname.length).toLowerCase();
  student.firstName = student.firstName.slice(
    0,
    student.firstName.indexOf(" ")
  );

  //MIDDLE NAME
  if (
    jsonObject.fullname.indexOf(" ") != jsonObject.fullname.lastIndexOf(" ") &&
    !jsonObject.fullname.includes('"')
  ) {
    student.middleName = jsonObject.fullname.trim();
    student.middleName = student.middleName.slice(
      student.middleName.indexOf(" "),
      student.middleName.lastIndexOf(" ")
    );
    student.middleName = student.middleName.trim();
    student.middleName =
      student.middleName.substring(0, 1).toUpperCase() +
      student.middleName.substring(1, jsonObject.fullname.length).toLowerCase();
  }

  //LAST NAME

  student.lastName = jsonObject.fullname.trim();
  student.lastName = student.lastName.slice(
    student.lastName.lastIndexOf(" ") + 1,
    jsonObject.fullname.length
  );
  student.lastName =
    student.lastName[0].toUpperCase() +
    student.lastName.substring(1).toLowerCase();

  if (student.lastName.includes("-")) {
    let characterAfterHyphen = student.lastName.indexOf("-") + 1;

    student.lastName = student.lastName.replace(
      student.lastName[characterAfterHyphen],
      student.lastName[characterAfterHyphen].toUpperCase()
    );
  }

  //NICKNAME
  if (jsonObject.fullname.includes('"')) {
    student.nickName = jsonObject.fullname.trim();
    student.nickName = student.nickName.slice(
      jsonObject.fullname.indexOf(" "),
      jsonObject.fullname.lastIndexOf(" ")
    );

    //TO REMOVE THE ""
    student.nickName = student.nickName.trim();
    if (student.nickName.includes('"')) {
      student.nickName = student.nickName.substr(
        student.nickName.indexOf('"') + 1,
        student.nickName.lastIndexOf('"') - 1
      );
    }
  }

  //HOUSE

  student.house = jsonObject.house.trim();
  student.house =
    student.house.substring(0, 1).toUpperCase() +
    student.house.substring(1, student.house.length).toLowerCase();

  //GENDER

  student.gender = jsonObject.gender;

  //IMAGES

  if (student.lastName.includes("-")) {
    let secondPart = student.lastName.slice(
      student.lastName.indexOf("-") + 1,
      student.lastName.length
    );
    student.image =
      secondPart.toLowerCase() +
      "_" +
      student.firstName[0].toLowerCase() +
      ".png";
  }
  //else if() {

  // }
  else {
    student.image =
      student.lastName + "_" + student.firstName[0].toLowerCase() + ".png";
  }

  return student;
}

//FILTERING
function selectFilter(event) {
  const filter = event.target.dataset.filter;
  console.log(`Filter by ${filter}`);
  //filterList(filter);
  setFilter(filter);
}

function setFilter(filter) {
  settings.filterBy = filter;
  buildList();
}

function filterList(filteredList) {
  // let filteredList = allStudents;
  if (settings.filterBy === "gryffindor") {
    filteredList = allStudents.filter(isGryffindor).filter(isNotExpelled);
  } else if (settings.filterBy === "ravenclaw") {
    filteredList = allStudents.filter(isRavenclaw).filter(isNotExpelled);
  } else if (settings.filterBy === "hufflepuff") {
    filteredList = allStudents.filter(isHufflepuff).filter(isNotExpelled);
  } else if (settings.filterBy === "slytherin") {
    filteredList = allStudents.filter(isSlytherin).filter(isNotExpelled);
  } else if (settings.filterBy === "expelled") {
    filteredList = allStudents.filter(isExpelled);
  } else if (settings.filterBy === "non_expelled") {
    filteredList = allStudents.filter(isNotExpelled);
  } else if (settings.filterBy === "hufflepuff") {
    filteredList = allStudents.filter(isHufflepuff).filter(isNotExpelled);
  } else if (settings.filterBy === "*") {
    filteredList = allStudents.filter(isNotExpelled);
  }

  return filteredList;
}

function isGryffindor(student) {
  return student.house === "Gryffindor";
}
function isRavenclaw(student) {
  return student.house === "Ravenclaw";
}
function isSlytherin(student) {
  return student.house === "Slytherin";
}
function isHufflepuff(student) {
  return student.house === "Hufflepuff";
}

function isExpelled(student) {
  return student.expelled === true;
}

function isNotExpelled(student) {
  return student.expelled === false;
}

//SORTING

function selectSort(event) {
  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;

  // find "old" sortby element, and remove .sortBy
  const oldElement = document.querySelector(`[data-sort='${settings.sortBy}']`);
  oldElement.classList.remove("sortby");

  // indicate active sort
  event.target.classList.add("sortby");

  // toggle the direction!
  if (sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else {
    event.target.dataset.sortDirection = "asc";
  }
  console.log(`Sort by ${sortBy} - ${sortDir}`);
  setSort(sortBy, sortDir);
}

function setSort(sortBy, sortDir) {
  settings.sortBy = sortBy;
  settings.sortDir = sortDir;
  buildList();
}

function sortList(sortedList) {
  // let sortedList = allAnimals;
  let direction = 1;
  if (settings.sortDir === "desc") {
    direction = -1;
  } else {
    settings.direction = 1;
  }

  sortedList = sortedList.sort(sortByProperty);

  function sortByProperty(studentA, studentB) {
    if (studentA[settings.sortBy] < studentB[settings.sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }
  console.log(sortedList);
  return sortedList;
}

function buildList() {
  currentList = filterList(allStudents);
  sortedList = sortList(currentList);
  displayList(sortedList);
}

function registerSearching() {
  searchField = document.querySelector("#search");
  //searchField.addEventListener("keyup", searchFor);
  document.querySelector("#search_button").addEventListener("click", searchFor);
}

function searchFor() {
  const searchString = searchField.value.toLowerCase();
  console.log("searchString", searchString);
  let searchList = allStudents.filter((student) => {
    if (student.firstName.toLowerCase().includes(searchString)) {
      return true;
    } else if (student.middleName.toLowerCase().includes(searchString)) {
      return true;
    } else if (student.lastName.toLowerCase().includes(searchString)) {
      return true;
    } else if (student.nickName.toLowerCase().includes(searchString)) {
      return true;
    } else if (student.house.toLowerCase().includes(searchString)) {
      return true;
    } else if (student.gender.toLowerCase().includes(searchString)) {
      return true;
    }
  });
  displayList(searchList);
}

function displayList(students) {
  document.querySelector("#list").innerHTML = "";
  // build a new list
  styling();
  students.forEach(displayStudent);
}

function displayStudent(student) {
  // create clone
  const clone = document
    .querySelector("template#student")
    .content.cloneNode(true);
  // set clone data
  const expelButtons = clone.querySelector(".expel");
  const prefectButtons = clone.querySelector(".prefects");

  clone.querySelector(
    "#first_name"
  ).textContent = `First name: ${student.firstName}`;
  clone.querySelector(
    "#middle_name"
  ).textContent = `Middle name: ${student.middleName}`;
  clone.querySelector(
    "#last_name"
  ).textContent = `Last name: ${student.lastName}`;
  clone.querySelector(
    "#nickname"
  ).textContent = `Nickname: ${student.nickName}`;
  clone.querySelector("#image").src = "images/" + student.image;
  clone.querySelector("#house").textContent = `Belongs to ${student.house}`;
  clone.querySelector(
    "#gender"
  ).textContent = `Identifies as a ${student.gender}`;
  clone.querySelector(
    "#expelled"
  ).textContent = `Expelled: ${student.expelled}`;
  clone.querySelector("#prefect").textContent = `Prefect: ${student.prefect}`;
  expelButtons.addEventListener("click", expelStudent);
  prefectButtons.addEventListener("click", findPrefect);

  function expelStudent() {
    student.expelled = true;
    expelledStudents.push(student);

    buildList();
  }

  function findPrefect() {
   studentsOfHouse = allStudents.filter (elm=>{
       return elm.house === student.house})
      makePrefect()
      
  }

  function makePrefect() {
   if (student.house === "Gryffindor"){
      if (prefectStudents.gryffindorPrefects.length <2) {
     
      if (student.prefect === false) {
      student.prefect = true;
      prefectStudents.gryffindorPrefects.push(student);
      console.log(prefectStudents)
    }
    else {
      student.prefect = false;
      prefectStudents.gryffindorPrefects.splice(0, 1)
    }
  }
    else {
      if (student.prefect === false){
      student.prefect = false;
        console.log(prefectStudents)}
        if (student.prefect === true){
          student.prefect = false;
          prefectStudents.gryffindorPrefects.splice(0, 1)
          console.log(prefectStudents)
        }
      
      }
  
    
      buildList()
    }

    else if (student.house === "Slytherin"){
    if (prefectStudents.slytherinPrefects.length <2) {
     
      if (student.prefect === false) {
      student.prefect = true;
      prefectStudents.slytherinPrefects.push(student);
      console.log(prefectStudents)
    }
    else {
      student.prefect = false;
      prefectStudents.gryffindorPrefects.splice(0, 1)
    }
  }
    else {
      if (student.prefect === false){
      student.prefect = false;
        console.log(prefectStudents)}
        if (student.prefect === true){
          student.prefect = false;
          prefectStudents.gryffindorPrefects.splice(0, 1)
          console.log(prefectStudents)
        }
      
      }
  
    
      buildList()
}}

  displayData();

  // append clone to list
  document.querySelector("#list").appendChild(clone);

  //student.nickName = "";
  //student.middleName = "";
}

function displayData() {
  document.querySelector(
    "#students_total"
  ).innerHTML = `Number of students in total: `;
  document.querySelector(
    "#students_total"
  ).innerHTML = `Number of students in total: ${allStudents.length}`;
  document.querySelector(
    "#students_expelled"
  ).innerHTML = `Students expelled: `;
  document.querySelector(
    "#students_expelled"
  ).innerHTML = `Students expelled: ${expelledStudents.length}`;
  document.querySelector(
    "#students_non_expelled"
  ).innerHTML = `Students not expelled: `;
  document.querySelector(
    "#students_non_expelled"
  ).innerHTML = `Students not expelled: ${
    allStudents.length - expelledStudents.length
  }`;
  document.querySelector(
    "#currently_displayed"
  ).innerHTML = `Currently displayed: `;
  document.querySelector(
    "#currently_displayed"
  ).innerHTML = `Currently displayed: ${currentList.length}`;
}
