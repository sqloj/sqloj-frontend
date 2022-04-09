<script lang="ts" setup>
import SideMenu from "./SideMenu.vue";
import StudentManage from "./StudentManage.vue";
</script>

<template>
  <n-layout has-sider id="container">
    <n-layout-sider bordered :show-collapsed-content="false">
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
#container {
  height: 100%;
}
</style>