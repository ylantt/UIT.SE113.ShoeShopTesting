const countDownDate = new Date("2021-12-12").getTime();

const eventDay = $(".event__time--day");
const eventHour = $(".event__time--hour");
const eventMin = $(".event__time--min");
const eventSec = $(".event__time--sec");
const nav = $(".nav");

let prevScroll = window.scrollY || document.documentElement.scrollTop;
let curScroll;
let direction = 0;
let prevDirection = 0;

export const caclDayRemain = () => {
  // Get today's date and time
  var now = new Date().getTime();

  // Find the distance between now and the count down date
  var distance = countDownDate - now;

  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Display the result in the element with id="demo"
  eventDay.text(days);
  eventHour.text(hours);
  eventMin.text(minutes);
  eventSec.text(seconds);
}

export const checkScroll = () => {
  /*
   ** Find the direction of scroll
   ** 0 - initial, 1 - up, 2 - down
   */

  curScroll = window.scrollY || document.documentElement.scrollTop;
  if (curScroll > prevScroll) {
    //scrolled up
    direction = 2;
  } else if (curScroll < prevScroll) {
    //scrolled down
    direction = 1;
  }

  if (direction !== prevDirection) {
    toggleNav(direction, curScroll);
  }

  prevScroll = curScroll;
};

const toggleNav = (direction, curScroll) => {
  if (direction === 2 && curScroll > 100) {
    nav.addClass("hide");
    prevDirection = direction;
  } else if (direction === 1) {
    nav.removeClass("hide");
    prevDirection = direction;
  }
};


