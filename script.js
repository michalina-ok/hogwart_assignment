//MODEL

"use strict";

window.addEventListener("DOMContentLoaded", init);

let allStudents = [];

const Student = {
  firstName: "",
  middleName: "",
  lastName: "",
  nickName: "",
  image: "",
  house: "",
  gender: "",
};

function init() {
  loadJSON();
  registerButtons();
}

function registerButtons() {
  document.querySelector("#filter_form").addEventListener("click", filterList);
  document.querySelector("#sort_form").addEventListener("click", sortList);
}

function loadJSON() {
  fetch("https://petlatkea.dk/2021/hogwarts/students.json")
    .then((response) => response.json())
    .then((data) => {
      //console.log(data);

      createNewObject(data);
    });
}

function createNewObject(data) {
  allStudents = data.map(prepareObject);
  buildList();
}

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
  student.image =
    student.lastName + "_" + student.firstName[0].toLowerCase() + ".png";

  return student;
}

//FILTERING
function filterList(evt) {
  let filteredList;
  
    let filter = evt.target.value;
    console.log("filter by", filter);

    filteredList = allStudents.filter(houseFilter);

    function houseFilter(elm) {
      return elm.house === filter;
    }

    console.log(filteredList);
    displayList(filteredList);
  } 

  

function sortList(evt, Students) {
  function compareName(a, b) {
    if (a.firstName < b.firstName) {
      return -1;
    } else {
      return 1;
    }
  }

  function compareNameDesc(a, b) {
    if (a.firstName > b.firstName) {
      return -1;
    } else {
      return 1;
    }
  }

  // if (evt.target.value === "first_name_asc") {
  //    compareName(a, b);
  // }
  // else if (evt.target.value === "first_name_desc") {
  //   compareNameDesc(a, b);
  // }

  let sortedList = allStudents.sort(compareName);
  console.log(sortedList);
  //displayList(sortedList);
}
//SORTING

function buildList() {
  let currentList = filterList(allStudents);
  //sortedList = sortList(currentList);
  displayList(currentList);
}

function displayList(students) {
  document.querySelector("#list").innerHTML = "";
  // build a new list
  students.forEach(displayStudent);
}

function displayStudent(student) {
  // create clone
  const clone = document
    .querySelector("template#student")
    .content.cloneNode(true);
  // set clone data

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

  // append clone to list
  document.querySelector("#list").appendChild(clone);

  //student.nickName = "";
  //student.middleName = "";
}
