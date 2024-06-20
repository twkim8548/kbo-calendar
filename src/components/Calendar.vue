<script setup lang="ts">
import dayjs, { Dayjs } from 'dayjs';
import ko from 'dayjs/locale/ko';
import { useGetTeamImage } from '@/composables/team';
import { onMounted, ref, watch } from 'vue';
import { useGameStore } from '@/stores/game';
import { storeToRefs } from 'pinia';

const gameStore = useGameStore();

const { games } = storeToRefs(gameStore);
const selectedDate = ref<Dayjs>(dayjs());
const dates = ref<Dayjs[]>([]);
const isShowCalendarShowTypeMenu = ref(false);
const calendarShowType = ref('week');

const initCalendar = () => {
  dates.value = [];
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
  gameStore.selectGames(dates.value[0], dates.value[dates.value.length - 1]);
};

const changeCalendarShowType = (type: string) => {
  calendarShowType.value = type;
  isShowCalendarShowTypeMenu.value = false;
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
      <h1 class="text-base font-semibold leading-6 text-gray-900">
        <time :datetime="selectedDate.toISOString()">
          {{ dayjs(selectedDate).locale(ko).format('YYYY년 MMMM') }}
        </time>
      </h1>
      <div class="flex items-center">
        <div class="relative flex items-center rounded-md bg-white shadow-sm">
          <button
            type="button"
            class="flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative"
            @click="
              selectedDate.get('M') >= 1 ? (selectedDate = selectedDate.subtract(1, 'month')) : null
            "
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
            class="flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r border-gray-300 pl-1 text-gray-400 hover:text-gray-500 focus:relative"
            @click="
              selectedDate.get('M') < 11 ? (selectedDate = selectedDate.add(1, 'month')) : null
            "
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
                    class="block px-4 py-2 text-sm"
                    :class="
                      calendarShowType === 'day' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    "
                    @click="changeCalendarShowType('day')"
                  >
                    일별 보기
                  </div>
                  <div
                    class="block px-4 py-2 text-sm"
                    :class="
                      calendarShowType === 'week' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    "
                    @click="changeCalendarShowType('week')"
                  >
                    주별 보기
                  </div>
                  <div
                    class="block px-4 py-2 text-sm"
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
    <div class="shadow ring-1 ring-black ring-opacity-5 lg:flex lg:flex-auto lg:flex-col">
      <div
        class="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs font-semibold leading-6 text-gray-700 lg:flex-none"
      >
        <div class="flex justify-center bg-white py-2 text-red-500">
          <span>일</span>
        </div>
        <div class="flex justify-center bg-white py-2">
          <span>월</span>
        </div>
        <div class="flex justify-center bg-white py-2">
          <span>화</span>
        </div>
        <div class="flex justify-center bg-white py-2">
          <span>수</span>
        </div>
        <div class="flex justify-center bg-white py-2">
          <span>목</span>
        </div>
        <div class="flex justify-center bg-white py-2">
          <span>금</span>
        </div>
        <div class="flex justify-center bg-white py-2 text-blue-500">
          <span>토</span>
        </div>
      </div>
      <div class="flex bg-gray-200 text-xs leading-6 text-gray-700 lg:flex-auto">
        <div class="hidden w-full lg:grid lg:grid-cols-7 lg:grid-rows-6 lg:gap-px">
          <!--
            Always include: "relative py-2 px-3"
            Is current month, include: "bg-white"
            Is not current month, include: "bg-gray-50 text-gray-500"
          -->
          <div class="relative bg-gray-50 px-3 py-2 text-gray-500">
            <!--
              Is today, include: "flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white"
            -->
            <time datetime="2021-12-27">27</time>
          </div>
          <div class="relative bg-gray-50 px-3 py-2 text-gray-500">
            <time datetime="2021-12-28">28</time>
          </div>
          <div class="relative bg-gray-50 px-3 py-2 text-gray-500">
            <time datetime="2021-12-29">29</time>
          </div>
          <div class="relative bg-gray-50 px-3 py-2 text-gray-500">
            <time datetime="2021-12-30">30</time>
          </div>
          <div class="relative bg-gray-50 px-3 py-2 text-gray-500">
            <time datetime="2021-12-31">31</time>
          </div>
          <div class="relative bg-white px-3 py-2">
            <time datetime="2022-01-01">1</time>
          </div>
          <div class="relative bg-white px-3 py-2">
            <time datetime="2022-01-01">2</time>
          </div>
          <div class="relative bg-white px-3 py-2">
            <time datetime="2022-01-03">3</time>
            <ol class="mt-2">
              <li>
                <a href="#" class="group flex">
                  <p
                    class="flex-auto truncate font-medium text-gray-900 group-hover:text-indigo-600"
                  >
                    Design review
                  </p>
                  <time
                    datetime="2022-01-03T10:00"
                    class="ml-3 hidden flex-none text-gray-500 group-hover:text-indigo-600 xl:block"
                    >10AM
                  </time>
                </a>
              </li>
              <li>
                <a href="#" class="group flex">
                  <p
                    class="flex-auto truncate font-medium text-gray-900 group-hover:text-indigo-600"
                  >
                    Sales meeting
                  </p>
                  <time
                    datetime="2022-01-03T14:00"
                    class="ml-3 hidden flex-none text-gray-500 group-hover:text-indigo-600 xl:block"
                    >2PM
                  </time>
                </a>
              </li>
            </ol>
          </div>
          <div class="relative bg-white px-3 py-2">
            <time datetime="2022-01-04">4</time>
          </div>
          <div class="relative bg-white px-3 py-2">
            <time datetime="2022-01-05">5</time>
          </div>
          <div class="relative bg-white px-3 py-2">
            <time datetime="2022-01-06">6</time>
          </div>
          <div class="relative bg-white px-3 py-2">
            <time datetime="2022-01-07">7</time>
            <ol class="mt-2">
              <li>
                <a href="#" class="group flex">
                  <p
                    class="flex-auto truncate font-medium text-gray-900 group-hover:text-indigo-600"
                  >
                    Date night
                  </p>
                  <time
                    datetime="2022-01-08T18:00"
                    class="ml-3 hidden flex-none text-gray-500 group-hover:text-indigo-600 xl:block"
                    >6PM
                  </time>
                </a>
              </li>
            </ol>
          </div>
          <div class="relative bg-white px-3 py-2">
            <time datetime="2022-01-08">8</time>
          </div>
          <div class="relative bg-white px-3 py-2">
            <time datetime="2022-01-09">9</time>
          </div>
          <div class="relative bg-white px-3 py-2">
            <time datetime="2022-01-10">10</time>
          </div>
          <div class="relative bg-white px-3 py-2">
            <time datetime="2022-01-11">11</time>
          </div>
          <div class="relative bg-white px-3 py-2">
            <time
              datetime="2022-01-12"
              class="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white"
              >12
            </time>
            <ol class="mt-2">
              <li>
                <a href="#" class="group flex">
                  <p
                    class="flex-auto truncate font-medium text-gray-900 group-hover:text-indigo-600"
                  >
                    Sam's birthday party
                  </p>
                  <time
                    datetime="2022-01-25T14:00"
                    class="ml-3 hidden flex-none text-gray-500 group-hover:text-indigo-600 xl:block"
                    >2PM
                  </time>
                </a>
              </li>
            </ol>
          </div>
          <div class="relative bg-white px-3 py-2">
            <time datetime="2022-01-13">13</time>
          </div>
          <div class="relative bg-white px-3 py-2">
            <time datetime="2022-01-14">14</time>
          </div>
          <div class="relative bg-white px-3 py-2">
            <time datetime="2022-01-15">15</time>
          </div>
          <div class="relative bg-white px-3 py-2">
            <time datetime="2022-01-16">16</time>
          </div>
          <div class="relative bg-white px-3 py-2">
            <time datetime="2022-01-17">17</time>
          </div>
          <div class="relative bg-white px-3 py-2">
            <time datetime="2022-01-18">18</time>
          </div>
          <div class="relative bg-white px-3 py-2">
            <time datetime="2022-01-19">19</time>
          </div>
          <div class="relative bg-white px-3 py-2">
            <time datetime="2022-01-20">20</time>
          </div>
          <div class="relative bg-white px-3 py-2">
            <time datetime="2022-01-21">21</time>
          </div>
          <div class="relative bg-white px-3 py-2">
            <time datetime="2022-01-22">22</time>
            <ol class="mt-2">
              <li>
                <a href="#" class="group flex">
                  <p
                    class="flex-auto truncate font-medium text-gray-900 group-hover:text-indigo-600"
                  >
                    Maple syrup museum
                  </p>
                  <time
                    datetime="2022-01-22T15:00"
                    class="ml-3 hidden flex-none text-gray-500 group-hover:text-indigo-600 xl:block"
                    >3PM
                  </time>
                </a>
              </li>
              <li>
                <a href="#" class="group flex">
                  <p
                    class="flex-auto truncate font-medium text-gray-900 group-hover:text-indigo-600"
                  >
                    Hockey game
                  </p>
                  <time
                    datetime="2022-01-22T19:00"
                    class="ml-3 hidden flex-none text-gray-500 group-hover:text-indigo-600 xl:block"
                    >7PM
                  </time>
                </a>
              </li>
            </ol>
          </div>
          <div class="relative bg-white px-3 py-2">
            <time datetime="2022-01-23">23</time>
          </div>
          <div class="relative bg-white px-3 py-2">
            <time datetime="2022-01-24">24</time>
          </div>
          <div class="relative bg-white px-3 py-2">
            <time datetime="2022-01-25">25</time>
          </div>
          <div class="relative bg-white px-3 py-2">
            <time datetime="2022-01-26">26</time>
          </div>
          <div class="relative bg-white px-3 py-2">
            <time datetime="2022-01-27">27</time>
          </div>
          <div class="relative bg-white px-3 py-2">
            <time datetime="2022-01-28">28</time>
          </div>
          <div class="relative bg-white px-3 py-2">
            <time datetime="2022-01-29">29</time>
          </div>
          <div class="relative bg-white px-3 py-2">
            <time datetime="2022-01-30">30</time>
          </div>
          <div class="relative bg-white px-3 py-2">
            <time datetime="2022-01-31">31</time>
          </div>
          <div class="relative bg-gray-50 px-3 py-2 text-gray-500">
            <time datetime="2022-02-01">1</time>
          </div>
          <div class="relative bg-gray-50 px-3 py-2 text-gray-500">
            <time datetime="2022-02-02">2</time>
          </div>
          <div class="relative bg-gray-50 px-3 py-2 text-gray-500">
            <time datetime="2022-02-03">3</time>
          </div>
          <div class="relative bg-gray-50 px-3 py-2 text-gray-500">
            <time datetime="2022-02-04">4</time>
            <ol class="mt-2">
              <li>
                <a href="#" class="group flex">
                  <p
                    class="flex-auto truncate font-medium text-gray-900 group-hover:text-indigo-600"
                  >
                    Cinema with friends
                  </p>
                  <time
                    datetime="2022-02-04T21:00"
                    class="ml-3 hidden flex-none text-gray-500 group-hover:text-indigo-600 xl:block"
                    >9PM
                  </time>
                </a>
              </li>
            </ol>
          </div>
          <div class="relative bg-gray-50 px-3 py-2 text-gray-500">
            <time datetime="2022-02-05">5</time>
          </div>
          <div class="relative bg-gray-50 px-3 py-2 text-gray-500">
            <time datetime="2022-02-06">6</time>
          </div>
        </div>
        <div
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
    </div>
  </div>
</template>

<style scoped></style>
