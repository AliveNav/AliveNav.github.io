var elPosleft = [];
var elPosTop = [];

// enable and disable buttons

// Header part Welcome text and show random number
const firstLine = $("#first-line"),
  secondLine = $("#second-line");

firstLine.html("Übung 1");
secondLine.html("Ziehen und Ablegen");

//header part  number slider

const rangeInput = document.querySelectorAll(".range-input input"),
  valueInput = document.querySelectorAll(".value-input input"),
  progress = document.querySelector(".slider .progress");

let valueGap = 100;

valueInput.forEach((input) => {
  // getting two inputs value and parsing them to interger number
  input.addEventListener("input", (e) => {
    let minVal = parseInt(valueInput[0].value),
      maxVal = parseInt(valueInput[1].value);

    if (maxVal - minVal >= valueGap && maxVal <= 10000) {
      if (e.target.className === "input-min") {
        // if active input is min input
        rangeInput[0].value = minVal;
        progress.style.left = (minVal / rangeInput[0].max) * 100 + "%";
      } else {
        rangeInput[1].value = maxVal;
        progress.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
      }
    }
  });
});

rangeInput.forEach((input) => {
  input.addEventListener("input", (e) => {
    let minVal = parseInt(rangeInput[0].value),
      maxVal = parseInt(rangeInput[1].value);

    if (maxVal - minVal < valueGap) {
      if (e.target.className === "range-min") {
        // if active slider is min slider
        rangeInput[0].value = maxVal - valueGap;
      } else {
        rangeInput[1].value = minVal + valueGap;
      }
    } else {
      valueInput[0].value = minVal;
      valueInput[1].value = maxVal;
      progress.style.left = (minVal / rangeInput[0].max) * 100 + "%";
      progress.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
    }
  });
});

// main field

let random;
let counter = 0;

let counterEiner = 0;
let counterZehner = 0;
let counterHunderter = 0;
let counterTausender = 0;
var einerID = "#imgEiner";
var zehnerID = "#imgZehner";
var hunderterID = "#imgHunderter";
var tausenderID = "#imgTausender";
var dropID = "#dropbox";

// select the dropable area  and add a drop function on it
// each time a draggable image drops in the field  increment the counter accordingly

$("#dropbox").droppable({
  tolerance: "fit",
  drop: function (event, ui) {
    var $canvas = $(this);

    if (!ui.draggable.hasClass("canvas-element")) {
      if (ui.draggable.hasClass("img1")) {
        var $canvasElement = ui.draggable.clone();
        $canvasElement.attr("id", "cloneElement");

        counterEiner++;
        counter++;
        console.log("Einer " + counterEiner);
      } else if (ui.draggable.hasClass("img2")) {
        var $canvasElement = ui.draggable.clone();
        $canvasElement.attr("id", "cloneElement2");
        counterZehner++;
        counter += 10;
        console.log("Zehner" + counterZehner);
      } else if (ui.draggable.hasClass("img3")) {
        var $canvasElement = ui.draggable.clone();
        $canvasElement.attr("id", "cloneElement3");
        counterHunderter++;
        counter += 100;
        console.log("Hunderter " + counterHunderter);
      } else if (ui.draggable.hasClass("img4")) {
        var $canvasElement = ui.draggable.clone();
        $canvasElement.attr("id", "cloneElement4");
        counterTausender++;
        counter += 1000;
        console.log("Tausender " + counterTausender);
      }

      // var $canvasElement = ui.draggable.clone();

      $canvasElement.addClass("canvas-element");

      // $canvasElement.attr('id', 'cloneElement')
      $canvasElement.draggable({
        containment: "#dropbox",
      });
      $canvas.append($canvasElement);
      $canvasElement.css({
        left: ui.position.left,
        top: ui.position.top,
        position: "absolute",
      });

      if (counterEiner == 10) {
        // if there is 10 "einer" Boxes replace them with a "zehner" Box
        createElement(zehnerID);
        counterEiner = 0;
        counterZehner++;
        console.log("done");
        $("[id=cloneElement]").remove();
      }
      if (counterZehner == 10) {
        createElement(hunderterID);
        counterZehner = 0;
        counterHunderter++;
        console.log("done");
        $("[id=cloneElement2]").remove();
      }
      if (counterHunderter == 10) {
        createElement(tausenderID);
        counterHunderter = 0;
        counterTausender++;
        console.log("done");
        $("[id=cloneElement3]").remove();
      }
      if (counterTausender == 10) {
        alert("mehr als 10 Tausender block ist nicht erlaubt!");
        $("[id=cloneElement4]").remove();
        counterTausender = 0;
      }
    }
  },
});

