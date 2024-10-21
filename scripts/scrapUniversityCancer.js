const playwright = require('playwright');
const { saveData } = require('../utils/db');
const selectors = require('../selectors/UniversityCancer.json');

async function scrapUniversityCancer() {
    const browser = await playwright.chromium.launch({ headless: false });
    const page = await browser.newPage();

    try {
        await page.goto(selectors.url, { timeout: 100000 });

        await page.waitForSelector(selectors.locationsList);
        const cards = await page.$$(selectors.locationsList);
        console.log(`Found ${cards.length} cards \n --------------------`);


        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];

            await card.scrollIntoViewIfNeeded();

            const clinicName = await card.innerText();

            await card.click();

            await page.waitForSelector(selectors.addressMapsLink, { timeout: 30000 }).catch(() => console.warn('addressMapsLink selector not found'));

            const locationLink = await getAttribute(page, selectors.addressMapsLink, 'href');
            const fullAddress = await getAddress(page);
            const cleanedFullAddress = fullAddress.replace(/\s+/g, ' ').trim();


            console.log(`Website name: ${selectors.websiteName}`);
            console.log(`Clinic name: ${clinicName}`);
            console.log(`Full Address: ${cleanedFullAddress}`);
            console.log(`Address link: ${locationLink}`);

            console.log(`----------------------------------- ${i + 1}`);

            const data = {
                websiteName: selectors.websiteName,
                websiteURL: selectors.url,
                clinicName: clinicName,
                locationLink: locationLink,
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


async function getAddress(page) {

    const streetAddress = await getTextContent(page, "h3[itemprop='streetAddress']");
    const building = await getTextContent(page, "h3.address2");
    const city = await getTextContent(page, "h3.city_state_zip .city");
    const state = await getTextContent(page, "h3.city_state_zip .state");
    const zip = await getTextContent(page, "h3.city_state_zip .zip");


    // Combine the parts into a full address
    const fullAddress = building === ''
        ? `${streetAddress}, ${city} ${state} ${zip}`
        : `${streetAddress}, ${building}, ${city} ${state} ${zip}`;

    return fullAddress;

}
async function getTextContent(page, selector) {
    try {
        return await page.$eval(selector, el => el.textContent.trim());
    } catch (error) {
        console.warn(`Warning: Could not find element with selector "${selector}". Returning empty string.`);
        return '';
    }
}
async function getAttribute(page, selector, attribute) {
    try {
        return await page.$eval(selector, (el, attr) => el.getAttribute(attr), attribute);
    } catch (error) {
        console.warn(`Warning: Could not find element with selector "${selector}" or attribute "${attribute}". Returning empty string.`);
        return '';
    }
}
module.exports = { scrapUniversityCancer };