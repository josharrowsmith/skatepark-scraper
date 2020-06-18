const puppeteer = require("puppeteer");
const jsonfile = require("jsonfile");
const fetch = require("node-fetch");
const GeoFirestore = require("geofirestore").GeoFirestore;
const firebase = require("firebase");
const image2base64 = require("image-to-base64");
const sharp = require('sharp');

require("dotenv").config();

var config = {
  apiKey: "AIzaSyAzxUEyYEP5Vf7a3SzzHQe-nLRdYmupmQk",
  authDomain: "maps20-1786e.firebaseapp.com",
  databaseURL: "https://maps20-1786e.firebaseio.com",
  projectId: "maps20-1786e",
  storageBucket: "maps20-1786e.appspot.com",
  messagingSenderId: "919507578810"
};

firebase.initializeApp(config);

const fs = require("fs");
const cronJob = require("./node_modules/cron/lib/cron").CronJob;

// Opens browser do scraping
async function initBrowser() {
  this.browser = await puppeteer.launch({
    headless: false,
    args: ["--window-size=1920,1440"]
  });
  this.page = await browser.newPage();
  await this.page.setViewport({ height: 1440, width: 1920 });
  await page.goto(process.env.URL);

  const urls = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll("div.entry-image a"),
      element => element.href
    )
  );
  for (let i = 0, total_urls = urls.length; i < total_urls; i++) {
    await page.goto(urls[i]);
    const title = await page
      .evaluate(() => document.querySelector("#maincontent > h1").textContent)
      .catch(err => page.click("a.next"));
    const iframe = await page.evaluate(
      () => document.querySelector("#maincontent > iframe").src
    );
    const rating = await page.evaluate(
      () => document.querySelector("h3").childElementCount - 2
    );
    const description = await page.evaluate(
      () =>
        document.querySelector("#maincontent > p:nth-of-type(2)").textContent
    );
    const images = await this.page.evaluate(() => {
      const elements = Array.from(
        document.querySelectorAll("#maincontent > p > img")
      );
      const links = elements.map(element => element.src);
      return links;
    });

    const firebaseUrl = await getImages(images, title);
    console.log(firebaseUrl);

    const latlong = StringStrip(iframe);
    const lat = latlong[0];
    const long = latlong[1];
<<<<<<< HEAD
    addItem(lat, long, title, firebaseUrl, stars, description);

=======
    console.log("got here")
    addItem(lat, long, title, firebaseUrl, description, rating);
>>>>>>> b179751... CustomUserClaims
    await page.goBack();
    // Get the data ...
  }
}

// Change images from jpg to base64 then upload to firebase storage
//Promise all is awesome !!!
async function getImages(images, title) {
  const waitResolve = [];
  for (let x = 0; x < images.length; x++) {
    waitResolve.push(await image2base64(images[x]));
  }
  Promise.all(waitResolve);
  const firebaseUrl = [];
  for (let y = 0; y < waitResolve.length; y++) {
    const response = await fetch(
      "https://us-central1-maps20-1786e.cloudfunctions.net/storeImage",
      {
        method: "POST",
        body: JSON.stringify({
          image: waitResolve[y],
          name: title
        })
      }
    );
    const data = await response.json();
    const imageurl = await data.imageUrl;
    firebaseUrl.push(await imageurl);
  }
  console.log(firebaseUrl);
  return Promise.all(firebaseUrl);
}

// This will add items to geostore
<<<<<<< HEAD
function addItem(lat, long, title, imageurl, stars, description) {
=======
function addItem(lat, long, title, images, description, rating) {
>>>>>>> b179751... CustomUserClaims
  const lats = parseFloat(lat);
  const lng = parseFloat(long);
  const doc = {
    name: title,
    image: imageurl,
    rating: stars,
    description,
    coordinates: new firebase.firestore.GeoPoint(lats, lng),
    rating: rating
  };
  console.log(doc);
  const geofirestore = new GeoFirestore(firebase.firestore());
  const geocollection = geofirestore.collection("skateparks");
  geocollection.add(doc).then(async docRef => {
    console.log("added");
  });
}

// Splits string
function StringStrip(iframe) {
  const arr = iframe.split("=");
  const latlong = arr[2];
  const final = latlong.split(",");
  return final;
}

<<<<<<< HEAD
=======

function searchDb() {

  const lat = -27.650727;
  const lng = 153.136051;

  // Center
  const centerLat = -27.6506467;
  const centerLng = 153.1579264;

  const radius = 25;

  const firestore = firebase.firestore();
  const geofirestore = new GeoFirestore(firestore);
  const geocollection = geofirestore.collection('skateparks');

  geocollection.limit(50).near({
    center: new firebase.firestore.GeoPoint(centerLat, centerLng),
    radius: radius
  }).get().then((querySnapshot) => {

    let users = [];
    for (let i = 0; i < querySnapshot.docs.length; i++) {
      let { doc } = querySnapshot.docChanges()[i];
      let user = querySnapshot.docs[i].data()
      users.push(user)
    }
    console.log(users.name)
  })
}
>>>>>>> b179751... CustomUserClaims
// Main ahha
async function runAllTheThings() {
  await initBrowser();
}

runAllTheThings();
