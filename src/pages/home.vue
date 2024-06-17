<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { supabase } from '@/lib/supabaseClient';

const countries = ref<any>([]);

async function getCountries() {
  const { data } = await supabase.from('countries').select();
  countries.value = data;
}

onMounted(() => {
  getCountries();
});
</script>
<template>
  <div class="bg-black">
    <div v-for="country in countries">
      {{ country }}
    </div>
  </div>
</template>
