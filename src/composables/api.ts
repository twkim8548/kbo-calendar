import { storeToRefs } from 'pinia';
import axios from 'axios';
import router from '@/router';
import { useModalStore } from '@/stores/modal';

const API_TIMEOUT = 100000;
let activeRequestsCounter = 0;

export const initApiInstance = () => {
  const modalStore = useModalStore();
  const { isShowLoadingModal } = storeToRefs(modalStore);
  const getBaseUrl = () => {
    return import.meta.env.VITE_API_BASE_URL;
  };

  const api = axios.create({
    timeout: API_TIMEOUT,
    withCredentials: false,
    baseURL: getBaseUrl(),
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8;',
    },
    onUploadProgress(progressEvent) {
      console.log((progressEvent.loaded * 100) / (progressEvent?.total ?? 100));
    },
  });
  api.interceptors.request.use((config) => {
    activeRequestsCounter += 1;
    if (!isShowLoadingModal.value) {
      isShowLoadingModal.value = true;
    }
    document.body.style.cursor = 'wait';
    return config;
  });

  api.interceptors.response.use(
    (res) => {
      activeRequestsCounter -= 1;
      if (activeRequestsCounter === 0) {
        isShowLoadingModal.value = false;
        document.body.style.cursor = '';
      }
      return res;
    },
    (err) => {
      console.error(err);
      activeRequestsCounter -= 1;
      if (activeRequestsCounter === 0) {
        isShowLoadingModal.value = false;
        document.body.style.cursor = '';
      }
      err = err?.response ?? err;
      return Promise.reject(err);
    },
  );
  return api;
};

export const useApi = (method: string, route: string, query?: any, body?: any) => {
  return new Promise((resolve, reject) => {
    initApiInstance()
      .request({
        method: method,
        url: route,
        data: body,
        params: query,
      })
      .then((res) => {
        return resolve(res);
      })
      .catch((err) => {
        return reject(err);
      });
  });
};
