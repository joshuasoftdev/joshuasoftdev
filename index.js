require("dotenv").config();
const Mustache = require("mustache");
const fetch = require("node-fetch");
const fs = require("fs");

const MUSTACHE_MAIN_DIR = "./main.mustache";

let DATA = {
  name: "Joshua",
  date: new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZoneName: "short",
    timeZone: "America/Los_Angeles",
  }),
};

async function setTimeInformation() {
  await fetch("http://worldtimeapi.org/api/timezone/America/Los_Angeles")
    .then((response) => response.json())
    .then((data) => {
      DATA.dateTime = data.datetime;
    });
}

async function setWeatherInformation() {
  await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=Sacramento&appid=4c26091d505ee5b1aa3e72bd5bdcf899&units=imperial`
  )
    .then((r) => r.json())
    .then((r) => {
      DATA.temperature = Math.round(r.main.temp);
      DATA.weather = r.weather[0].description;
    });
}

async function generateReadMe() {
  await fs.readFile(MUSTACHE_MAIN_DIR, (err, data) => {
    if (err) throw err;
    const output = Mustache.render(data.toString(), DATA);
    fs.writeFileSync("README.md", output);
  });
}

async function action() {
  await setTimeInformation();
  await setWeatherInformation();
  await generateReadMe();
}

function getCurrentTime() {
  const date = new Date();

  const hour = (date.getHours() < 10 ? "0" : "") + date.getHours();
  const min = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
  const sec = (date.getSeconds() < 10 ? "0" : "") + date.getSeconds();

  const year = date.getFullYear();

  const month = (date.getMonth() + 1 < 10 ? "0" : "") + (date.getMonth() + 1);
  const day = (date.getDate() < 10 ? "0" : "") + date.getDate();

  return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;
}

action();
