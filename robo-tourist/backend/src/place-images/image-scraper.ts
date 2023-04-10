import * as cheerio from "cheerio";
import puppeteer, { Browser, Page } from "puppeteer";
import { getPlaceNameVariations } from "./image-scraper-utils";

export const getImagesFromGoogleSearch = async (
  places: string[],
  target: string
): Promise<(string | null)[]> => {
  const puppeteerLaunchParams =
    process.env.PUPPETEER_EXECUTABLE === "chrome"
      ? {
          executablePath: "/usr/bin/google-chrome",
          headless: true,
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
        }
      : {};
  var browser: Browser;

  try {
    browser = await puppeteer.launch(puppeteerLaunchParams);
  } catch (error: any) {
    throw error;
  }

  try {
    if (process.env.SCRAPING_METHOD === "parallel") {
      const promises = places.map((place) =>
        getSingleImage(place, target, browser)
      );

      const urls = ((await Promise.allSettled(promises)) as any[]).map(
        (result) =>
          (result.status = "fulfilled" ? (result.value as string) : null)
      );

      return urls;
    } else {
      const urls: (string | null)[] = [];
      const page = await browser.newPage();
      for (const place in places) {
        const url = await getSingleImage(place, target, browser, page);
        urls.push(url || null);
      }
      return urls;
    }
  } catch (error: any) {
    throw error;
  } finally {
    // await browser?.close();
  }
};

const searchUrl = (query: string, target: string) =>
  `https://www.google.com/search?q=${encodeURIComponent(
    query.includes(target) ? query : query + "," + target
  )}&tbm=isch`;

const getSingleImage = async (
  place: string,
  target: string,
  browser: Browser,
  currentPage?: Page // if browser page not provided, a new page will be created (used for parallel scraping)
) => {
  const page = currentPage || (await browser.newPage());

  try {
    await page.goto(searchUrl(place, target), { waitUntil: "networkidle2" });

    const html = await page.content();

    const $ = await cheerio.load(html);

    return firstImageElement(place, $);
  } catch (error: any) {
    console.log(error.message);
  } finally {
  }
};

const firstImageElement = (placeName: string, $: cheerio.CheerioAPI) => {
  const variations = getPlaceNameVariations(placeName);
  for (const variation of variations) {
    const imageUrl = $(`img[alt*="${variation.trim()}" i]`).attr("src");
    if (imageUrl) return imageUrl;
  }
};
// console.time("dbsave");
// getImagesFromGoogleSearch(["Tre cime di lavaredo", "London", "paris", "ordesa"]).then(
//   (result) => {
//     console.log(result);
//     console.timeEnd("dbsave");
//   }
// );
