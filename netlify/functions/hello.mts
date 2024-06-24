import { builder, Handler } from '@netlify/functions';
import chromium from '@sparticuz/chromium';


const myHandler: Handler = async (event, context) => {
  let browser;
  let puppeteer;

  if (process.env.NETLIFY_DEV) {
    puppeteer = await import('puppeteer');
  } else {
    puppeteer = await import('puppeteer-core');
  }
  if (process.env.NETLIFY_DEV) {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  } else {
    console.log(await chromium.executablePath())
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
  }

  const page = await browser.newPage();

  await page.goto('https://naver.com');
  const content = await page.content();

  await browser.close();

  return {
    statusCode: 200,
    body: JSON.stringify({ content }),
  };
};

const handler = builder(myHandler);

export { handler };