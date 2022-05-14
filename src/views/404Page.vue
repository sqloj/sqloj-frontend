<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
  router.push('/');
};
const goback = () => {
  router.back();
};
</script>

<template>
  <div class="container">
    <div class="flex flex-col justify-center page-container">
      <div class="text-center">
        <img src="../assets/images/exception/404.svg" alt="" />
      </div>
      <div class="text-center">
        <h1 class="text-base text-gray-500">抱歉，你访问的页面不存在</h1>
        <n-space justify="center">
          <n-button
            type="info"
            style="background-color: #18a058"
            @click="goHome"
          >
            首页
          </n-button>
          <n-button
            type="info"
            style="background-color: #18a058"
            @click="goback"
          >
            后退
          </n-button>
        </n-space>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.container {
  width: 100%;
  border-radius: 4px;
  height: 100vh;
  text-align: center;

  .page-container {
    padding: 50px 0;
  }

  .text-center {
    h1 {
      color: #666;
      padding: 20px 0;
    }
  }

  img {
    width: 350px;
    margin: 0 auto;
  }
}
</style>
