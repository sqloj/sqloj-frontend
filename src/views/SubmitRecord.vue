<script lang="ts" setup>
import axios from 'axios';
import { NA, useMessage } from 'naive-ui';
import { h, onMounted, ref } from 'vue';
import { RESULT } from '../setting/const';
/*
"id": 1,
      "userID": "1",
      "questionID": 3,
      "code": "SELECT 1;",
      "result": 4,
      time
*/
const columns = [
  {
    title: '编号',
    key: 'id'
  },
  {
    title: '题目编号',
    key: 'questionID'
  },
  {
    title: '提交者',
    key: 'userID'
  },
  {
    title: '结果',
    key: 'result',
    render(row: any) {
      return h(
        NA,
        {
          trigger: 'hover'
        },
        {
          default: () => row.result
        }
      );
    }
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
  questionID: '',
  userID: ''
});

const query = () => {
  axios
    .get(`/api/v1/submit/list`)
    .then(res => res.data)
    .then(data => {
      for (let i of data.data) {
        i.result = RESULT[i.result];
      }
      dataRef.value = data.data;
      loadingRef.value = false;
    });
};

onMounted(query);

const findSubmit = () => {
  loadingRef.value = true;
  axios
    .post(`/api/submit`, null, {
      params: {
        ...formValue
      }
    })
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
          <n-input v-model:value="formValue.questionID" placeholder="" />
        </n-form-item>
        <n-form-item label="用户ID" path="userID">
          <n-input v-model:value="formValue.userID" placeholder="" />
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
