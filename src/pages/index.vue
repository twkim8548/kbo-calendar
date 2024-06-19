<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { supabase } from '@/lib/supabaseClient';
import dayjs from 'dayjs';
import { useGetTeamImage } from '@/composables/team';

const games = ref<any>([]);

async function getCountries() {
  const { data } = await supabase
    .from('games')
    .select(
      `id, home_club_id, home_club:clubs!games_home_club_id_fkey (id, name), away_club_id, away_club:clubs!games_away_club_id_fkey (id, name), stadium_id, stadium:stadiums!games_stadium_id_fkey (id, name, address), home_score, away_score, match_day`,
    )
    .gte('match_day', dayjs().hour(0).minute(0).second(0).toISOString())
    .lte('match_day', dayjs().hour(23).minute(59).second(59).toISOString());
  games.value = data;
}

onMounted(() => {
  getCountries();
});
</script>
<template>
  <div class="flex flex-col gap-[20px]">
    <div class="flex flex-col">
      오늘의 경기
      {{ dayjs().hour(0).minute(0).second(0).format('YYYY-MM-DD') }}
      <div v-for="game in games">
        <img :src="useGetTeamImage(game.home_club.name)" />
        {{
          `${game.home_club.name} ${game?.home_score}:${game?.away_score} ${game.away_club.name} ${game.stadium.name}`
        }}
        <img :src="useGetTeamImage(game.away_club.name)" />
      </div>
    </div>
  </div>
</template>
