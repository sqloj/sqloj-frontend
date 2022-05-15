<script lang="ts" setup>
import { h, onMounted, ref } from 'vue';
import { NA, useMessage } from 'naive-ui';
import { useRouter } from 'vue-router';
import axios from 'axios';

/*
  展示题目信息 {id, content<a>, passnum, testcase_id}
*/
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

    render(row: any) {
      return h(
        NA,
        {
          onClick() {
            const question = row;
            localStorage.question = JSON.stringify(question);
            // 页面跳转
            router.push({
              name: 'question',
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
const formValue = ref({
  queid: ''
});

/*
  查询题目列表
*/
const query = () => {
  axios
    .post(`/api/question/manage/list`)
    .then(res => res.data)
    .then(data => {
      dataRef.value = data.question;
      loadingRef.value = false;
    });
};
onMounted(query);

const findQuestionById = () => {
  const id = Number(formValue.value.queid);
  axios
    .post(`/api/question/find/{id}`, { id })
    .then(res => res.data)
    .then(data => {
      if (data.success) {
        const question = data.question;
        localStorage.question = JSON.stringify(question);
        // 页面跳转
        router.push({
          name: 'question',
          params: {
            QuestionId: question.id
          }
        });
      } else {
        message.error(data.message);
      }
    });
};
</script>

<template>
  <n-layout id="manage-container">
    <n-space vertical>
      <n-h1>题目列表</n-h1>
      <!-- form -->
      <n-space>
        <n-form ref="formRef" label-placement="left" inline :model="formValue">
          <n-form-item label="题目ID" path="queid">
            <n-input v-model:value="formValue.queid" placeholder="" />
          </n-form-item>

          <n-form-item>
            <n-button type="primary" size="medium" @click="findQuestionById">
              跳转
            </n-button>
          </n-form-item>
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
