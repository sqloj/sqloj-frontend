<script lang="ts" setup>
import SideMenu from './SideMenu.vue';
import StudentManage from './StudentManage.vue';
</script>

<template>
  <n-layout
    has-sider
  >
    <n-layout-sider
      id="side-bar"
      bordered
    >
      <nav>
        <side-menu />
      </nav>
    </n-layout-sider>
    <n-layout>
      <student-manage />
    </n-layout>
  </n-layout>
</template>

<style>
#side-bar {
  height: 100vh;
}
</style>
