const { scrapeTnoncology } = require('./scripts/scrapeTnoncology');
const { scrapeNycancer } = require('./scripts/scrapeNycancer');
const { scrapeWestcancercenter } = require('./scripts/scrapeWestcancercenter');
const { scrapeArizona } = require('./scripts/scrapeArizona');
const { scrapeCentertx } = require('./scripts/scrapeCentertx');
const { scrapeLacancernetwork } = require('./scripts/scrapeLacancernetwork');
const { scrapeAsteracancercare } = require('./scripts/scrapeAsteracancercare');
const { scraprPCS } = require('./scripts/scraprPCS');
const { scrapePiedmontCancerInstitute } = require('./scripts/scrapePiedmontCancerInstitute');
const { scrapUniversityCancer } = require('./scripts/scrapUniversityCancer');
const { scrapTheCHC } = require('./scripts/scrapTheCHC');



// Scrape all websites
async function scrapeAll() {
    //   await scrapeTnoncology();
    //   await scrapeNycancer();
    //   await scrapeWestcancercenter();
    //   await scrapeArizona();
    //   await scrapeCentertx();
    //   await scrapeLacancernetwork();
    //   await scrapeAsteracancercare();
    //   await scraprPCS();
    // await scrapePiedmontCancerInstitute();
    // await scrapUniversityCancer();
    await scrapTheCHC();
}

// Scrape specific website based on user input
async function scrapeSpecific(website) {
    switch (website) {
        case 'tnoncology':
            await scrapeTnoncology();
            break;
        case 'nycancer':
            await scrapeNycancer();
            break;
        case 'westcancercenter':
            await scrapeWestcancercenter();
            break;
        case 'arizona':
            await scrapeArizona();
            break;
        case 'lacancernetwork':
            await scrapeLacancernetwork();
            break;
        case 'asteracancercare':
            await scrapeAsteracancercare();
            break;
        case 'PCS':
            await scraprPCS();
            break;
        case 'piedmontcancerinstitute':
            await scrapePiedmontCancerInstitute();
            break;
        case 'UniversityCancer':
            await scrapUniversityCancer();
            break;

        //scrapTheCHC
        default:
            console.log("Website scraper not found");
    }
}

// Run all scrapers
scrapeAll();

// Or scrape a specific website (if you want to scrape individually)
// scrapeSpecific('websiteName');
