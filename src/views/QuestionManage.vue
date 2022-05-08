<script lang="ts" setup>
import { h, onMounted, ref } from 'vue';
import { NA, useMessage } from 'naive-ui';
import { useRouter } from 'vue-router';
import axios from 'axios';

const columns = [
  {
    title: '编号',
    key: 'id',
    width: 100
  },
  {
    title: '题目描述',
    key: 'content',
    width: 400,
    ellipsis: true,

    render(row: any, index: any) {
      return h(
        NA,
        {
          onClick() {
            const question = dataRef.value[index];
            sessionStorage.question = JSON.stringify(question);
            console.log(question);
            router.push({
              name: 'Question',
              params: {
                QuestionId: question.id
              }
            });
          }
        },
        {
          default: () => row.content
        }
      );
    }
  },
  {
    title: '通过人数',
    key: 'passnum',
    width: 100
  },
  {
    title: '依赖数据库',
    key: 'testcase_id',
    width: 100
  }
];

const dataRef = ref([]);
const loadingRef = ref(true);
const message = useMessage();
const router = useRouter();

onMounted(() => {
  axios
    .post(`/api/question/manage/list`)
    .then(res => res.data)
    .then(data => {
      dataRef.value = data.question;
      loadingRef.value = false;
    });
  console.log(dataRef.value);
});

const handleOnClick = (row: any) => {
  console.log(dataRef.value[row]);
};
</script>

<template>
  <n-layout id="manage-container">
    <n-space vertical>
      <n-h1>题目列表</n-h1>
      <n-data-table
        :bordered="false"
        :columns="columns"
        :data="dataRef"
        :pagination="{ pageSize: 15 }"
        :row-key="(row: any) => row.id"
        :loading="loadingRef"
        @update:checked-row-keys="handleOnClick"
      />
    </n-space>
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
  overflow: hidden;
}

.space {
  margin-left: 20px;
  margin-right: 20px;
}
</style>
