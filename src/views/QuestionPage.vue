<script lang="ts" setup>
import { useMessage } from 'naive-ui';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Pencil, BugOutline } from '@vicons/ionicons5';
import axios from 'axios';

/*
  读取当前的题目信息，{id, content, answer, passnum, testcase_id}
*/

const router = useRouter();
const message = useMessage();
let question = ref({ id: '', content: '', answer: '', testcase_id: '' });
let useranswer = ref('');
// 从路由中读取 QuestionId 的值
const questionid = router.currentRoute.value.params.QuestionId;
const admin = JSON.parse(localStorage.account).admin;

onMounted(() => {
  axios
    .post(`/api/question/find/{id}`, { id: Number(questionid) })
    .then(res => res.data)
    .then(data => {
      if (data.success) {
        question.value = data.question;
      } else {
        message.error(data.message);
      }
    })
    .finally(() => {
      if (admin) {
        useranswer.value = question.value.answer;
      }
    });
});

/*
  产看 answer 的运行结果
*/
const run = () => {
  console.log('运行');
};
const handleEdit = () => {
  router.push({
    name: 'question-editor',
    params: {
      QuestionId: Number(questionid)
    }
  });
};
</script>

<template>
  <div class="manage-container">
    <n-h1 style="text-align: center">#{{ question.id }}</n-h1>
    <n-button
      v-if="admin"
      secondary
      strong
      type="primary"
      size="medium"
      @click="handleEdit"
    >
      <template #icon>
        <n-icon size="18">
          <Pencil />
        </n-icon>
      </template>
      编辑题目
    </n-button>
    <!-- <n-space vertical> -->
    <n-h2>题目描述</n-h2>
    <n-h4>{{ question.content }}</n-h4>
    <n-h2>答题框</n-h2>
    <n-input
      v-model:value="useranswer"
      type="textarea"
      placeholder="在此处填写答案"
      :autofocus="true"
    />
    <n-space justify="space-between">
      <n-button
        secondary
        strong
        type="primary"
        size="large"
        style="margin-top: 1.6rem"
        @click="run"
      >
        <template #icon>
          <n-icon size="18">
            <BugOutline />
          </n-icon>
        </template>
        测试
      </n-button>
      <n-button
        secondary
        strong
        type="primary"
        size="large"
        style="margin-top: 1.6rem"
        @click="run"
      >
        <template #icon>
          <n-icon size="18">
            <BugOutline />
          </n-icon>
        </template>
        提交
      </n-button>
    </n-space>
  </div>
</template>

<style scoped>
.manage-container {
  padding: 20px;
  padding-top: 80px;
  overflow: auto;
  text-align: left;
  margin: 0 auto;
  max-width: 800px;
}

.card {
  text-align: left;
}
</style>
