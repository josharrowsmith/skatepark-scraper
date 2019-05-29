const puppeteer = require('puppeteer');
const jsonfile = require('jsonfile');
const firebase = require('firebase');
const request = require("request");
const image2base64 = require('image-to-base64');
const fetch = require('node-fetch');
const GeoFirestore = require('geofirestore').GeoFirestore;


require('dotenv').config()

var config = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DATABASE_URL,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGEBUCKET,
    messagingSenderId: process.env.MESSAGING_SENDID
}
firebase.initializeApp(config);


var fs = require('fs');
const cronJob = require('./node_modules/cron/lib/cron').CronJob;

//Opens browser do scraping 
async function initBrowser(){
    this.browser = await puppeteer.launch({
      headless: false,
      args: [
        '--window-size=1920,1440'
      ]
    });
    this.page = await browser.newPage();
    await this.page.setViewport({height:1440, width:1920});
    await page.goto(process.env.URL);

    const urls = await page.evaluate(() => Array.from(document.querySelectorAll('div.entry-image a'), element => element.href));
    for (let i = 0, total_urls = urls.length; i < total_urls; i++) {
        await page.goto(urls[i]);
        const title = await page.evaluate( () => document.querySelector( '#maincontent > h1' ).textContent ).catch(err => (page.click('a.next')))
        const iframe = await page.evaluate( () => document.querySelector( '#maincontent > iframe' ).src);
        const image = await page.evaluate( () => document.querySelector( '#maincontent > p > img' ).src);
        const base64Image = await image2base64(image)
        const response = await fetch(
          "https://us-central1-maps20-1722286e.cloudfunctions.net/storeImage",
            {
              method: "POST",
              body: JSON.stringify({
                image: base64Image
              })
        })
        let data = await response.json()
        const imageurl = data.imageUrl

        let latlong = StringStrip(iframe)
        let lat = latlong[0]
        let long = latlong[1]
        addItem(lat, long, title, imageurl)
        await page.goBack();
        // Get the data ...
      }
}



//This will add items to geostore
async function addItem(lat , long, title, imageurl) {
    const lats = parseInt(lat);
    const lng = parseInt(long);
    const doc = {
			name: title,
			image: imageurl,
			coordinates: new firebase.firestore.GeoPoint(lats, lng),
    };
    const geofirestore = new GeoFirestore(firebase.firestore());
		const geocollection = geofirestore.collection('skateparks');
    await geocollection.add(doc).then( async (docRef) => {
			console.log("added");
		});
}


//Splits string
function StringStrip(iframe) {
    var arr = iframe.split('=');
    var latlong = arr[2];
    var final = latlong.split(',');
    return final
  }
  

//Main ahha
async function runAllTheThings() {
    await initBrowser();
}


runAllTheThings();

