<script setup lang="ts">
import IconMenu from '@/assets/icons/IconMenu.vue';
</script>

<template>
  <div
    class="flex justify-between items-center h-[50px] p-[10px] sticky top-0 w-full bg-background self-center"
  >
    <div class="flex gap-[4px] items-center cursor-default">
      <img src="/logo.png" class="w-[40px]" alt="logo" />
      <p class="font-bold text-[20px]">크보 달력</p>
    </div>
    <icon-menu class="cursor-pointer w-[25px] h-[25px]" />
  </div>
</template>

<style scoped></style>
