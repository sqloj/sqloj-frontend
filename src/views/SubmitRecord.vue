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
const formValue = ref({
  questionid: '',
  userid: ''
});

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

const findSubmit = () => {
  console.log(formValue.value);
  loadingRef.value = true;
  axios
    .post(`/api/submit`, formValue.value)
    .then(res => res.data)
    .then(data => {
      dataRef.value = data.submits;
      loadingRef.value = false;
    });
};
</script>

<template>
  <n-layout id="manage-container">
    <n-h1>提交记录</n-h1>
    <n-space>
      <n-form ref="formRef" label-placement="left" inline :model="formValue">
        <n-form-item label="题目ID" path="queid">
          <n-input v-model:value="formValue.questionid" placeholder="" />
        </n-form-item>
        <n-form-item label="用户ID" path="userid">
          <n-input v-model:value="formValue.userid" placeholder="" />
        </n-form-item>
        <n-form-item>
          <n-button type="primary" size="medium" @click="findSubmit">
            查找
          </n-button>
        </n-form-item>
      </n-form>
    </n-space>
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
