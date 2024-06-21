<script setup lang="ts">
import dayjs, { Dayjs } from 'dayjs';
import { useGetTeamImage, useGetTeamNaverInitial } from '@/composables/team';
import { useGameStore } from '@/stores/game';
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';

const gameStore = useGameStore();

const { games } = storeToRefs(gameStore);

const openNaverPreview = (date: Dayjs, homeId: number, awayId: number) => {
  window.open(
    `https://m.sports.naver.com/game/${date.format('YYYYMMDD')}${useGetTeamNaverInitial(awayId)}${useGetTeamNaverInitial(homeId)}02024`,
    '_blank',
  );
};
onMounted(() => {
  gameStore.selectGames(
    dayjs().hour(0).minute(0).second(0),
    dayjs().hour(23).minute(59).second(59),
  );
});
</script>

<template>
  <div class="flex flex-col items-center gap-[15px]">
    <div class="flex flex-col items-center">
      <p class="text-sm">
        {{ dayjs().hour(0).minute(0).second(0).format('YYYY-MM-DD') }}
      </p>
      <p class="text-xl font-bold text-primary">오늘의 경기</p>
    </div>
    <div class="flex flex-col gap-[20px] items-center">
      <div
        class="flex items-center gap-[5px]"
        v-for="game in games?.[dayjs().format('YYYY-MM-DD')]"
        :key="`today${game.id}`"
      >
        <div class="flex items-center gap-[10px]">
          <img :src="useGetTeamImage(game?.home_club?.id)" class="w-[50px]" alt="logo" />
          <div class="flex flex-col items-center">
            <div class="flex items-center gap-[5px]">
              <p class="font-bold">
                {{ game?.home_club?.name }}
              </p>
              :
              <p class="font-bold">
                {{ game?.away_club?.name }}
              </p>
            </div>
            <p class="text-xs">
              {{ game.stadium.name }}
            </p>
            <button
              class="border-gray-300 px-[4px] py-[2px] border rounded-md text-xs shadow-sm cursor-pointer hover:bg-gray-50"
              @click="openNaverPreview(dayjs(), game?.home_club?.id, game?.away_club?.id)"
            >
              경기 분석
            </button>
          </div>
          <img :src="useGetTeamImage(game?.away_club?.id)" class="w-[50px]" alt="logo" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
