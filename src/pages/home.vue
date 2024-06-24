<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Calendar from '@/components/Calendar.vue';
import Today from '@/components/Today.vue';

const showType = ref('today');

onMounted(() => {});
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
    <today v-if="showType === 'today'" />
    <calendar v-else />
  </main>
</template>
