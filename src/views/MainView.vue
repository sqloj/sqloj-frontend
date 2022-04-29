<script lang="ts" setup>
import {ref} from 'vue'
import SideMenu from './SideMenu.vue';
import {useRouter} from 'vue-router'

const router = useRouter();

const getRounte = (e: string) => {
    const subRounte = "/Main/" + e;
    router.push(subRounte);
}

</script>

<template>
  <n-layout has-sider>
    <n-layout-sider id="side-bar" bordered>
      <nav>
        <side-menu @getRounte = 'getRounte'/>
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
