<script setup lang="ts">
import { RouterView } from 'vue-router';
import IconMenu from '@/assets/icons/IconMenu.vue';
import { Vue3Lottie } from 'vue3-lottie';
import LoadingJson from '@/assets/json/loading.json';
import { storeToRefs } from 'pinia';
import { useModalStore } from '@/stores/modal';
import DefaultLayout from '@/components/layouts/DefaultLayout.vue';

const { isShowLoadingModal } = storeToRefs(useModalStore());
</script>

<template>
  <default-layout />
  <div class="modal-layout" v-if="isShowLoadingModal">
    <vue3-lottie :animation-data="LoadingJson" :height="200" :width="200" :speed="1" :loop="true" />
  </div>
</template>

<style scoped></style>
