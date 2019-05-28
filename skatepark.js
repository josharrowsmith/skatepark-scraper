const puppeteer = require('puppeteer');
const jsonfile = require('jsonfile');
const firebase = require('firebase');
const request = require("request");
require('dotenv').config()

var config = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    databaseURL: process.env.databaseURL,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId
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
        // const image = await page.evaluate( () => document.querySelector( '#maincontent > p > img' ).src);
        // var viewSource = await page.goto(image);
        // fs.writeFile(".googles-20th-birthday-us-5142672481189888-s.png", await viewSource.buffer(), function (err) {
        //   if (err) {
        //       return console.log(err);
        //   }
      
        //   console.log("The file was saved!");
        // });
        let latlong = StringStrip(iframe)
        let lat = latlong[0]
        let long = latlong[1]
        addItem(lat, long, title)
        await page.goBack();
        // Get the data ...
      }
}


//This will add items to geostore
function addItem(lat , long, title) {
    console.log(lat, long, title)
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

