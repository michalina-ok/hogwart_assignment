"use strict";

window.addEventListener("DOMContentLoaded", init);

let students;
let students_array = [];
let house_list;
let firstname_list;
let middlename_list;
let lastname_list;
let nickname_list;
let image_list;

function init() {
  loadJSON();
}

function loadJSON() {
  fetch("https://petlatkea.dk/2021/hogwarts/students.json")
    .then((response) => response.json())
    .then((data) => {
      students = data;

      // when loaded, display the list
      displayList();
    });
}

function displayList() {
  // build a new list
  students.forEach(displayStudent);
}

function displayStudent(student) {
  // create clone
  const clone = document
    .querySelector("template#student")
    .content.cloneNode(true);


    // CLEANING THE DATA

  //HOUSE

  house_list = student.house.trim();
  house_list =
    house_list.substring(0, 1).toUpperCase() +
    house_list.substring(1, student.house.length).toLowerCase();

  //FIRST NAME
  firstname_list = student.fullname.trim();
  firstname_list =
    firstname_list.substring(0, 1).toUpperCase() +
    firstname_list.substring(1, student.fullname.length).toLowerCase();
  firstname_list = firstname_list.slice(0, firstname_list.indexOf(" "));
  //console.log(firstname_list);

  //MIDDLE NAME
  if (
    student.fullname.indexOf(" ") != student.fullname.lastIndexOf(" ") &&
    !student.fullname.includes('"')
  ) {
    middlename_list = student.fullname.trim();
    middlename_list = middlename_list.slice(
      middlename_list.indexOf(" "),
      middlename_list.lastIndexOf(" ")
    );
    middlename_list = middlename_list.trim();
    middlename_list =
      middlename_list.substring(0, 1).toUpperCase() +
      middlename_list.substring(1, student.fullname.length).toLowerCase();
  }

  //LAST NAME

  lastname_list = student.fullname.trim();
  lastname_list = lastname_list.slice(
    lastname_list.lastIndexOf(" ") + 1,
    student.fullname.length
  );
  lastname_list =
  lastname_list[0].toUpperCase() +
  lastname_list.substring(1).toLowerCase();
  

if (lastname_list.includes('-')) {
  let characterAfterHyphen = lastname_list.indexOf('-') + 1;

  lastname_list = lastname_list.replace(lastname_list[characterAfterHyphen], lastname_list[characterAfterHyphen].toUpperCase());
  
}

  console.log(lastname_list)

  //NICKNAME
    if (student.fullname.includes('"')) {
        nickname_list = student.fullname.trim();
        nickname_list = nickname_list.slice(
          student.fullname.indexOf(" "),
          student.fullname.lastIndexOf(" ")
        );

        //TO REMOVE THE ""
        nickname_list = nickname_list.trim();
        if (nickname_list.includes('"')) {
          nickname_list = nickname_list.substr(nickname_list.indexOf('"') + 1, nickname_list.lastIndexOf('"')-1)
        }
        console.log(nickname_list)
    }

   

    //IMAGES

    image_list = lastname_list + '_' + firstname_list[0].toLowerCase() + '.png';
    


  



  // set clone data
  clone.querySelector("#gender").textContent = `Identifies as a ${student.gender}`;
  clone.querySelector("#first_name").textContent = `First name: ${firstname_list}`;
  clone.querySelector("#middle_name").textContent = `Middle name: ${middlename_list}`;
  clone.querySelector("#last_name").textContent = `Last name: ${lastname_list}`;
  clone.querySelector("#nickname").textContent = `Nickname: ${nickname_list}`;
  clone.querySelector("#image").src = "images/" + image_list;
  clone.querySelector("#house").textContent = `Belongs to ${house_list}`;
  // append clone to list
  document.querySelector("#list").appendChild(clone);
  
  nickname_list = '';
  middlename_list = '';
}


