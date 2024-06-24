import { builder, Handler } from '@netlify/functions';
import puppeteer from 'puppeteer';
import chromium from 'chrome-aws-lambda';


const myHandler: Handler = async (event, context) => {
  let browser;
  if (process.env.NETLIFY_DEV) {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  } else {
    browser = await chromium.puppeteer.launch({
      executablePath: await chromium.executablePath,
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
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