<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';
import List from '../components/List.vue';

const columns = [
  // {
  //   type: 'selection'
  // },
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

onMounted(() => {
  console.log(dataRef.value);
  axios
    .post('/api/studentlist')
    .then(res => res.data)
    .then(data => {
      dataRef.value = data.user;
      loadingRef.value = false;
    });
});

const pagination = {
  pageSize: 10
};

const api: string = '/api/studentlist';
</script>

<template>
  <n-layout id="manage-container">
    <n-h1>学生管理</n-h1>
    <n-space vertical :size="12">
      <n-data-table
        :bordered="false"
        :columns="columns"
        :data="dataRef"
        :pagination="pagination"
        :row-key="(row: any) => row.id"
        :loading="loadingRef"
      />
    </n-space>
  </n-layout>

  <br />
  <List :api="api" />
</template>

<style scoped>
#manage-container {
  padding: 20px;
}
</style>
