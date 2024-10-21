const playwright = require('playwright');
const { saveData } = require('../utils/db');
const selectors = require('../selectors/Lacancernetwork.json');

async function scrapeLacancernetwork() {
    const browser = await playwright.chromium.launch({ headless: false });
    const page = await browser.newPage();

    try {
        await page.goto(selectors.url, { timeout: 60000 });

        await page.waitForSelector(selectors.locationsList);
        const cards = await page.$$(selectors.locationsList);
        console.log(`Found ${cards.length} cards \n --------------------`);


        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];

            await card.scrollIntoViewIfNeeded();
            await card.click();

            await page.waitForSelector(selectors.clinicName, { timeout: 5000 }).catch(() => console.warn('Clinic name selector not found'));

            const clinicName = await getTextContent(page, selectors.clinicName);
            //

            const locationElements = await page.$$(selectors.addressLink);
            let href = "";
            let fullAddress = "";

            for (const element of locationElements) {
                href = await element.getAttribute('href');
                const text = await element.textContent();
                console.log(`Location: ${text}, Href: ${href}`);
                fullAddress += text;
            }

            //
            const cleanedFullAddress = fullAddress.replace(/\s+/g, ' ').trim();
            const locationLink = href;


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
module.exports = { scrapeLacancernetwork };