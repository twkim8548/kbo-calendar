<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
  <div class="w-[100dvw] h-[100dvh] flex justify-center">
    <router-view class="max-w-[600px] w-full" />
  </div>
</template>

<style scoped></style>
