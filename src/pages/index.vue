<script setup lang="ts">
import { ref, watch } from 'vue';
import dayjs, { Dayjs } from 'dayjs';
import { useGetTeamImage, useGetTeamNaverInitial } from '@/composables/team';
import Calendar from '@/components/Calendar.vue';
import { useGameStore } from '@/stores/game';
import { storeToRefs } from 'pinia';

const gameStore = useGameStore();

const showType = ref('today');
const { games } = storeToRefs(gameStore);

const openNaverPreview = (date: Dayjs, homeId: number, awayId: number) => {
  window.open(
    `https://m.sports.naver.com/game/${date.format('YYYYMMDD')}${useGetTeamNaverInitial(awayId)}${useGetTeamNaverInitial(homeId)}02024`,
    '_blank',
  );
};

watch(showType, () => {
  switch (showType.value) {
    case 'today': {
      gameStore.selectGames(
        dayjs().hour(0).minute(0).second(0),
        dayjs().hour(23).minute(59).second(59),
      );
      break;
    }
  }
});
</script>
<template>
  <main class="flex flex-col gap-[20px]">
    <div class="overflow-x-auto flex items-center shrink-0 justify-center gap-[10px]">
      <button
        class="px-[4px] py-[2px] border rounded-md text-xs shadow-sm cursor-pointer"
        :class="
          showType === 'today'
            ? 'bg-accent text-white border-accent'
            : 'border-gray-300 hover:bg-gray-50'
        "
        @click="showType = 'today'"
      >
        오늘 경기
      </button>
      <button
        class="px-[4px] py-[2px] border rounded-md text-xs shadow-sm cursor-pointer"
        :class="
          showType === 'calendar'
            ? 'bg-accent text-white border-accent'
            : 'border-gray-300 hover:bg-gray-50'
        "
        @click="showType = 'calendar'"
      >
        일정 달력
      </button>
    </div>
    <div class="flex flex-col items-center gap-[15px]" v-if="showType === 'today'">
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
    <calendar v-else />
  </main>
</template>
