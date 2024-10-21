const playwright = require('playwright');
const { saveData } = require('../utils/db');
const { formateData } = require("../utils/formateData")
const selectors = require('../selectors/Westcancercenter.json');

async function scrapeWestcancercenter() {
    const browser = await playwright.chromium.launch({ headless: false });
    const page = await browser.newPage();

    try {
        await page.goto(selectors.url);

        await page.waitForSelector('.epop-dismiss', { timeout: 10000 }).catch(() => console.log('Pop-up not found'));
        const close = await page.$('.epop-dismiss');
        if (close) await close.click();

        await page.waitForSelector(selectors.locationsList);
        const cards = await page.$$(selectors.locationsList);
        console.log(`Found ${cards.length} cards \n --------------------`);

        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];

            await card.scrollIntoViewIfNeeded();
            await card.click();

            await page.waitForSelector(selectors.clinicName, { timeout: 10000 }).catch(() => console.log('Clinic name selector not found'));

            const clinicName = await getTextContent(page, selectors.clinicName);
            const doctorName = await getTextContent(page, selectors.doctorName);
            const fullAddress = await getTextContent(page, selectors.addressLink);
            let cleanedFullAddress = fullAddress.replace(/\s+/g, ' ').trim();

            console.log(`Website name: ${selectors.websiteName}`);
            console.log(`doctor name: ${doctorName}`);
            console.log(`Clinic name: ${clinicName}`);
            console.log(`Full Address: ${cleanedFullAddress}`);
            console.log(`----------------------------------- ${i + 1}`);

            const data = {
                websiteName: selectors.websiteName,
                websiteURL: selectors.url,
                clinicName: clinicName,
                doctorName: doctorName,
                fullAddress: cleanedFullAddress
            };

            // Uncomment the following line when ready to save data
            await saveData(data);

            if (i < cards.length - 1) {
                await page.goBack();
                await page.waitForLoadState('domcontentloaded');
                await page.waitForSelector(selectors.locationsList, { timeout: 10000 });
                const updatedCards = await page.$$(selectors.locationsList);
                cards[i + 1] = updatedCards[i + 1];
            }

            await page.waitForTimeout(1000);
        }
    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        await browser.close();
    }
}

async function getTextContent(page, selector) {
    try {
        return await page.$eval(selector, el => el.textContent.trim());
    } catch (error) {
        console.warn(`Warning: Could not find element with selector "${selector}". Returning empty string.`);
        return '';
    }
}

module.exports = { scrapeWestcancercenter };