// this function will spawn new items 10 , 100 or 1000 once there are 10 of a kind in the field e.g once we have 10 of 1er boxes  replace it with a 10er box

function createElement(elID) {
  var newElement = $(elID).clone();
  var $canvas = $("#dropbox");
  newElement.addClass("canvas-element");
  newElement.addClass("collision2");

  if (elID == "#imgZehner") {
    // elements which was created from 10 "Einer" , 10 "Zehner"  or 10 "tausender" will have the id = cloneElment2/3/4
    // ( which is a "Zehner/ Hunderter" object) we need it for removing them once there are 10 of them
    newElement.attr("id", "cloneElement2");
  } else if (elID == "#imgHunderter") {
    newElement.attr("id", "cloneElement3");
  } else if (elID == "#imgTausender") {
    newElement.attr("id", "cloneElement4");
  }

  newElement.draggable({
    containment: "#dropbox",
  });
  $canvas.append(newElement);
  newElement.css({
    left: $canvas.position().left + 800,
    top: $canvas.position().top,
    position: "absolute",
  });
}

// start Button display the random number  between two values, which is set by user using slider and check button is off
$("#checkbtn").prop("disabled", true);

function randomNumberGenerator() {
  //get the min and max values set by user
  let min = $(".input-min").val();
  let max = $(".input-max").val();
  let cmin = Math.ceil(min);
  let cmax = Math.floor(max);
  random = Math.floor(Math.random() * (cmax - cmin) + cmin);
  let randomnumberString = random.toString();

  // show the randomly generated number on header part

  firstLine.html("Stelle die Zahl");
  $("#randomNumber").html(randomnumberString);
  secondLine.html("mit Hilfe der Kästchen dar!");
  console.log(random);

  firstLine.removeClass("firstLineFalsch");
  firstLine.addClass("lineAfter");

  // reset the values of all counters clear the field
  $("[id=cloneElement]").remove();
  $("[id=cloneElement2]").remove();
  $("[id=cloneElement3]").remove();
  $("[id=cloneElement4]").remove();
  counter = 0;
  counterEiner = 0;
  counterZehner = 0;
  counterHunderter = 0;
  counterTausender = 0;

  // select the  images ( boxes representing the place Value) and make them draggable

  $("#imgEiner").draggable({
    helper: "clone",
    cursor: "move",
    scroll: false,
  });
  $("#imgZehner").draggable({
    helper: "clone",
    cursor: "move",
    scroll: false,
  });
  $("#imgHunderter").draggable({
    helper: "clone",
    cursor: "move",
    scroll: false,
  });
  $("#imgTausender").draggable({
    helper: "clone",
    cursor: "pointer",
    scroll: false,
  });

  // disable the start button once clicked
  $("#checkbtn").prop("disabled", false);
  $("#valuebtn").prop("disabled", true);
}

// function for "Überprüfen"  check button   on click  check  if the value of the boxes are same as the generated random number on header

