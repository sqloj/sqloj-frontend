<script lang="ts" setup>
import SideMenu from './SideMenu.vue';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';

const router = useRouter();

const getRoute = (e: string) => {
  const subRounte = '/Main/' + e;
  router.push(subRounte);
};

// 设置初始显示界面
onMounted(() => {
  const subRounte = '/Main/' + 'StudentManage';
  router.push(subRounte);
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
    <n-layout>
      <router-view />
    </n-layout>
  </n-layout>
</template>

<style>
#side-bar {
  height: 100vh;
}
</style>
