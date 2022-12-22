const main = $("#main");
const number_lines = $("#number-lines");
const svg_1 = $("#svg-1");
const svg_2 = $("#svg-2");
const svg_3 = $("#svg-3");
const svg_4 = $("#svg-4");
const box1 = $("#box-1");
const box2 = $("#box-2");
const box3 = $("#box-3");
const box4 = $("#box-4");
const random = $("#randomNumber");
const header_text_line1 = $("#first-line");
const header_text_line2 = $("#second-line");

// variable for namespace
const svgns = "http://www.w3.org/2000/svg";



let minValue = 0;
let maxValue = 0;
let random_number = 0;

// get the values from URL parameters
const queryString = window.location.search;
const urlSearchParams = new URLSearchParams(queryString);
for (const [key, value] of urlSearchParams) {
  minValue = urlSearchParams.get("min");
  maxValue = urlSearchParams.get("max");
}

// initialize web speech API 
const speaker = window.speechSynthesis;
let msg = new SpeechSynthesisUtterance();
msg.lang = "de-De";
msg.voice = speechSynthesis
  .getVoices()
  .find((voice) => /de(-|_)De/.test(voice.lang));
//msg.voice = window.speechSynthesis.getVoices()[6];

// initial values of the first svg (unchanged values)
let default_values = [0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000];
let box1_values = [];
let box2_values = [];
let box3_values = [];

//help variables "check" used to indicate when to reset the values "level counter" used to hide the lower boxes when user try to correct answer after a wrong answer
let check = false;
let level_counter = 0;
let filter_box2_index = 0;
let filter_box3_index = 0;

// welcome text
header_text_line1.html(`<span class="black-line-big">Herzlich Willkommen!</span>`)
random.html("")
header_text_line2.html(`Drücke <span class="color-line-big"> Start</span> , um zu beginnen`)

