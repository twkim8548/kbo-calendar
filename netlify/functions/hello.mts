import { builder, Handler, Context, Config } from '@netlify/functions';
import chromium from '@sparticuz/chromium';
import dayjs from 'dayjs';


const selectGames: Handler = async (event, context) => {
  // 수동으로 쿼리 스트링 파라미터 파싱
  const rawQuery = event.rawQuery;
  const queryParams = new URLSearchParams(rawQuery);
  const date = queryParams.get('date');

  console.log("Selected Date: ", date);

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
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath('https://github.com/Sparticuz/chromium/releases/download/v121.0.0/chromium-v121.0.0-pack.tar'),
      headless: chromium.headless,
    });
  }

  const page = await browser.newPage();

  const searchDate = dayjs(date).format('YYYY년+M월+D일+야구경기일정');
  await page.goto(`https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=${searchDate}`);
  let fullData = [];

  // while (true) {
  // }
  // 데이터 추출
  await page.waitForSelector('#main_pack > section.sc_new.cs_sportsdb._cs_sports_schedule');
  const current = await page.$eval('#main_pack > section.sc_new.cs_sportsdb._cs_sports_schedule > div > div.api_cs_wrap > div.db_area._schedule_info > div.nv_date > strong', el => el.textContent.slice(0, -4));
  const dateToString = dayjs(`2024.${current}`).format('YYYY-MM-DD');

  const data = await page.evaluate((dateStr) => {
    const rows = document.querySelectorAll('#main_pack > section.sc_new.cs_sportsdb._cs_sports_schedule > div > div.api_cs_wrap > div.db_area._schedule_info > div.db_list > table > tbody tr');
    const tableData = [];

    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      const rowData = [];
      cells.forEach(cell => {
        const text = cell.innerText;
        switch (cell.className) {
          case 'time':
            rowData.push(`${dateStr} ${text.slice(0, -6)}:00+09`);
            break;
          case 'l_team':
          case 'r_team':
            const getId = (team) => {
              if (team.includes('키움')) {
                return 1;
              } else if (team.includes('삼성')) {
                return (2);
              } else if (team.includes('LG')) {
                return (3);
              } else if (team.includes('KT')) {
                return (4);
              } else if (team.includes('SSG')) {
                return (5);
              } else if (team.includes('NC')) {
                return (6);
              } else if (team.includes('두산')) {
                return (7);
              } else if (team.includes('KIA')) {
                return (8);
              } else if (team.includes('롯데')) {
                return (9);
              } else if (team.includes('한화')) {
                return (10);
              }
            };
            rowData.push(getId(text));
            break;
          case 'score':
            if (text.includes(':')) {
              rowData.push(parseInt(text.slice(0, text.indexOf(':'))));
              rowData.push(parseInt(text.slice(text.indexOf(':') + 2)));
            } else {
              rowData.push(text);
              rowData.push(text);
            }
            break;
          case 'place':
            rowData.push(text);
            // if (text.includes(':')) {
            //     rowData.push(parseInt(text.slice(0, text.indexOf(':'))))
            //     rowData.push(parseInt(text.slice(text.indexOf(':') + 2)))
            // } else {
            //     rowData.push(text);
            // }
            break;
          default:
            rowData.push(text);
            break;
        }
      });
      tableData.push(rowData);
    });
    return tableData;
  }, dateToString);
  fullData = [...fullData, ...data];

  console.log(fullData)

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Success', data: fullData }),
  };
};

const handler = builder(selectGames);

export { handler };