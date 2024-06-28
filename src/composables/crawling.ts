import { useApi } from '@/composables/api';
import { supabase } from '@/lib/supabaseClient';

export const crawlingGames = async (date: string) => {
  await useApi('GET', '/.netlify/functions/games', { date: date })
    .then((response) => {
      console.log(response);
      return response;
    })
    .catch((error) => {
      console.log(error);
    });

  // const fullData = [
  //   {
  //     match_day: '2024-06-25 18:30:00+09',
  //     home_club_id: 5,
  //     away_club_id: 4,
  //     away_score: null,
  //     home_score: null,
  //     stadium_id: 1,
  //   },
  //   {
  //     match_day: '2024-06-25 18:30:00+09',
  //     home_club_id: 9,
  //     away_club_id: 8,
  //     away_score: null,
  //     home_score: null,
  //     stadium_id: 1,
  //   },
  //   {
  //     match_day: '2024-06-25 18:30:00+09',
  //     home_club_id: 10,
  //     away_club_id: 7,
  //     away_score: null,
  //     home_score: null,
  //     stadium_id: 1,
  //   },
  //   {
  //     match_day: '2024-06-25 18:30:00+09',
  //     home_club_id: 1,
  //     away_club_id: 6,
  //     away_score: null,
  //     home_score: null,
  //     stadium_id: 1,
  //   },
  //   {
  //     match_day: '2024-06-25 18:30:00+09',
  //     home_club_id: 3,
  //     away_club_id: 2,
  //     away_score: null,
  //     home_score: null,
  //     stadium_id: 1,
  //   },
  // ];
  // const { data, error } = await supabase.from('games').insert(fullData).select();
  // console.log(data);
  // console.log(error);
};