// takes an svg and an array of 11 numbers , creates a ruler with 11 values
function create_line(svg, box_number, text_id) {
  let gape_x = svg.width() / 104;
  let x1 = gape_x * 4;
  let y1 = svg.height() / 1.2; // height of small lines
  let x2 = gape_x * 4;
  let y2 = svg.height();
  let temp = 0;
  let gape_middle = svg.height() / 1.4; // height of mid lines
  let gape_heigh = svg.height() / 2; // height of big lines
  let text_pos = svg.height() / 3; // height of values

  for (let i = 0; i < 101; i++) {
    if (i % 10 == 0) {
      let line_heigh = document.createElementNS(svgns, "line");
      line_heigh.setAttribute("x1", x1 + temp);
      line_heigh.setAttribute("y1", gape_heigh);
      line_heigh.setAttribute("x2", x2 + temp);
      line_heigh.setAttribute("y2", y2);
      line_heigh.classList.add("big-lines");
      line_heigh.setAttribute("id", `line-heigh-${box_number}`);
      svg.append(line_heigh);
      create_numbers(svg, x1 + temp - 10, text_pos, text_id);
    } else if (i % 5 == 0) {
      let line_mid = document.createElementNS(svgns, "line");
      line_mid.setAttribute("x1", x1 + temp);
      line_mid.setAttribute("y1", gape_middle);
      line_mid.setAttribute("x2", x2 + temp);
      line_mid.setAttribute("y2", y2);
      line_mid.classList.add("mid-lines");
      svg.append(line_mid);
    } else {
      let line = document.createElementNS(svgns, "line");
      line.setAttribute("x1", x1 + temp);
      line.setAttribute("y1", y1);
      line.setAttribute("x2", x2 + temp);
      line.setAttribute("y2", y2);
      line.classList.add("small-lines");
      svg.append(line);
    }
    temp += x1 / 4.2;
  }
}
// initializing the values on top of the lines, used inside create_lines function to set the values
function create_numbers(svg, x, y, id_number) {
  let text = document.createElementNS(svgns, "text");
  text.classList.add("text");
  text.setAttribute("id", `text-${id_number}`);
  text.setAttribute("x", x);
  text.setAttribute("y", y);
  text.textContent = 0;
  svg.append(text);
}
// gets two values and creates an array of 10 numbers from thoes two values.  (1st value + 2nd value )+ 2rd value ....
// used to create line values for lower value boxes (box2 , box3 and box4)
function create_values(value, x) {
  let text_values = [];
  let temp = 0;
  for (let i = 0; i < 11; i++) {
    text_values[i] = value + temp;
    temp += x;
  }
  return text_values;
}
//used to create clickable areas between the numbers , on click expands that area
function create_filters(box, box_number) {
  for (let i = 0; i < 10; i++) {
    let filters = document.createElement("div");
    filters.setAttribute("id", `filter-${i}-${box_number}`);
    box.append(filters);
  }
}
//this filter is only for the last box (smaller on top of the line)
function create_filters2(box, box_number) {
  for (let i = 0; i < 11; i++) {
    let filters = document.createElement("div");
    filters.setAttribute("id", `filter-${i}-${box_number}`);
    box.append(filters);
  }
}
// position the clickable filters between the numbers
function filters_position(box, box_number) {
  let box_height = box.height();
  let heigh_lines = $(`[id=line-heigh-${box_number}]`);
  heigh_lines.each(function (index, value) {
    let filter = $(`#filter-${index}-${box_number}`);
    filter.addClass("filter");
    filter.css({
      top: $(this).position().top - box_height/4.8,
      left: $(this).position().left,
    });
  });
}
// position the clickable filters  on the number (for the last box)
function filters_position_last(box, box_number) {
  let box_height = box.height();
  let heigh_lines = $(`[id=line-heigh-${box_number}]`);
  let width_gap = box.width() / 60;
  heigh_lines.each(function (index, value) {
    let filter = $(`#filter-${index}-${box_number}`);
    filter.addClass("filter2");
    filter.css({
      top: $(this).position().top - box_height / 2,
      left: $(this).position().left - width_gap,
    });
  });
}
// initialize the values on top of the big lines
function init(text_id, values) {
  let text_values = document.querySelectorAll(`[id=text-${text_id}]`);
  let box_lendth = text_values.length;
  for (let i = 0; i < box_lendth; i++) {
    text_values[i].textContent = values[i];
  }
}
// create elements inside svg (lines and texts) and dynamicly change the values depends on the box which is create_svg_elements
function create_svg_elements(svg, box, number, text_id) {
  create_line(svg, number, text_id);
  create_filters(box, number);
  filters_position(box, number);
}
function create_svg_elements2(svg, box, number, text_id) {
  create_line(svg, number, text_id);
  create_filters2(box, number);
  filters_position_last(box, number);
}
// used to change the color of filters once user clicked on them, color of filter will be same as color of next box
function change_filter_color(el_number, box_number, bg_color_clicked) {
  let filters = $(`#box-${box_number} > div`);
  filters.each(function () {
    if ($(this).attr("id") === `filter-${el_number}-${box_number}`) {
      $(this).css({
        background: `${bg_color_clicked}`,
      });
    } else {
      $(this).css({
        background: "transparent",
      });
    }
  });
}
// hide the bottom rows (boxes)
function row_hider(){
  box2.css({
    visibility: "hidden",
    opacity: 0,
  });
  box3.css({
    visibility: "hidden",
    opacity: 0,
  });
  box4.css({
    visibility: "hidden",
    opacity: 0,
  });
}
// used to freez the screen when the user finds the correct answer
function freez_screen() {
  let freez_filter = document.createElement("div");
  freez_filter.setAttribute("id", "freez");
  freez_filter.classList.add("freez");
  $("#main").append(freez_filter);
  $("#freez").css({
    left: main.position().left,
    top: main.position().top,
  });
}

function read_text() {
  msg.text =
    $("#first-line").text() +
    " " +
    $("#randomNumber").text() +
    " " +
    $("#second-line").text();
  speaker.speak(msg);
  
}

// reload page
function refreshPage() {
  window.location.reload();
}

