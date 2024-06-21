<script setup lang="ts">
import dayjs, { Dayjs } from 'dayjs';
import { useGetTeamImage } from '@/composables/team';
import { onMounted, ref, watch } from 'vue';
import { useGameStore } from '@/stores/game';
import { storeToRefs } from 'pinia';
import { days, getWeekOfMonth, useDayjs } from '@/composables/date';

const gameStore = useGameStore();

const { games } = storeToRefs(gameStore);
const selectedDate = ref<Dayjs>(dayjs());
const dates = ref<Dayjs[]>([]);
const isShowCalendarShowTypeMenu = ref(false);
const calendarShowType = ref('week');

const initCalendar = () => {
  dates.value = [];
  switch (calendarShowType.value) {
    case 'month': {
      // 월단위 캘린더 날짜 삽입
      const firstDate = dayjs(selectedDate.value).startOf('month');
      const lastDate = dayjs(selectedDate.value).endOf('month');

      for (let i = firstDate.day(); i > 0; i--) {
        dates.value.push(firstDate.subtract(i, 'day'));
      }
      for (let i = 1; i <= lastDate.get('date'); i++) {
        dates.value.push(selectedDate.value.date(i));
      }
      for (let i = 1; i < 7 - lastDate.day(); i++) {
        dates.value.push(lastDate.add(i, 'day'));
      }
      break;
    }
    case 'week': {
      // 주단위 캘린더 날짜 삽입
      let firstDate = dayjs(selectedDate.value).startOf('week');
      const endDate = dayjs(selectedDate.value).endOf('week');

      while (firstDate.isSameOrBefore(endDate)) {
        dates.value.push(firstDate);
        firstDate = firstDate.add(1, 'day');
      }
      break;
    }
    case 'day': {
      dates.value.push(selectedDate.value);
      break;
    }
  }
  gameStore.selectGames(dates.value[0], dates.value[dates.value.length - 1]);
};

const changeCalendarShowType = (type: string) => {
  calendarShowType.value = type;
  isShowCalendarShowTypeMenu.value = false;
  initCalendar();
};

const clickPrev = () => {
  switch (calendarShowType.value) {
    case 'month': {
      if (selectedDate.value.get('M') >= 3) {
        selectedDate.value = selectedDate.value.subtract(1, 'month');
      }
      break;
    }
    case 'week': {
      if (selectedDate.value.week() >= 10) {
        selectedDate.value = selectedDate.value.subtract(1, 'week');
      }
    }
  }
};

const clickNext = () => {
  switch (calendarShowType.value) {
    case 'month': {
      if (selectedDate.value.get('M') < 11) {
        selectedDate.value = selectedDate.value.add(1, 'month');
      }
      break;
    }
    case 'week': {
      if (selectedDate.value.week() < 40) {
        selectedDate.value = selectedDate.value.add(1, 'week');
      }
    }
  }
};

onMounted(() => {
  initCalendar();
});

watch(selectedDate, () => {
  initCalendar();
});
</script>

