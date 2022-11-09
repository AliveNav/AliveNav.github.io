// init speechsynth API
const speaker = window.speechSynthesis;
let msg = new SpeechSynthesisUtterance();

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

        $("[id=cloneElement]").remove();
      }
      if (counterZehner == 10) {
        createElement(hunderterID);
        counterZehner = 0;
        counterHunderter++;

        $("[id=cloneElement2]").remove();
      }
      if (counterHunderter == 10) {
        createElement(tausenderID);
        counterHunderter = 0;
        counterTausender++;

        $("[id=cloneElement3]").remove();
      }
      if (counterTausender == 10) {
        alert("mehr als 10 Tausender block ist nicht erlaubt!");
        $("[id=cloneElement4]").remove();
        counterTausender = 0;
        counter = 0;
      }
      counter =
        counterEiner * 1 +
        counterZehner * 10 +
        counterHunderter * 100 +
        counterTausender * 1000;
      console.log(
        counter +
          " " +
          counterEiner +
          " " +
          counterZehner +
          " " +
          counterHunderter +
          " " +
          counterTausender
      );
    }
  },
});

// this function will spawn new items 10 , 100 or 1000 once there are 10 of a kind in the field e.g once we have 10 of 1er boxes  replace it with a 10er box

function createElement(elID) {
  var newElement = $(elID).clone();
  var $canvas = $("#dropbox");
  newElement.addClass("canvas-element");
  newElement.addClass("collision2");

  var dropboxwidth = $canvas.width();
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
    left: $canvas.position().left + (dropboxwidth - 200),
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

  //read the number

  // disable the start button once clicked
  $("#checkbtn").prop("disabled", false);
  $("#valuebtn").prop("disabled", true);

  // }
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

  var positionLeft = dropBox.position().left;
  var positionTop = dropBox.position().top;
  var dropBoxWidth = dropBox.width();
  var dropBoxHeight = dropBox.height();
  var spaceX = 5;
  var spaceY = 5;
  var spacetemp = 0;
  var spacetempx = 0;
  console.log(dropBoxWidth);
  console.log(dropBoxHeight);

  el1.each(function (index, el) {
    var el1Width = $(this).width();
    var el1Height = $(this).height();
    spacetemp = el1Height;
    $(this).css({
      left: positionLeft + spaceX,
      top: positionTop + spaceY,
      position: "absolute",
    });

    spaceX += el1Width + 5;
  });

  spaceX = 5;
  spacetemp = spacetemp * 2 + 5;
  spaceY = spacetemp;

  // sorting "zehner" Boxes all of them in 2nd row
  el10.each(function (index, el) {
    var el10Width = $(this).width();
    var el10Height = $(this).height();
    if (index == 0) {
      spacetemp += el10Height;
    }

    $(this).css({
      left: positionLeft + spaceX,
      top: positionTop + spaceY,
      position: "absolute",
    });

    spaceX += el10Width + 5;
  });

  spaceX = 5;
  spacetemp = spacetemp + 3;

  spaceY = spacetemp;

  // sorting "Hunderter" Boxes 6 boxes in 3rd row the last 3 in 2nd row
  el100.each(function (index, el) {
    var el100Width = $(this).width();
    var el100Height = $(this).height();
    if (index == 0) {
      spacetemp += el100Height;
    }
    var temp = (dropBoxWidth / (el100Width + 5)) >> 0; // how many "Zehner" Box fits in one line for sorting purposes
    console.log(temp);
    if (index < temp) {
      $(this).css({
        left: positionLeft + spaceX,
        top: positionTop + spaceY,
        position: "absolute",
      });
      spaceX += el100Width + 5;
    } else if (index == temp) {
      spaceX = 5;
      spaceY = spacetemp + 3;
      spacetemp += el100Height;
      $(this).css({
        left: positionLeft + spaceX,
        top: positionTop + spaceY,
        position: "absolute",
      });
    } else {
      spaceX += el100Width + 5;
      $(this).css({
        left: positionLeft + spaceX,
        top: positionTop + spaceY,
        position: "absolute",
      });
    }
  });

  // sorting "tausender" boxes 5 Boxes in 4th row 4 Boxes in 5th row

  spaceX = 5;
  el1000.each(function (index, el) {
    var el1000Width = $(this).width();
    var el1000Height = $(this).height();
    spaceY = dropBoxHeight - el1000Height;
    var tempy = (dropBoxWidth / (el1000Width - 25)) >> 0;
    if (index < tempy) {
      $(this).css({
        left: positionLeft + spaceX,
        top: positionTop + spaceY,
        position: "absolute",
      });
      spaceX += el1000Width - 25;

      console.log(index);
    } else if (index == tempy) {
      spaceX = dropBoxWidth - el1000Width;
      spaceY = dropBoxHeight - (el1000Height * 2 - 5);

      $(this).css({
        left: positionLeft + spaceX,
        top: positionTop + spaceY,
        position: "absolute",
      });
    } else {
      spaceY = dropBoxHeight - (el1000Height * 2 - 5);
      spaceX -= el1000Width - 25;
      $(this).css({
        left: positionLeft + spaceX,
        top: positionTop + spaceY,
        position: "absolute",
      });
    }
  });
}

// read the random generated Number
function speakit() {
  var textToSpeak = random.toString();
  msg.text = textToSpeak;
  msg.lang = "de-DE";
  msg.rate = 0.7;
  msg.voice = window.speechSynthesis.getVoices()[1];

  speaker.speak(msg);
}
