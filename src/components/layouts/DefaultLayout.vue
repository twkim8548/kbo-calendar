<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router';
import defaultHeader from '@/components/Header.vue';
import IconMenu from '@/assets/icons/IconMenu.vue';
import { onBeforeMount, ref, watch } from 'vue';

const route = useRoute();
const isSplash = ref(true);

watch(route, () => {
  if (route.path !== '/') {
    isSplash.value = false;
  }
});
</script>

<template>
  <div
    class="max-w-[600px] w-full h-[100dvh] flex flex-col bg-background overflow-auto scrollbar-hide"
  >
    <default-header v-if="!isSplash" />
    <main class="flex flex-col gap-[20px] flex-1 pt-[10px] pb-[30px]">
      <div
        class="overflow-x-auto flex items-center shrink-0 justify-center gap-[10px]"
        v-if="!isSplash"
      >
        <button
          class="px-[4px] py-[2px] border rounded-md text-xs shadow-sm cursor-pointer"
          :class="
            $route.path === '/today'
              ? 'bg-accent text-white border-accent'
              : 'border-gray-300 hover:bg-gray-50'
          "
          @click="$router.push({ path: '/today' })"
        >
          오늘 경기
        </button>
        <button
          class="px-[4px] py-[2px] border rounded-md text-xs shadow-sm cursor-pointer"
          :class="
            $route.path === '/calendar'
              ? 'bg-accent text-white border-accent'
              : 'border-gray-300 hover:bg-gray-50'
          "
          @click="$router.push({ path: '/calendar' })"
        >
          일정 달력
        </button>
      </div>
      <router-view class="w-full overflow-y-auto flex-1" />
    </main>
  </div>
</template>

<style scoped></style>
