<script lang="ts" setup>
import axios from 'axios';
import MarkdownIt from 'markdown-it';
import { NA, useMessage } from 'naive-ui';
import { h, onMounted, ref } from 'vue';
import { RESULT } from '../setting/const';

const options = ref([
  {
    label: 'ACCEPT',
    value: RESULT.ACCEPT
  },
  {
    label: 'WRONG ANSWER',
    value: RESULT['WRONG ANSWER']
  },
  {
    label: 'COMPLETE ERROR',
    value: RESULT['COMPLETE ERROR']
  },
  {
    label: 'WAITING',
    value: RESULT.WAITING
  },
  {
    label: 'SERVER ERROR',
    value: RESULT['SERVER ERROR']
  },
  {
    label: 'UNKNOWN',
    value: RESULT.UNKNOWN
  }
]);

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
          onClick() {
            if (JSON.parse(localStorage.account).role !== 1) {
              showModal.value = true;
              text.value = '```sql\n' + row.code + '\n```';
            }
          }
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

let md = new MarkdownIt();
const dataRef = ref([]);
const loadingRef = ref(true);
const showModal = ref(false);
const text = ref('');
const message = useMessage();
const formValue = ref({
  questionID: '',
  userID: '',
  result: ''
});

const query = () => {
  axios
    .get(`api/v1/submit/list`)
    .then(res => res.data)
    .then(data => {
      if (data.code === 0) {
        for (let i of data.data) {
          i.result = RESULT[i.result];
        }
        dataRef.value = data.data;
        loadingRef.value = false;
      } else {
        message.error(data.message);
      }
    })
    .catch(error => {
      loadingRef.value = false;
      message.error(error);
      console.error(error);
    });
};

onMounted(query);

const findSubmit = () => {
  console.log(formValue.value);
  loadingRef.value = true;
  axios
    .post(`api/v1/submit/filter`, formValue.value)
    .then(res => res.data)
    .then(data => {
      if (data.code === 0) {
        console.log(data.data);
        for (let i of data.data) {
          i.result = RESULT[i.result];
        }
        dataRef.value = data.data;
        loadingRef.value = false;
      } else {
        message.error(data.message);
      }
    })
    .catch(error => {
      loadingRef.value = false;
      message.error(error);
      console.error(error);
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
        <n-form-item label="状态" path="result">
          <n-select
            v-model:value="formValue.result"
            style="width: 100px"
            :options="options"
          />
        </n-form-item>
        <n-button type="primary" size="medium" @click="findSubmit">
          查找
        </n-button>
      </n-form>
    </n-space>
    <n-data-table
      :bordered="false"
      :columns="columns"
      :data="dataRef"
      :pagination="{ pageSize: 15 }"
      :row-key="(row: any) => row.id"
      :loading="loadingRef"
    />
    <n-modal v-model:show="showModal">
      <n-card style="width: 600px">
        <span v-dompurify-html="md.render(text)" v-highlight v-katex></span>
      </n-card>
    </n-modal>
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
