var parse = require('url-parse')

const scraperObject = {
    async scraper(browser, url) {
        let page = await browser.newPage();
        console.log(`Navigating to ${url}...`);

        // Navigate to the selected page && Wait for the required DOM to be rendered
        await page.goto(url, { waitUntil: 'networkidle2' });

        // Parsing url to get hostname
        const parsedUrl = parse(url, true);

        async function scrapeCurrentPage(url) {

            // Declaring items to scrape
            let title = "",
                imgSrc = "",
                author = "",
                description = "",
                tags = [];

            switch (url.hostname) {
                // If hostname is food52.com
                case "food52.com":
                    try {
                        title = await page.$eval("head > meta[name='sailthru.title']", element => element.content);
                        imgSrc = await page.$eval("head > meta[property='og:image']", element => element.content);
                        author = await page.$eval("head > meta[name='sailthru.author']", element => element.content);
                        description = await page.$eval("head > meta[name='description']", element => element.content);
                        tags = await page.$eval("head > meta[name='sailthru.tags']", element => element.content);
                        tags = tags.split(",")
                    } catch (error) {
                        console.error(error)
                    }
                    break;
                // If hostname is www.seriouseats.com
                case "www.seriouseats.com":
                    try {
                        title = await page.$eval("head > meta[property='og:title']", element => element.content);
                        imgSrc = await page.$eval("head > meta[property='og:image']", element => element.content);
                        author = await page.$eval("div.author-byline.brief > div > span > a", element => element.innerText);
                        description = await page.$eval("head > meta[name='description']", element => element.content);
                        tags = await page.evaluate(() => Array.from(document.querySelectorAll('header > div.breadcrumbs > ul > li > a > strong'), element => element.textContent))
                    } catch (error) {
                        console.error(error)
                    }
                    break;
                // If hostname is www.bonappetit.com
                case "www.bonappetit.com":
                    try {
                        title = await page.$eval("head > meta[property='og:title']", element => element.content);
                        imgSrc = await page.$eval("head > meta[property='og:image']", element => element.content);
                        author = await page.$eval("head > meta[name='author']", element => element.content);
                        description = await page.$eval("head > meta[name='description']", element => element.content);
                        tags = await page.$eval("head > meta[name='keywords']", element => element.content);
                        tags = tags.split(",")
                    } catch (error) {
                        console.error(error)
                    }
                    break;
                // If hostname is cooking.nytimes.com
                case "cooking.nytimes.com":
                    try {
                        title = await page.$eval("head > meta[property='og:title']", element => element.content);
                        imgSrc = await page.$eval("head > meta[property='og:image']", element => element.content);
                        author = await page.$eval("div.nytc---recipebyline---bylinePart > a", element => element.textContent);
                        description = await page.$eval("head > meta[name='description']", element => element.content);
                        tags = await page.evaluate(() => Array.from(document.querySelectorAll('div.tags-nutrition-container > a'), element => element.textContent))
                    } catch (error) {
                        console.error(error)
                    }
                    break;
                //If hostname is www.cooksillustrated.com
                case "www.cooksillustrated.com":
                    try {
                        title = await page.$eval("head > meta[property='og:title']", element => element.content);
                        imgSrc = await page.$eval("img.recipe-detail-header__image", element => element.src);
                        // author = await page.$eval("head > meta[name='author']", element => element.content);
                        if (await page.$("span.toggle") !== null) {
                            await page.click("span.toggle")
                        }
                        description = await page.$eval("div.recipe-detail-header__why > div > div > p", element => {
                            let split = element.textContent.split(" ")
                            return split.slice(0, -2).join(" ")
                        });
                        tags = await page.$eval("head > meta[name='atk:keywords']", element => element.content);
                        tags = tags.split(",")
                    } catch (error) {
                        console.error(error)
                    }
                    break;
                //If hostname is www.chefsteps.com
                case "www.chefsteps.com":
                    try {
                        title = await page.$eval("head > meta[property='og:title']", element => element.content);
                        imgSrc = await page.$eval("head > meta[property='og:image']", element => element.content);
                        description = await page.$eval("head > meta[property='og:description']", element => element.content);
                        tags = await page.$eval("head > meta[name='keywords']", element => {
                            let cleaned = element.content.replace(/"/g, '').replace("[", "").replace("]", "")
                            return cleaned
                        });
                        tags = tags.split(",")
                    } catch (error) {
                        console.error(error)
                    }
                    break;
                //If hostname is smittenkitchen.com
                case "smittenkitchen.com":
                    try {
                        title = await page.$eval("head > meta[property='og:title']", element => element.content);
                        imgSrc = await page.$eval("head > meta[property='og:image']", element => element.content);
                        description = await page.$eval("head > meta[property='og:description']", element => element.content);
                        tags = await page.evaluate(() => Array.from(document.querySelectorAll('span.cat-links > a'), element => element.textContent))
                    } catch (error) {
                        console.error(error)
                    }
                    break;
                //If hostname is www.justonecookbook.com
                case "www.justonecookbook.com":
                    try {
                        title = await page.$eval("head > meta[property='og:title']", element => element.content);
                        imgSrc = await page.$eval("head > meta[property='og:image']", element => element.content);
                        author = await page.$eval("div.wprm-recipe-author-container > span.wprm-recipe-author", element => element.textContent);
                        description = await page.$eval("head > meta[property='og:description']", element => element.content);
                        tags = await page.$eval("div.wprm-recipe-keyword-container > span.wprm-recipe-keyword", element => element.textContent);
                        tags = tags.split(",")
                    } catch (error) {
                        console.error(error)
                    }
                    break;
                // If hostname is www.101cookbooks.com
                case "www.101cookbooks.com":
                    try {
                        title = await page.$eval("head > meta[property='og:title']", element => element.content);
                        imgSrc = await page.$eval("head > meta[property='og:image']", element => element.content);
                        author = await page.$eval("head > meta[property='article:author']", element => element.content);
                        description = await page.$eval("head > meta[name='description']", element => element.content);
                    } catch (error) {
                        console.error(error)
                    }
                    break;
                // If hostname is omnivorescookbook.com
                case "omnivorescookbook.com":
                    try {
                        title = await page.$eval("head > meta[property='og:title']", element => element.content);
                        imgSrc = await page.$eval("head > meta[property='og:image']", element => element.content);
                        description = await page.$eval("head > meta[property='og:description']", element => element.content);
                    } catch (error) {
                        console.error(error)
                    }
                    break;
                default:
                    break;
            }

            //Removing unwanted nested html tags in text
            const regex = /(<([^>]+)>)/ig;
            description = description.replace(regex, "");

            const data = {
                title,
                imgSrc,
                author,
                description,
                tags
            }
            await page.close();
            return data
        }
        let data = await scrapeCurrentPage(parsedUrl);
        return data;
    }
}

module.exports = scraperObject;