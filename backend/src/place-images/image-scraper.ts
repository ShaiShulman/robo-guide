import * as cheerio from "cheerio";
import puppeteer, { Browser, Page } from "puppeteer";
import { getPlaceNameVariations, searchUrl } from "./image-scraper-utils";
import { getImageFromCache, setImageToCache } from "./image-cache";
import { TEXT_COLOR } from "../const";

const TARGET_DELIMITER = ",";

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
      for (const place of places) {
        const url = await getSingleImage(
          place,
          target.split(TARGET_DELIMITER)[0],
          browser,
          page
        );
        urls.push(url || null);
      }
      return urls;
    }
  } catch (error: any) {
    throw error;
  } finally {
    await browser?.close();
  }
};

const getSingleImage = async (
  place: string,
  target: string,
  browser: Browser,
  currentPage?: Page // if browser page not provided, a new page will be created (used for parallel scraping)
) => {
  const page = currentPage || (await browser.newPage());

  const cache = await getImageFromCache({ place, target });
  if (cache) {
    console.log(
      TEXT_COLOR.green,
      `Image for ${place} (${target.slice(0, 10)}) provided from cache`,
      TEXT_COLOR.black
    );
    return cache;
  }

  try {
    await page.goto(searchUrl(place, target), { waitUntil: "networkidle2" });

    const html = await page.content();

    const $ = await cheerio.load(html);

    const url = firstImageElement(place, $);
    if (url) {
      console.log(
        TEXT_COLOR.green,
        `Image for ${place} (${target.slice(0, 10)}) provided from scraper`,
        TEXT_COLOR.black
      );
      setImageToCache({ place, target, image: url });
    } else
      console.log(
        TEXT_COLOR.green,
        `Image for ${place} (${target.slice(0, 10)}) not found`,
        TEXT_COLOR.black
      );

    return url;
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
