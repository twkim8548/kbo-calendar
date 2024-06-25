import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useApi } from '@/composables/api';

export const useContentsStore = defineStore('contents', () => {
  const youtubes = ref([]);
  const selectYoutubes = () => {
    useApi('GET', 'https://www.googleapis.com/youtube/v3/search', {
      part: 'snippet',
      maxResults: 10,
      q: '야구',
      type: 'video',
      key: import.meta.env.VITE_GOOGLE_KEY,
    }).then((res) => {
      youtubes.value = res?.data?.items;
    });
  };

  return {
    selectYoutubes,
    youtubes,
  };
});
