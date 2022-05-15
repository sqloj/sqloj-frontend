<script lang="ts" setup>
import { useMessage } from 'naive-ui';
import { onBeforeMount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Pencil, BugOutline } from '@vicons/ionicons5';
import axios from 'axios';

const router = useRouter();
const message = useMessage();
// 依赖数据库选择

onMounted(() => {
  // 从路由中读取 testcaseid 的值
  const testcaseid = router.currentRoute.value.params.testcaseId;
  console.log(testcaseid);
});
</script>

<template>
  <div class="manage-container">
    <n-h1>测试集</n-h1>
  </div>
</template>

<style scoped>
.manage-container {
  padding: 20px;
  padding-top: 80px;
  overflow: auto;
  text-align: left;
  padding-left: 5%;
  padding-right: 5%;
}

.card {
  text-align: left;
}
</style>
