<script setup lang="ts">
import { RouterView } from 'vue-router';
import IconMenu from '@/assets/icons/IconMenu.vue';
</script>

<template>
  <div
    class="max-w-[600px] w-full h-[100dvh] flex flex-col justify-center content-center self-center bg-background"
  >
    <div class="flex justify-between items-center h-[50px] p-[10px]" v-if="$route.name !== '/'">
      <div class="flex gap-[4px] items-center cursor-default">
        <img src="/logo.png" class="w-[40px]" alt="logo" />
        <p class="font-bold text-[20px]">야구 달력</p>
      </div>
      <icon-menu class="cursor-pointer w-[25px] h-[25px]" />
    </div>
    <router-view class="w-full overflow-y-auto flex-1" />
  </div>
</template>

<style scoped></style>
