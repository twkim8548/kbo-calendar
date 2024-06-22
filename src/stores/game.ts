import { defineStore } from 'pinia';
import { supabase } from '@/lib/supabaseClient';
import dayjs, { Dayjs } from 'dayjs';
import { ref } from 'vue';

export const useGameStore = defineStore('game', () => {
  const games = ref<any>([]);

  const selectGames = async (startDate: Dayjs, endDate: Dayjs) => {
    const { data } = await supabase
      .from('games')
      .select(
        `id, home_club_id, home_club:clubs!games_home_club_id_fkey (id, name, bg_color), away_club_id, away_club:clubs!games_away_club_id_fkey (id, name), stadium_id, stadium:stadiums!games_stadium_id_fkey (id, name, address), home_score, away_score, match_day`,
      )
      .order('home_club_id')
      .gte('match_day', startDate.hour(0).minute(0).second(0).toISOString())
      .lte('match_day', endDate.hour(23).minute(59).second(59).toISOString());

    games.value = data?.reduce((acc: any, match: any) => {
      const date = dayjs(match.match_day).format('YYYY-MM-DD');
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(match);
      return acc;
    }, {});
  };

  return {
    selectGames,
    games,
  };
});
