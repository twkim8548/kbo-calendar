<script setup lang="ts">
import dayjs, { Dayjs } from 'dayjs';
import { useGetTeamImage, useGetTeamNaverInitial } from '@/composables/team';
import { useGameStore } from '@/stores/game';
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useContentsStore } from '@/stores/contents';

const gameStore = useGameStore();
const contentStore = useContentsStore();

const { games } = storeToRefs(gameStore);
const { youtubes } = storeToRefs(contentStore);

const openNaverPreview = (date: Dayjs, homeId: number, awayId: number) => {
  window.open(
    `https://sports.naver.com/game/${date.format('YYYYMMDD')}${useGetTeamNaverInitial(awayId)}${useGetTeamNaverInitial(homeId)}02024`,
    '_blank',
  );
};

const openTving = (date: Dayjs, homeId: number, awayId: number) => {
  window.open(
    `https://www.tving.com/kbo/contents/${date.format('YYYYMMDD')}${useGetTeamNaverInitial(awayId)}${useGetTeamNaverInitial(homeId)}02024`,
    '_blank',
  );
};

onMounted(() => {
  gameStore.selectGames(
    dayjs().hour(0).minute(0).second(0),
    dayjs().hour(23).minute(59).second(59),
  );

  contentStore.selectYoutubes();
});
</script>

<template>
  <div class="flex flex-col items-center gap-[30px]">
    <div class="flex flex-col items-center gap-[15px]">
      <div class="flex flex-col items-center">
        <p class="text-sm">
          {{ dayjs().hour(0).minute(0).second(0).format('YYYY-MM-DD') }}
        </p>
        <p class="text-xl font-bold text-primary">오늘의 경기</p>
      </div>
      <div
        class="flex flex-col gap-[20px] items-center"
        v-if="games?.[dayjs().format('YYYY-MM-DD')]"
      >
        <div
          class="flex items-center gap-[5px]"
          v-for="game in games?.[dayjs().format('YYYY-MM-DD')]"
          :key="`today${game.id}`"
        >
          <div class="flex items-center gap-[10px]">
            <img :src="useGetTeamImage(game?.home_club?.id)" class="w-[50px]" alt="logo" />
            <div class="flex flex-col items-center gap-[5px]">
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
              <div class="flex flex-col gap-[5px] items-center">
                <button
                  class="border-gray-300 px-[4px] py-[2px] border rounded-md text-xs shadow-sm cursor-pointer hover:bg-gray-50"
                  @click="openNaverPreview(dayjs(), game?.home_club?.id, game?.away_club?.id)"
                >
                  경기 분석
                </button>
                <button
                  class="border-gray-300 px-[4px] py-[2px] border rounded-md text-xs shadow-sm cursor-pointer hover:bg-gray-50"
                  @click="openTving(dayjs(), game?.home_club?.id, game?.away_club?.id)"
                >
                  경기 보러가기
                </button>
              </div>
            </div>
            <img :src="useGetTeamImage(game?.away_club?.id)" class="w-[50px]" alt="logo" />
          </div>
        </div>
      </div>
      <div v-else>오늘은 경기가 없어요..</div>
    </div>
    <div class="flex flex-col gap-[5px] w-full" v-if="youtubes?.length > 0">
      <p class="text-xl font-bold text-primary self-center">이런 영상은 어때요?</p>
      <div class="flex overflow-x-auto gap-[10px] w-full">
        <iframe
          v-for="youtube in youtubes"
          :src="`https://www.youtube.com/embed/${youtube?.id?.videoId}`"
          class="border-none overflow-visible shrink-0 w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          width="500"
          height="400"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
