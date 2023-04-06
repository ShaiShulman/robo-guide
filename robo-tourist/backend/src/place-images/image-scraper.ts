import * as cheerio from "cheerio";
import puppeteer, { Browser } from "puppeteer";
import { getPlaceNameVariations } from "./image-scraper-utils";

export const getImagesFromGoogleSearch = async (
  places: string[],
  target: string
): Promise<(string | null)[]> => {
  var browser: Browser;

  try {
    var browser = await puppeteer.launch({
      executablePath: "/usr/bin/google-chrome",
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  } catch (error: any) {
    throw error;
  }

  try {
    const promises = places.map((place) =>
      getSingleImage(place, target, browser)
    );

    const urls = ((await Promise.allSettled(promises)) as any[]).map(
      (result) =>
        (result.status = "fulfilled" ? (result.value as string) : null)
    );

    return urls;
  } catch (error: any) {
    throw error;
  } finally {
    await browser?.close();
  }
};

const searchUrl = (query: string, target: string) =>
  `https://www.google.com/search?q=${encodeURIComponent(
    query.includes(target) ? query : query + "," + target
  )}&tbm=isch`;

const getSingleImage = async (
  place: string,
  target: string,
  browser: Browser
) => {
  const page = await browser.newPage();

  try {
    await page.goto(searchUrl(place, target), { waitUntil: "networkidle2" });

    const html = await page.content();
    const $ = cheerio.load(html);

    return firstImageElement(place, $);
  } catch (error: any) {
    console.log(error.message);
  } finally {
    try {
      await page.close();
    } catch (error) {}
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
