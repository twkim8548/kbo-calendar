import { builder, Handler } from '@netlify/functions'
import puppeteer from 'puppeteer';

const myHandler: Handler = async (event, context) => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
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