// remove all elements from svgs, used to reset for next round
function remove_elements(){
  $('#svg-1').empty()
  $(`#box-1 > div`).remove()
  $('#svg-2').empty()
  $(`#box-2 > div`).remove()
  $('#svg-3').empty()
  $(`#box-3 > div`).remove()
  $('#svg-4').empty()
  $(`#box-4 > div`).remove()
} 
// boxes are hidden, when clicked on 1st box show the 2nd box, onclick on 2nd box show 3rd box ...
row_hider()
create_svg_elements(svg_1, box1, 1, 1);
init(1, default_values);
freez_screen();
//start button function
function start() {

  let cmin = Math.ceil(minValue);
  let cmax = Math.floor(maxValue);
  random_number = Math.floor(Math.random() * (cmax - cmin) + cmin);
  let randomnumberString = random_number.toString();
  random.html(randomnumberString);
  header_text_line1.html(`<span class="black-line-big">Trage die Zahl</span>`)
  header_text_line2.html(`<span class="black-line-big">am Zahllenstrahl ein</span>`)
  //create svg elements (texts and lines), initilized the values with zeros
  //for svg1 set the values , since they are always the same values (0 to 10000)
  remove_elements()
 
  create_svg_elements(svg_1, box1, 1, 1);
  init(1, default_values);
  create_svg_elements(svg_2, box2, 2, 2);
  create_svg_elements(svg_3, box3, 3, 3);
  create_svg_elements2(svg_4, box4, 4, 4);
 

  // for the last box we dont need the mid lines or small lines so remove them
  // I dont change the create line function because in furture we may need them for float numbers
  $("#svg-4 > .small-lines").remove();
  $("#svg-4 > .mid-lines").remove();
  row_hider()
  // stage one from box1 to box2, there are 10 options to click on each stage
  let box1_filters = $(`#box-1 > div`);
  box1_filters.each(function (index, el) {
    $(this).on("click", function () {
      //when clicked on the first box filters
      // if 3 boxes are visible (means aleady clicked once), hide the lower box (box3) and reset the filter color
      if (level_counter == 3) {
        random.html(randomnumberString);
        header_text_line1.html(`<span class="black-line-big">Trage die Zahl</span>`)
        header_text_line2.html(`<span class="black-line-big">am Zahllenstrahl ein</span>`)
        box3.css({
          visibility: "hidden",
          opacity: 0,
        });
        $("[id=animated-div-box2]").remove();
        change_filter_color(
          filter_box2_index,
          2,
          "linear-gradient(0deg, #75e99c00 0%, #ffffff00 100%)"
        );
      }
      //if 4 boxes are visible (means aleady clicked once), hide the lower boxes (box3 and box4) and reset the filter color
      if (level_counter == 4) {
        box3.css({
          visibility: "hidden",
          opacity: 0,
        });
        box4.css({
          visibility: "hidden",
          opacity: 0,
        });
        $("[id=animated-div-box2]").remove();
        $("[id=animated-div-box3]").remove();
        change_filter_color(
          filter_box2_index,
          2,
          "linear-gradient(0deg, #75e99c00 0%, #ffffff00 100%)"
        );
        change_filter_color(
          filter_box3_index,
          3,
          "linear-gradient(0deg, #c399e600 0%, #ffffff00 100%)"
        );
        random.html(randomnumberString);
        header_text_line1.html(`<span class="black-line-big">Trage die Zahl</span>`)
        header_text_line2.html(`<span class="black-line-big">am Zahllenstrahl ein</span>`)
      }

      // otherweise show box2 and change the color of "clicked filter" on box1 #c0ccf141ad
      box1_values = create_values(default_values[index], 100);
      init(2, box1_values);
      box1.css({
        background: "#c0ccf177",
      });
      box2
        .css({
          visibility: "visible",
          background: "#f89f56",
        })
        .delay(1000)
        .animate({ opacity: 1 }, 1000);
      change_filter_color(
        index,
        1,
        "#f89f5677"
      );

      //animated div from box1 to box2 this will help students to understand, which part of box1 is being zoomed in
      let animated_filter = document.createElement("div");
      animated_filter.setAttribute("id", "animated-div-box1");
      animated_filter.classList.add("animated-div");
      main.append(animated_filter);
      $("#animated-div-box1")
        .css({
          background: "#f89f56",
          position: "absolute",
          top: box1.position().top + box1.height()/1.1,
          left: $(this).position().left,
          height: $(this).height(),
          width: $(this).width(),
        })
        .animate(
          {
            top: box2.position().top,
            left: box2.position().left,
            height: box2.height(),
            width: box2.width(),
            background: box2.css("background-color"),
          },{
            duration: 1000,
            
          }
        );
    });
  });

  //stage 2 from box2 to box3
  let box2_filters = $(`#box-2 > div`);
  box2_filters.each(function (index, el) {
    $(this).on("click", function () {
      if (level_counter == 4) {
        box4.css({
          visibility: "hidden",
          opacity: 0,
        });
        change_filter_color(
          filter_box3_index,
          3,
          "linear-gradient(0deg, #c399e600 0%, #ffffff00 100%)"
        );
        random.html(randomnumberString);
        header_text_line1.html(`<span class="black-line-big">Trage die Zahl</span>`)
        header_text_line2.html(`<span class="black-line-big">am Zahllenstrahl ein</span>`)
        $("[id=animated-div-box3]").remove();
        console.log("why");
      }

      filter_box2_index = index;
      box2_values = create_values(box1_values[index], 10);
      init(3, box2_values);
      box2.css({
        background: "#f89f5677",
      });
      box3
        .css({
          visibility: "visible",
          background: "#75e99c",
        })
        .delay(1000)
        .animate({ opacity: 1 }, 1000);

      change_filter_color(
        index,
        2,
        "#75e99c77"
      );
      $("[id=animated-div-box1]").remove();

      let animated_filter = document.createElement("div");
      animated_filter.setAttribute("id", "animated-div-box2");
      animated_filter.classList.add("animated-div");
      main.append(animated_filter);
      $("#animated-div-box2")
        .css({
          background: "#75e99c",
          position: "absolute",
          top: box2.position().top + box2.height(),
          left: $(this).position().left,
          height: $(this).height(),
          width: $(this).width(),
        })
        .animate(
          {
            top: box3.position().top,
            left: box3.position().left,
            height: box3.height(),
            width: box3.width(),
            background: box3.css("background-color"),
          },
          1000
        );

      level_counter = 3; // 3 boxes are visible
    });
  });

  // stage 3 from box3 to box4
  let box3_filters = $(`#box-3 > div`);
  box3_filters.each(function (index, el) {
    $(this).on("click", function () {
      level_counter = 4; // 4 boxes are visible
      filter_box3_index = index;
      box3_values = create_values(box2_values[index], 1);
      init(4, box3_values);
      box3.css({
        background: "#75e99c77",
      });
      box4
        .css({
          visibility: "visible",
          background: "#c399e6",
        })
        .delay(1000)
        .animate({ opacity: 1 }, 1000);

      change_filter_color(
        index,
        3,
        "#c399e677"
      );
      $("[id=animated-div-box2]").remove();

      let animated_filter = document.createElement("div");
      animated_filter.setAttribute("id", "animated-div-box3");
      animated_filter.classList.add("animated-div");
      main.append(animated_filter);
      $("#animated-div-box3")
        .css({
          background: "#c399e6",
          position: "absolute",
          top: box3.position().top + box3.height(),
          left: $(this).position().left,
          height: $(this).height(),
          width: $(this).width(),
        })
        .animate(
          {
            top: box4.position().top,
            left: box4.position().left,
            height: box4.height(),
            width: box4.width(),
            background: box4.css("background-color"),
          },
          1000
        );

        random.html(randomnumberString);
        header_text_line1.html(`<span class="black-line-big">Trage die Zahl</span>`)
        header_text_line2.html(`<span class="black-line-big">am Zahllenstrahl ein</span>`)
    });
  });

  //stage 4 when clicked on the numbers from last box (target number) check if the random number is same as the clicked value #c399e6ad
  let box4_texts = $(`#svg-4 > text`);
  let box4_filters = $(`#box-4 > div`);
  box4_filters.each(function (index, el) {
    $(this).on("click", function () {
      //if the user clicked on the right answer
      if (randomnumberString === box4_texts[index].textContent) {
        // make screen unclickable
        freez_screen();
        //change the color and font of the number which is clicked
        var el = $(box4_texts[index]);
        el.css("fill", "#47947b");
        el.css("font-weight", "bold");

        // change the box4 color and show msg to user
        box4.css({
          background: "#c399e677",
        });
        random.html("");
        header_text_line1.html(`<span class="black-line-big"> Sehr gut! du hast die richtige Zahl getragen</span>`);
        header_text_line2.html(`<span class="black-line-mid"> Drücke <span class="color-line-big"> Start</span>, um eine neue Zahl zu bekommen</span>`);
        $("#start-btn").prop("disabled", false);
        check = true;

        $("[id=animated-div-box3]").remove();
      } else {
        // user will be able to try again and again untill he/she finds the correct answer
        random.html("");
        header_text_line1.html(
          `<span class="black-line-big"> du hast die Zahl <span class="color-line-big-red"> ${box4_texts[index].textContent}</span> getragen </span>`
        );
        header_text_line2.html(
          `<span class="black-line-big"> du solltest die Zahl <span class="color-line-big"> ${random_number}</span> tragen, versuch es nochmal </span>`
        );
        $("[id=animated-div-box3]").remove();
      }
    });
  });

  // disable the start button untill the user finds the correct answer
  $("#start-btn").prop("disabled", true);
  $("#freez").remove();
  if (check) {
    check = false;
  }

}