<template>
  <div class="lg:flex lg:h-full lg:flex-col">
    <header
      class="flex items-center justify-between border-b border-gray-200 px-6 py-4 lg:flex-none"
    >
      <div class="flex flex-col gap-[10px]">
        <div class="flex gap-[5px] text-base font-semibold leading-6 text-gray-900">
          <time :datetime="selectedDate.toISOString()">
            {{ useDayjs()(selectedDate).format('YYYY년 MMMM') }}
          </time>
          <p v-if="calendarShowType === 'week'">{{ getWeekOfMonth(selectedDate) }}주차</p>
          <p v-if="calendarShowType === 'day'">{{ useDayjs()(selectedDate).format('D') }}일</p>
        </div>
        <div class="relative flex items-center rounded-md bg-white shadow-sm w-fit">
          <button
            type="button"
            class="flex h-6 w-10 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative"
            @click="clickPrev"
          >
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fill-rule="evenodd"
                d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
          <span class="relative -mx-px h-5 w-px bg-gray-300"></span>
          <button
            type="button"
            class="flex h-6 w-10 items-center justify-center rounded-r-md border-y border-r border-gray-300 pl-1 text-gray-400 hover:text-gray-500 focus:relative"
            @click="clickNext"
          >
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fill-rule="evenodd"
                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
      <div class="flex items-center">
        <div class="ml-4 flex items-center">
          <div class="relative">
            <button
              type="button"
              class="flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              id="menu-button"
              aria-expanded="false"
              aria-haspopup="true"
              @click="isShowCalendarShowTypeMenu = !isShowCalendarShowTypeMenu"
            >
              {{
                calendarShowType === 'day'
                  ? '일별 보기'
                  : calendarShowType === 'week'
                    ? '주별 보기'
                    : '월별 보기'
              }}
              <svg
                class="-mr-1 h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
            <transition name="fade">
              <div
                class="absolute right-0 z-10 mt-1 w-36 origin-top-right overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
                tabindex="-1"
                v-if="isShowCalendarShowTypeMenu"
              >
                <div class="py-1" role="none">
                  <div
                    class="block px-4 py-2 text-sm cursor-pointer"
                    :class="
                      calendarShowType === 'day' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    "
                    @click="changeCalendarShowType('day')"
                  >
                    일별 보기
                  </div>
                  <div
                    class="block px-4 py-2 text-sm cursor-pointer"
                    :class="
                      calendarShowType === 'week' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    "
                    @click="changeCalendarShowType('week')"
                  >
                    주별 보기
                  </div>
                  <div
                    class="block px-4 py-2 text-sm cursor-pointer"
                    :class="
                      calendarShowType === 'month' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    "
                    @click="changeCalendarShowType('month')"
                  >
                    월별 보기
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </header>
    <main class="shadow ring-1 ring-black ring-opacity-5 lg:flex lg:flex-auto lg:flex-col">
      <div
        class="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs font-semibold leading-6 text-gray-700 lg:flex-none"
      >
        <div
          class="flex flex-col items-center justify-center bg-white py-2"
          v-for="(day, i) in days"
          :key="`day${i}`"
        >
          <span class="text-sm" :class="{ 'text-red-500': i === 0, 'text-blue-500': i === 6 }">
            {{ day }}
          </span>
          <p class="text-xs font-normal" v-if="calendarShowType === 'week'">
            {{ dates?.[i]?.format('D일') }}
          </p>
        </div>
      </div>
      <div class="flex bg-gray-200 text-xs leading-6 text-gray-700 lg:flex-auto">
        <div v-if="calendarShowType === 'week'" class="w-full grid grid-cols-7 grid-rows-1 gap-px">
          <div
            v-for="date in dates"
            :key="date.toString()"
            type="button"
            class="flex flex-col hover:bg-gray-100 focus:z-10 min-h-[130px]"
            :class="date.get('M') === selectedDate.get('M') ? 'bg-white' : 'bg-gray-50'"
          >
            <div
              class="flex flex-col gap-[5px] h-full py-[5px]"
              v-if="date.get('M') === selectedDate.get('M')"
            >
              <div
                v-for="game in games?.[date.format('YYYY-MM-DD')]"
                class="flex items-center w-full justify-between"
                :key="game.id"
              >
                <img :src="useGetTeamImage(game?.home_club?.id)" class="w-[12px]" alt="logo" />
                <div
                  class="flex items-center text-xs"
                  v-if="game?.home_score !== null && game?.away_score !== null"
                >
                  <p :class="{ 'text-secondary': game?.home_score > game?.away_score }">
                    {{ game?.home_score ?? 0 }}
                  </p>
                  :
                  <p :class="{ 'text-secondary': game?.away_score > game?.home_score }">
                    {{ game?.away_score ?? 0 }}
                  </p>
                </div>
                <div v-else class="flex items-center text-xs">예정</div>
                <img :src="useGetTeamImage(game?.away_club?.id)" class="w-[12px]" alt="logo" />
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="calendarShowType === 'month'"
          class="isolate grid w-full grid-cols-7 gap-px"
          :class="dates.length > 35 ? 'grid-rows-6' : 'grid-cols-7'"
        >
          <div
            v-for="date in dates"
            :key="date.toString()"
            type="button"
            class="flex flex-col hover:bg-gray-100 focus:z-10 min-h-[130px]"
            :class="date.get('M') === selectedDate.get('M') ? 'bg-white' : 'bg-gray-50'"
          >
            <time
              :datetime="date.toISOString()"
              class="ml-auto mr-[10px]"
              :class="[
                {
                  'flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white':
                    dayjs().isSame(date, 'day'),
                },
                { 'text-red-500': date.day() === 0, 'text-blue-500': date.day() === 6 },
              ]"
            >
              {{ date.format('D') }}
            </time>
            <div
              class="flex flex-col gap-[5px] h-full py-[5px]"
              v-if="date.get('M') === selectedDate.get('M')"
            >
              <div
                v-for="game in games?.[date.format('YYYY-MM-DD')]"
                class="flex items-center w-full justify-between"
                :key="game.id"
              >
                <img :src="useGetTeamImage(game?.home_club?.id)" class="w-[12px]" alt="logo" />
                <div
                  class="flex items-center text-xs"
                  v-if="game?.home_score !== null && game?.away_score !== null"
                >
                  <p :class="{ 'text-secondary': game?.home_score > game?.away_score }">
                    {{ game?.home_score ?? 0 }}
                  </p>
                  :
                  <p :class="{ 'text-secondary': game?.away_score > game?.home_score }">
                    {{ game?.away_score ?? 0 }}
                  </p>
                </div>
                <div v-else class="flex items-center text-xs">예정</div>
                <img :src="useGetTeamImage(game?.away_club?.id)" class="w-[12px]" alt="logo" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped></style>
