const playwright = require('playwright');
const { saveData } = require('../utils/db');
const { formateData } = require("../utils/formateData")
const selectors = require('../selectors/Nycancer.json');


async function scrapeNycancer() {
    const browser = await playwright.chromium.launch({ headless: false });
    const page = await browser.newPage();

    try {
        await page.goto(selectors.url);



        await page.waitForSelector(selectors.locationsList);
        const cards = await page.$$(selectors.locationsList);
        console.log(`Found ${cards.length} cards \n --------------------`);

        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];

            await card.scrollIntoViewIfNeeded();
            await card.click();

            await page.waitForSelector(selectors.clinicName,{ timeout: 10000 });


            const clinicName = await page.$eval(selectors.clinicName, el => el.textContent.trim());
            const locationLink = await page.getAttribute(selectors.addressLink, 'href');
            const fullAddress = await page.textContent(selectors.addressLink);

            console.log(`Website name: ${selectors.websiteName}`);
            console.log(`Clinic name: ${clinicName}`);
            console.log(`Location link: ${locationLink}`);
            console.log(`Full Address: ${fullAddress}`);
            console.log(`----------------------------------- ${i + 1}`);
            // Save the scraped data
            const data = await formateData({
                websiteName: selectors.websiteName,
                websiteURL: selectors.url,
                clinicName: clinicName,
                locationLink: locationLink,
                fullAddress: fullAddress
            });
            await saveData(data);

            if (i < cards.length - 1) {
                await page.goBack();
                await page.waitForLoadState('domcontentloaded');
                // Re-select the cards as the page has been reloaded
                const updatedCards = await page.$$(selectors.locationsList);
                cards[i + 1] = updatedCards[i + 1];
            }

            // Add a small delay between iterations
            await page.waitForTimeout(1000);
        }
    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        await browser.close();
    }
}

module.exports = { scrapeNycancer };