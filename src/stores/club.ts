import { defineStore } from 'pinia';
import { supabase } from '@/lib/supabaseClient';
import dayjs, { Dayjs } from 'dayjs';
import { ref } from 'vue';

export const useClubStore = defineStore('club', () => {
  const clubs = ref<any>([]);

  const selectClubs = async () => {
    const { data } = await supabase
      .from('clubs')
      .select()
    clubs.value = data;
  };

  return {
    clubs,
    selectClubs,
  };
});
