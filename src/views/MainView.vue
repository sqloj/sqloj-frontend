<script lang="ts" setup>
import SideMenu from './SideMenu.vue';
import { useRouter } from 'vue-router';
import { onBeforeMount, ref } from 'vue';
import { useMessage } from 'naive-ui';

const router = useRouter();
const message = useMessage();
const collapsed = ref(false);
const getRoute = (e: string) => {
  if (e === 'logout') {
    localStorage.removeItem('account');
    message.success('退出成功');
    router.replace('/login');
  } else if (e === 'self-page') {
    router.push({
      name: 'self-page',
      params: {
        UserId: JSON.parse(localStorage.account).id
      }
    });
  } else {
    router.push(e);
  }
};

onBeforeMount(() => {
  if (localStorage.getItem('account') === null || undefined) {
    return router.replace('/login');
  }
  if (router.currentRoute.value.name === 'main') {
    const subRounte = '/main/' + 'question-manage';
    router.push(subRounte);
  }
});
</script>

<template>
  <n-layout has-sider>
    <!-- 左边栏 -->
    <n-layout-sider
      id="side-bar"
      bordered
      collapse-mode="width"
      :collapsed-width="60"
      :width="240"
      :collapsed="collapsed"
      show-trigger
      @collapse="collapsed = true"
      @expand="collapsed = false"
    >
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
