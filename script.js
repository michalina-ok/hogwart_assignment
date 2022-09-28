//MODEL

"use strict";

window.addEventListener("DOMContentLoaded", init);

let allStudents = [];
let bloodData;
let bloodList;
let halfBloodStudents = [];
let pureBloodStudents = [];
let lastNameArray;
let duplicateNameArray;
let searchField;
let currentList;
let sortedList;
let expelledStudents = [];
let prefectStudents = {
  Gryffindor: [],
  Hufflepuff: [],
  Ravenclaw: [],
  Slytherin: [],
};
let inquisitorialSquadStudents = [];
let studentsOfHouse = [];
let isHacked = false;

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
  inquisitorialSquad: false,
  bloodStatus: "default",
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
  inquisitorialSquad: false,
  bloodStatus: "half",
};

//settings for sorting and filtering
const settings = {
  filter: "all",
  sortBy: "firstName",
  sortDir: "asc",
};

async function init() {
  await loadJSON();
  await loadBloodStatusJSON();
  registerButtons();
  registerSearching();
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


function loadJSON() {
  fetch("https://petlatkea.dk/2021/hogwarts/students.json")
    .then((response) => response.json())
    .then((data) => {
      //console.log(data);

      createNewObject(data);
    });
}

//new object with students data
function createNewObject(data) {
  allStudents = data.map(prepareObject);

  //findDuplicateNames();
  //console.log(duplicateNameArray);
  buildList();
}

function loadBloodStatusJSON() {
  fetch("https://petlatkea.dk/2021/hogwarts/families.json")
    .then((response) => response.json())
    .then((data) => {
      createBloodObject(data);
    });
}

function createBloodObject(data) {
  halfBloodStudents = data.half;
  pureBloodStudents = data.pure;
  //console.log(halfBloodStudents);
  //console.log(pureBloodStudents);
  assignBloodStatus();
  buildList();
}

function assignBloodStatus() {
  allStudents.forEach((student) => {
    if (pureBloodStudents.includes(student.lastName)) {
      student.bloodStatus = "pure";
    } else if (halfBloodStudents.includes(student.lastName)) {
      student.bloodStatus = "half";
    } else {
      student.bloodStatus = "muggle";
    }
  });
}

//cleaning the data and preparing the object
function prepareObject(jsonObject) {
  const student = Object.create(Student);

  //CLEANING THE DATA

  //FIRST NAME

  if (jsonObject.fullname.includes(!" ")) {
    student.firstName = jsonObject.fullname;
  } else {
    student.firstName = jsonObject.fullname.trim();
    student.firstName =
      student.firstName.substring(0, 1).toUpperCase() +
      student.firstName.substring(1, jsonObject.fullname.length).toLowerCase();
    student.firstName = student.firstName.slice(
      0,
      student.firstName.indexOf(" ")
    );
  }

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
  if (student.lastName.includes(" ")) {
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
  } else {
    student.lastName = "";
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

  else if (student.lastName.includes("Patil")) {
    student.image =
        student.lastName.toLowerCase() +  "_" + student.firstName.toLowerCase() +  ".png";
       
  }

  //else if() {

  // }
  else {
    student.image =
      student.lastName + "_" + student.firstName[0].toLowerCase() + ".png";
  }

  //BLOOD STATUS

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
  document.querySelector("body").addEventListener("keydown", hackTheSystem);
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
  const expelButtons = clone.querySelector(".expel");
  const prefectButtons = clone.querySelector(".prefects");
  const inquisitorialButtons = clone.querySelector(".inquisitorial_squad");
  const moreDetailsButtons = clone.querySelector(".more_details");

  //STYLING

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
  clone.querySelector("#image").src = "./images/" + student.image;
  clone.querySelector("#house").textContent = `Belongs to ${student.house}`;
  clone.querySelector(
    "#gender"
  ).textContent = `Identifies as a ${student.gender}`;
  clone.querySelector(
    "#expelled"
  ).textContent = `Expelled: ${student.expelled}`;
  clone.querySelector("#prefect").textContent = `Prefect: ${student.prefect}`;
  clone.querySelector(
    "#blood_status"
  ).textContent = `Blood status: ${student.bloodStatus}`;
  clone.querySelector(
    "#inquisitorial_squad_status"
  ).textContent = `Inquisitorial squad: ${student.inquisitorialSquad}`;
  expelButtons.addEventListener("click", expelStudent);
  prefectButtons.addEventListener("click", makePrefect);
  inquisitorialButtons.addEventListener("click", makeInquisitorial);
  moreDetailsButtons.addEventListener("click", showPopup);

  function showPopup() {
    document.querySelector(".popup_wrapper").classList.toggle("show");
    document.querySelector(
      ".popup h1"
    ).textContent = `${student.firstName} ${student.nickName} ${student.middleName} ${student.lastName}`;
    document.querySelector("#image_popup").src = "./images/" + student.image;
    document.querySelector(
      "#blood_popup"
    ).textContent = `Is of ${student.bloodStatus} blood`;
    document.querySelector(
      "#prefect_popup"
    ).textContent = `Is prefect: ${student.prefect}`;
    document.querySelector(
      "#expelled_popup"
    ).textContent = `Is expelled: ${student.expelled}`;
    document.querySelector(
      "#inquisitorial_popup"
    ).textContent = `Is a member of an inquisitorial squad: ${student.inquisitorialSquad}`;

    document
      .querySelector(".popup_wrapper")
      .addEventListener("click", hidePopup);

    styling();
  }

  function styling() {
    if (student.house === "Slytherin") {
      document.querySelector(".popup").style.borderImage =
        "linear-gradient(#1A472A, #5D5D5D) 40";
    } else if (student.house === "Gryffindor") {
      document.querySelector(".popup").style.borderImage =
        "linear-gradient(#740001, #EEBA30) 30";
    } else if (student.house === "Hufflepuff") {
      document.querySelector(".popup").style.borderImage =
        "linear-gradient(#FFD800, #000000) 30";
    } else if (student.house === "Ravenclaw") {
      document.querySelector(".popup").style.borderImage =
        "linear-gradient(#946B2D, #0E1A40) 30";
    }
  }

  function hidePopup() {
    document.querySelector(".popup_wrapper").classList.remove("show");
  }

  function expelStudent() {
    student.expelled = true;
    expelledStudents.push(student);

    if (student.firstName === "Michalina")
      alert("This student cannot be expelled!");

    buildList();
  }

  function makePrefect() {
    console.log(student.house);
    if (student.house === "Gryffindor") {
      if (prefectStudents.Gryffindor.length < 2) {
        if (student.prefect === false) {
          student.prefect = true;
          prefectStudents.Gryffindor.push(student);
          console.log(prefectStudents);
        } else {
          student.prefect = false;
          prefectStudents.Gryffindor.splice(0, 1);
        }
      } else {
        if (student.prefect === false) {
          student.prefect = false;
          console.log(prefectStudents);
        }
        if (student.prefect === true) {
          student.prefect = false;
          prefectStudents.Gryffindor.splice(0, 1);
          console.log(prefectStudents);
        }
      }

      buildList();
    } else if (student.house === "Slytherin") {
      if (prefectStudents.Slytherin.length < 2) {
        if (student.prefect === false) {
          student.prefect = true;
          prefectStudents.Slytherin.push(student);
          console.log(prefectStudents);
        } else {
          student.prefect = false;
          prefectStudents.Slytherin.splice(0, 1);
        }
      } else {
        if (student.prefect === false) {
          student.prefect = false;
          console.log(prefectStudents);
        }
        if (student.prefect === true) {
          student.prefect = false;
          prefectStudents.Slytherin.splice(0, 1);
          console.log(prefectStudents);
        }
      }

      buildList();
    } else if (student.house === "Hufflepuff") {
      if (prefectStudents.Hufflepuff.length < 2) {
        if (student.prefect === false) {
          student.prefect = true;
          prefectStudents.Hufflepuff.push(student);
          console.log(prefectStudents);
        } else {
          student.prefect = false;
          prefectStudents.Hufflepuff.splice(0, 1);
        }
      } else {
        if (student.prefect === false) {
          student.prefect = false;
          console.log(prefectStudents);
        }
        if (student.prefect === true) {
          student.prefect = false;
          prefectStudents.Hufflepuff.splice(0, 1);
          console.log(prefectStudents);
        }
      }

      buildList();
    } else if (student.house === "Ravenclaw") {
      if (prefectStudents.Ravenclaw.length < 2) {
        if (student.prefect === false) {
          student.prefect = true;
          prefectStudents.Ravenclaw.push(student);
          console.log(prefectStudents);
        } else {
          student.prefect = false;
          prefectStudents.Ravenclaw.splice(0, 1);
        }
      } else {
        if (student.prefect === false) {
          student.prefect = false;
          console.log(prefectStudents);
        }
        if (student.prefect === true) {
          student.prefect = false;
          prefectStudents.Ravenclaw.splice(0, 1);
          console.log(prefectStudents);
        }
      }

      buildList();
    }
  }

  function makeInquisitorial() {
    if (
      (student.house === "Slytherin" && student.bloodStatus === "pure") ||
      student.bloodStatus === "pure"
    ) {
      if (student.inquisitorialSquad === false) {
        student.inquisitorialSquad = true;
        inquisitorialSquadStudents.push(student);
        console.log(inquisitorialSquadStudents);
        if (isHacked) {
          console.log("IS HACKED");
          setTimeout(unmakeInquisitorial, 5000);
        }
      } else if (student.inquisitorialSquad === true) {
        student.inquisitorialSquad = false;
        inquisitorialSquadStudents.pop(student);
        console.log(inquisitorialSquadStudents);
      }
      buildList();
    } else {
      alert(
        "You can only add students from Slytherin or pure-blood students to the Inquisitorial Squad"
      );
    }
    function unmakeInquisitorial() {
      console.log(
        "inquisitorialSquad after timeout",
        inquisitorialSquadStudents
      );
      if (student.inquisitorialSquad === true) {
        student.inquisitorialSquad = false;
        inquisitorialSquadStudents.pop(student);
      }
      buildList();
    }
  }

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

function hackTheSystem() {
  isHacked = true;
  console.log("system hacked");

  //STYLING
  document.querySelector('body').style.backgroundColor = '#414141'
  document.querySelector('body').style.color = '#39FF14'


  //ADDING MYSELF TO THE ARRAY
  allStudents.push(myObject);

  //ASSIGNING RANDOM BLOOD STATUS
  allStudents.forEach((student) => {
    let randomNumber = Math.floor(Math.random() * 3);
    if (pureBloodStudents.includes(student.lastName)) {
      if (randomNumber === 0) {
        student.bloodStatus = "half";
      } else if (randomNumber === 1) {
        student.bloodStatus = "muggle";
      } else {
        student.bloodStatus = "pure";
      }
    } else if (halfBloodStudents.includes(student.lastName)) {
      student.bloodStatus = "pure";
    } else {
      student.bloodStatus = "pure";
    }
  });

  buildList();

  
}

 
 







