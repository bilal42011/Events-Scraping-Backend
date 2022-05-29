let puppeteer = require("puppeteer");
let dayjs = require("dayjs");
let utc = require("dayjs/plugin/utc");
let timezone = require("dayjs/plugin/timezone");
let updatelocale = require("dayjs/plugin/updateLocale");
const { compositionDependencies } = require("mathjs");

dayjs.extend(updatelocale);
dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.updateLocale("en", {
  weekStart: "1",
});

(async () => {
  console.log("inside async function");
  let browser = await puppeteer.launch({ headless: false });
  let page = await browser.newPage();
  await page.goto("https://mjut.me/");

  let currentdate = dayjs.tz(dayjs(), "Europe/Berlin");
  let year = currentdate.year();
  let month = (currentdate.month() + 1).toString().padStart(2, "0");

  let monthlyeventlist = await page.evaluate(
    ({ year: currentyear, month }) => {
      let months = [
        "january",
        "february",
        "march",
        "april",
        "may",
        "june",
        "july",
        "august",
        "september",
        "october",
        "november",
        "december",
      ];

      let programitem = document.querySelector(
        ".program-list:first-child .program-item:first-child"
      );
      let currentmonth =
        programitem.querySelector(".program-month h1").innerText;
      currentmonth = months.indexOf(currentmonth) + 1;
      let eventlist = [];
      console.log(currentmonth==month);
      if(currentmonth==month){
      // programlist=Array.from(programlist);
      do {
        let currentevent = {};
        // currentevent.weekday=programitem.querySelector(".program-item-top .weekday").innerText;
        let currenttime = programitem.querySelector(
          ".program-item-top .time"
        ).innerText;
        // currentevent.category=programitem.querySelector(".program-item-top .category").innerText;
        // currentevent.tags=programitem.querySelector(".program-item-top .tags-container .tags .marquee-text").innerText;
        let currentdate = programitem.querySelector(
          ".program-item-top .date"
        ).innerText;
        currentevent.title = programitem.querySelector(
          ".program-item-top .title-container .title .title-text"
        ).innerText;
        currentevent.date =
          currentyear + "-" + month + "-" + currentdate + " " + currenttime;
        let artists = programitem.querySelectorAll(
          ".program-item-main .program-item-text-info .artists .artist"
        );
        currentevent.artists = [];
        for (let artist of artists) {
          let artistname = artist.querySelector(".artist-info .name").innerText;
          let artistarray = artistname.split(" ");
          artistarray.splice(0, 1);
          currentevent.artists.push(artistarray.join(" "));
        }
        eventlist.push(currentevent);
        programitem = programitem.nextElementSibling;
      } 
      while (!programitem.children[0].classList.contains("program-month"));

    }
      console.log(eventlist);
      return eventlist;
    },
    { year, month }
  );

  console.log(monthlyeventlist);

  function getWeekendEventList(monthlyeventlist, date) {
    let clonemonthlylist = [...monthlyeventlist];
    let weekendeventlist = clonemonthlylist.filter((event) => {
      let eventdate = dayjs.tz(event.date, "Europe/Berlin");
      if (date.isSame(eventdate, "week")) {
        let eventweekday = eventdate.get("day");
        if (eventweekday == 0 || eventweekday == 6 || eventweekday == 5) {
          event.weekday = eventdate.format("ddd");
          event.time = eventdate.format("HH:mm");
          event.date = eventdate.format("DD.MM.YY");
          return true;
        }
      }
      return false;
    });
    return weekendeventlist;
  }

  let weekendeventlist = getWeekendEventList(monthlyeventlist, currentdate);
  console.log(weekendeventlist);
})();

(async ()=>{
  let browser = await puppeteer.launch({ headless: false });
  let page = await browser.newPage();
  await page.goto("https://mjut.me/");
  let currentdate=dayjs.tz(dayjs(),"Europe/Berlin");
  let year = currentdate.year();
  let month=currentdate.month()+1;

  let alleventlist=await page.$$eval("div.program-month",(elements,currentyear,currentmonth)=>{

    let events=elements.map(ele=>ele.parentElement);
console.log(events);
let eventlist = [];
let months = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

for(let event of events){

  let year=currentyear;
  let month=event.querySelector(".program-month h1").innerText;
   month = months.indexOf(month) + 1;
// programlist=Array.from(programlist);
if(currentmonth==12 && month<currentmonth){
  year=year+1;
}
do {
  let currentevent = {};
  // currentevent.weekday=event.querySelector(".program-item-top .weekday").innerText;
  let currenttime = event.querySelector(
    ".program-item-top .time"
  ).innerText;
  // currentevent.category=event.querySelector(".program-item-top .category").innerText;
  // currentevent.tags=event.querySelector(".program-item-top .tags-container .tags .marquee-text").innerText;
  let currentdate = event.querySelector(
    ".program-item-top .date"
  ).innerText;
  currentevent.title = event.querySelector(
    ".program-item-top .title-container .title .title-text"
  ).innerText;
  currentevent.date =
    year + "-" + month + "-" + currentdate + " " + currenttime;
  let artists = event.querySelectorAll(
    ".program-item-main .program-item-text-info .artists .artist"
  );
  currentevent.artists = [];
  for (let artist of artists) {
    let artistname = artist.querySelector(".artist-info .name").innerText;
    let artistarray = artistname.split(" ");
    artistarray.splice(0, 1);
    currentevent.artists.push(artistarray.join(" "));
  }
  eventlist.push(currentevent);
  event = event.nextElementSibling;
  if(!event) {
    break;
  }
} 
while (!event.children[0].classList.contains("program-month"));

}

console.log(eventlist);
return eventlist;
},year,month);

function getAllWeekendEventList(eventlist, date) {
  let clonemonthlylist = [...eventlist];
  let weekendeventlist = clonemonthlylist.filter((event) => {
    console.log(event.date);
    let date = dayjs(event.date, "YY-MM-DD").format("YYYY-MM-DD");
    let eventdate = dayjs.tz(date, "Europe/Berlin");

    let eventweekday = eventdate.get("day");
    if (eventweekday == 0 || eventweekday == 6 || eventweekday == 5) {
      event.weekday = eventdate.format("ddd");
      event.date = eventdate.format("DD.MM.YY");
      return true;
    }
  });

  return weekendeventlist;
}
let allweekendeventlist = getAllWeekendEventList(alleventlist, currentdate);
console.log(allweekendeventlist);

});