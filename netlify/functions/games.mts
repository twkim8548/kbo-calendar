import { builder, Handler } from '@netlify/functions';
import chromium from '@sparticuz/chromium';
import dayjs from 'dayjs';
import { createClient } from '@supabase/supabase-js';


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
      headless: false,
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
      const rowData = {
        match_day: "",
        home_club_id: 0,
        away_club_id: 0,
        away_score: null,
        home_score: null,
        stadium_id: null,
      };
      cells.forEach(cell => {
        const text = cell.innerText;
        console.log(text, cell.className);
        switch (cell.className) {
          case 'time':
            rowData['match_day'] = (`${dateStr} ${text.slice(0, -6)}:00+09`).replace(" 알림", "");
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
            if (cell.className === 'l_team') {
              rowData['away_club_id'] = (getId(text));
            } else {
              rowData['home_club_id'] = (getId(text));
            }
            break;
          case 'score':
            if (text.includes(':')) {
              const homeScore = parseInt(text.slice(text.indexOf(':') + 2));
              const awayScore = parseInt(text.slice(0, text.indexOf(':')));
              rowData['home_score'] = homeScore;
              rowData['away_score'] = awayScore;
              if (homeScore > awayScore) {
                rowData['result'] = '승'
              } else if (homeScore < awayScore) {
                rowData['result'] = '패'
              } else {
                rowData['result'] = '무'
              }
            }
            break;
          case 'place':
            const getStadiumId = (stadium) => {
              if (stadium.includes('창원')) {
                return 5
              } else if (stadium.includes('수원')) {
                return 3
              } else if (stadium.includes('사직')) {
                return 8
              } else if (stadium.includes('대전')) {
                return 12
              } else if (stadium.includes('이천')) {
                return 15
              } else if (stadium.includes('대구')) {
                return 10
              } else if (stadium.includes('잠실')) {
                return 1
              } else if (stadium.includes('문학')) {
                return 4
              } else if (stadium.includes('광주')) {
                return 6
              } else if (stadium.includes('고척')) {
                return 2
              } else if (stadium.includes('청주')) {
                return 13
              } else if (stadium.includes('울산')) {
                return 9
              } else if (stadium.includes('포항')) {
                return 11
              }
            }
            rowData['stadium_id'] = getStadiumId(text);
            break;
          case 'btns': {
            if (text === '경기취소') {
              rowData['is_cancel'] = true;
            } else {
              rowData['is_cancel'] = false;
            }
            break;
          }
          default:
            break;
        }
      });
      tableData.push(rowData);
    });
    return tableData;
  }, dateToString);
  fullData = [...fullData, ...data];
  console.log(fullData)

  const supabase = createClient(process.env.VITE_SUPABASE_PROJECT_URL, process.env.VITE_SUPABASE_ANON_KEY);

  const { error } =
    await supabase.from('games')
      .upsert(fullData, {onConflict: ['match_day', 'home_club_id', 'away_club_id']})
      .select();
  console.log(error)

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    'Content-Type': 'application/json; charset=utf-8;'
  };
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ message: 'Success', data: fullData }),
  };
};

const handler = builder(selectGames);

export { handler };