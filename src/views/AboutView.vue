<script lang="ts" setup>
import { useMessage } from 'naive-ui';
import { useRouter } from 'vue-router';

const msg = 'ABOUT PAGE';
const message = useMessage();
const router = useRouter();

const goHome = () => {
  message.info('GO HOME');
  router.push('/');
};
</script>

<template>
  <div class="about">
    <h1>{{ msg }}</h1>
  </div>
  <n-button type="info" @click="goHome"> 回到首页 </n-button>
</template>
