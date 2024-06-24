import { builder, Handler } from '@netlify/functions'
import puppeteer from 'puppeteer';
import chromium from 'chrome-aws-lambda';


const myHandler: Handler = async (event, context) => {
  let browser;
  if (process.env.NETLIFY_DEV) {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  } else {

  browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
  });
  }
  const page = await browser.newPage();

  await page.goto('https://naver.com'); // 원하는 URL로 변경
  const content = await page.content(); // 페이지 콘텐츠 가져오기

  await browser.close();

  return {
    statusCode: 200,
    body: JSON.stringify({ content })
  };
}

const handler = builder(myHandler)

export { handler }