<script lang="ts" setup>
import { useMessage } from 'naive-ui';
import { ref } from 'vue';

const columns = [
  {
    type: 'selection'
  },
  {
    title: '学号',
    key: 'id'
  },
  {
    title: '姓名',
    key: 'name'
  },
  {
    title: '班级',
    key: 'classes'
  },
  {
    title: '过题数',
    key: 'acnum'
  }
];

const dataRef = ref([]);
const loadingRef = ref(true);
const message = useMessage();
const checkedRowKeysRef = ref([]);
</script>

<template>
  <n-layout id="manage-container">
    <n-h1>提交记录</n-h1>
    <n-data-table
      :bordered="false"
      :columns="columns"
      :data="dataRef"
      :pagination="10"
      :row-key="(row: any) => row.id"
      :loading="loadingRef"
    />
  </n-layout>
</template>

<style scoped>
#manage-container {
  padding: 20px;
  padding-top: 80px;
  overflow: auto;
  text-align: center;
  padding-left: 5%;
  padding-right: 5%;
  margin-bottom: 1rem;
}
</style>
