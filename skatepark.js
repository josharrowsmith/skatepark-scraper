const puppeteer = require('puppeteer');
const jsonfile = require('jsonfile');
const firebase = require('firebase');
const request = require("request");

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

//Opens browser
async function initBrowser(){
    this.browser = await puppeteer.launch({
      headless: false,
      args: [
        '--window-size=1920,1440'
      ]
    });
    this.page = await browser.newPage();
    await this.page.setViewport({height:1440, width:1920});
    await page.goto('https://www.google.com');
}

//Main ahha
async function runAllTheThings() {
    await initBrowser();
}


runAllTheThings();

