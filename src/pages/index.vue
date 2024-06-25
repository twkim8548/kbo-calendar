<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isShow = ref(false);
onMounted(() => {
  isShow.value = true;
  setTimeout(() => {
    router.replace({ path: '/today' });
  }, 2000);
});
</script>

<template>
  <transition name="intro">
    <div class="items-center justify-center flex flex-col w-full h-full transition" v-if="isShow">
      <img src="/img_splash.png" alt="img" />
      <p class="text-5xl font-bold">크보 달력</p>
    </div>
  </transition>
</template>

<style scoped></style>
