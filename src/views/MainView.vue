<script lang="ts" setup>
import SideMenu from './SideMenu.vue';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
import { useMessage } from 'naive-ui';

const router = useRouter();
const message = useMessage();

const getRoute = (e: string) => {
  if (e == 'logout') {
    message.success('退出成功');
    router.replace('/login');
  } else {
    const subRounte = '/main/' + e;
    router.push(subRounte);
  }
};

// 设置初始显示界面
onMounted(() => {
  if (router.currentRoute.value.name === 'main') {
    const subRounte = '/main/' + 'question-manage';
    router.push(subRounte);
  }
});
</script>

<template>
  <n-layout has-sider>
    <!-- 左边栏 -->
    <n-layout-sider id="side-bar" bordered>
      <nav>
        <side-menu @get-route="getRoute" />
      </nav>
    </n-layout-sider>
    <!-- 主显示 -->
    <n-layout
      id="main-container"
      :native-scrollbar="false"
      style="height: 100vh"
    >
      <router-view />
    </n-layout>
  </n-layout>
</template>

<style>
#side-bar {
  height: 100vh;
}
</style>
