<script lang="ts" setup>
import axios from 'axios';
import { useMessage } from 'naive-ui';
import { onMounted, ref } from 'vue';

const columns = [
  {
    title: '编号',
    key: 'id'
  },
  {
    title: '题目编号',
    key: 'questionId'
  },
  {
    title: '提交者',
    key: 'userid'
  },
  {
    title: '结果',
    key: 'result'
  },
  {
    title: '提交时间',
    key: 'time'
  }
];

const dataRef = ref([]);
const loadingRef = ref(true);
const message = useMessage();

const query = () => {
  axios
    .post(`/api/submission/list`)
    .then(res => res.data)
    .then(data => {
      dataRef.value = data.submits;
      loadingRef.value = false;
    });
};

onMounted(query);
</script>

<template>
  <n-layout id="manage-container">
    <n-h1>提交记录</n-h1>
    <n-data-table
      :bordered="false"
      :columns="columns"
      :data="dataRef"
      :pagination="{ pagesize: 15 }"
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
