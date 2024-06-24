import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useModalStore = defineStore('modal', () => {
  const isShowLoadingModal = ref(false);

  return { isShowLoadingModal };
});