function check() {
  //   var feedback = $("#feedbackmsg");
  //   if (random == counter) {
  //     feedback.html("Sehr gut! die Antwort ist richtig!");
  //   } else {
  //     feedback.html("Leider falsch! versuch es nochmal");
  //   }
  sortElements();
  if (random == counter) {
    firstLine.removeClass("lineFalsch");
    secondLine.removeClass("firstLine");
    $("#randomNumber").removeClass("lineAfter");
    firstLine.html("Sehr gut!");
    $("#randomNumber").html("");
    $("#randomNumber").addClass("randomNumber");
    secondLine.html("Die Antwort ist richtig!");
    firstLine.removeClass("lineAfter");
    firstLine.addClass("firstLine");
    secondLine.addClass("secondLine");
    $("#valuebtn").prop("disabled", false);
  } else {
    firstLine.html(counter);
    $("#randomNumber").html(" &ne; ");
    secondLine.html(random);

   
    $("#randomNumber").addClass("lineAfter");

    firstLine.removeClass("lineAfter");
    firstLine.addClass("lineFalsch");

    secondLine.removeClass("secondLine");
    secondLine.addClass("firstLine");
  }
}

// ًreset button or Correction button  will remove all the boxes from the field

function reset() {
  $("[id=cloneElement]").remove();
  $("[id=cloneElement2]").remove();
  $("[id=cloneElement3]").remove();
  $("[id=cloneElement4]").remove();
  counter = 0;
  counterEiner = 0;
  counterZehner = 0;
  counterHunderter = 0;
  counterTausender = 0;
}

//sort function

function sortElements() {
  var el1 = $("[id=cloneElement]");
  var el10 = $("[id=cloneElement2]");
  var el100 = $("[id=cloneElement3]");
  var el1000 = $("[id=cloneElement4]");
  var dropBox = $("#dropbox");

  var spaceX = 30;
  var spaceY = 20;

  var positionLeft = dropBox.position().left;
  var positionTop = dropBox.position().top;

  el1.each(function (index, el) {
    $(this).css({
      left: positionLeft + spaceX,
      top: positionTop + spaceY,
      position: "absolute",
    });

    spaceX += 30;
  });

  spaceX = 30;
  spaceY = 60;

  // sorting "zehner" Boxes all of them in 2nd row
  el10.each(function (index, el) {
    $(this).css({
      left: positionLeft + spaceX,
      top: positionTop + spaceY,
      position: "absolute",
    });

    spaceX += 30;
  });

  spaceX = 30;
  spaceY = 220;

  // sorting "Hunderter" Boxes 6 boxes in 3rd row the last 3 in 2nd row
  el100.each(function (index, el) {
    if (index < 6) {
      $(this).css({
        left: positionLeft + spaceX,
        top: positionTop + spaceY,
        position: "absolute",
      });
      spaceX += 160;

      console.log(index);
    } else if (index == 6) {
      spaceX = 350;
      spaceY = 60;

      $(this).css({
        left: positionLeft + spaceX,
        top: positionTop + spaceY,
        position: "absolute",
      });
    } else {
      spaceY = 60;
      spaceX += 160;
      $(this).css({
        left: positionLeft + spaceX,
        top: positionTop + spaceY,
        position: "absolute",
      });
    }
  });

  // sorting "tausender" boxes 5 Boxes in 4th row 4 Boxes in 5th row
  spaceX = 25;
  spaceY = 360;
  el1000.each(function (index, el) {
    if (index < 5) {
      $(this).css({
        left: positionLeft + spaceX,
        top: positionTop + spaceY,
        position: "absolute",
      });
      spaceX += 165;

      console.log(index);
    } else if (index == 5) {
      spaceX = 25;
      spaceY = 530;

      $(this).css({
        left: positionLeft + spaceX,
        top: positionTop + spaceY,
        position: "absolute",
      });
    } else {
      spaceY = 530;
      spaceX += 165;
      $(this).css({
        left: positionLeft + spaceX,
        top: positionTop + spaceY,
        position: "absolute",
      });
    }
  });

  // el1.get([0]).css({
  //   left: positionLeft + spaceX,
  //   top: positionTop + spaceY,
  //   position: "absolute",
  // })

  // el1.css({
  //   left: positionLeft + spaceX,
  //   top: positionTop + spaceY,
  //   position: "absolute",
  // });
}
