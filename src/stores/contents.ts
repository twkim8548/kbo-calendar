import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useApi } from '@/composables/api';
import { supabase } from '@/lib/supabaseClient';
import dayjs from 'dayjs';

export const useContentsStore = defineStore('contents', () => {
  const youtubes = ref<any>([]);

  const selectYoutubes = async () => {
    try {
      const { data, error } = await supabase
        .from('log_crawling')
        .select()
        .eq('type', 3)
        .order('created_at', { ascending: false })
        .limit(1);

      if (!error) {
        new Error(error?.message);
      }

      const lastSelectedAt = dayjs(data[0].created_at);
      console.log(lastSelectedAt.format('YYYY-MM-DD hh:mm:ss'));
      console.log(dayjs().diff(dayjs('2024-06-25'), 'h'));
      if (dayjs().diff(lastSelectedAt, 'h') <= 24) {
        const { data, error } = await supabase
          .from('contents')
          .select()
          .eq('type', 1)
          .order('created_at', { ascending: false })
          .limit(5);
        if (!error) {
          new Error(error?.message);
        }
        youtubes.value = data;
        return;
      }

      await useApi('GET', 'https://www.googleapis.com/youtube/v3/search', {
        part: 'snippet',
        maxResults: 5,
        q: 'kbo',
        type: 'video',
        regionCode: 'KR',
        videoEmbeddable: 'true',
        key: import.meta.env.VITE_GOOGLE_KEY,
      })
        .then(async (res) => {
          youtubes.value = await insertYoutubes(
            res?.data?.items.map((it: any) => ({
              link: `https://www.youtube.com/embed/${it?.id?.videoId}`,
              type: 1,
            })),
          );
          console.log(youtubes.value);
        })
        .catch((err) => {
          new Error(err.message);
        });
    } catch (e) {
      console.error(e);
    }
  };

  const insertYoutubes = async (links: string[]) => {
    const { data, error } = await supabase.from('contents').insert(links).select();
    if (error) {
      console.error(error);
      return;
    }
    await supabase.from('log_crawling').insert({ type: 3, description: dayjs().toISOString() });
    return data;
  };

  return {
    selectYoutubes,
    youtubes,
  };
});
