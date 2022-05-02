<script lang="ts" setup>
import SideMenu from './SideMenu.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const getRoute = (e: string) => {
  const subRounte = '/Main/' + e;
  router.push(subRounte);
};
</script>

<template>
  <n-layout has-sider>
    <n-layout-sider id="side-bar" bordered>
      <nav>
        <side-menu @get-route="getRoute" />
      </nav>
    </n-layout-sider>
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
