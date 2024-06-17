<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { supabase } from '@/lib/supabaseClient';
import IconMenu from '@/assets/icons/IconMenu.vue';
import { useDayjs } from '@/composables/date';

const countries = ref<any>([]);

async function getCountries() {
  const { data } = await supabase.from('games').select();
  countries.value = data;
}
onMounted(() => {
  getCountries();
});
</script>
<template>
  <div class="flex flex-col gap-[20px]">
    <div class="flex justify-between items-center">
      <div class="flex gap-[4px] items-center">
        <img src="/logo.png" class="w-[40px]" alt="logo" />
        <p class="font-bold text-[20px]">야구 달력</p>
      </div>
      <icon-menu class="cursor-pointer w-[25px] h-[25px]" />
    </div>
    <div class="flex flex-col">
      <div v-for="country in countries">
        <!--        {{ country }}-->
        {{ useDayjs()(country.match_day).format('YYYY-MM-DD HH:mm') }}
      </div>
    </div>
  </div>
</template>
