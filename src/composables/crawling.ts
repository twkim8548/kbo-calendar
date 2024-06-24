import { useApi } from '@/composables/api';

export const crawlingGames = async (date: string) => {
  await useApi('GET', '/.netlify/functions/hello', { date: date })
    .then((response) => {
      console.log(response);
      return response;
    })
    .catch((error) => {
      console.log(error);
    });
};
