<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';

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

onMounted(() => {
  console.log(dataRef.value);
  axios
    .post('/api/student/manage/list')
    .then(res => res.data)
    .then(data => {
      dataRef.value = data.user;
      loadingRef.value = false;
    });
});

const pagination = {
  pageSize: 10
};

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
</template>

<style scoped>
#manage-container {
  padding: 20px;
  text-align: center;
  text-align: center; 
  padding-left: 5%; 
  padding-right: 5%;
}
</style>
