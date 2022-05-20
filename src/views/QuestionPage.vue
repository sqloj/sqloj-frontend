<script lang="ts" setup>
import { NH4, useMessage } from 'naive-ui';
import { h, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Pencil, BugOutline } from '@vicons/ionicons5';
import axios from 'axios';
import SqlEditor from '../components/SqlEditor.vue';
import { USER } from '../setting/const';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';

/*
  读取当前的题目信息，
    "id", "content", "answer", "testcaseID" ,"label" ,"testcaseAbstract" ,"lang"
*/

const router = useRouter();
const message = useMessage();
const valueChange = ref(false);
let question = ref({
  id: '',
  content: '',
  answer: '',
  testcaseID: '',
  label: '',
  testcaseAbstract: '',
  lang: ''
});
let useranswer = ref('');
const showAbstract = ref(false);
let md = new MarkdownIt();

// 从路由中读取 QuestionId 的值
const questionid = router.currentRoute.value.params.QuestionId;
const role = JSON.parse(localStorage.account).role;

onMounted(() => {
  if (Number.isFinite(Number(questionid))) {
    axios
      .get(`/api/v1/question/info/${Number(questionid)}`)
      .then(res => res.data)
      .then(data => {
        if (data.code === 0) {
          console.log(data.data);
          question.value = data.data;
        } else {
          message.error(data.message);
          router.replace('/main/question-manage');
        }
      })
      .catch(error => {
        console.error(error);
        message.error('错误！');
      })
      .finally(() => {
        console.log(question.value);
        console.log(question.value.testcaseAbstract);
        console.log(md.render(question.value.testcaseAbstract));
        if (role === USER.TEACHER) {
          useranswer.value = question.value.answer;
          valueChange.value = !valueChange.value;
        }
      });
  } else {
    message.error('错误的编号');
    router.back();
  }
});

const show = () => {
  question.value.content = '# 123';
  showAbstract.value = !showAbstract.value;
};
const run = () => {
  console.log('运行');
};

const submit = () => {
  axios;
  // .post(`api/v1/submit/submit`,)
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
      v-if="role !== USER.STUDENT"
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
    <n-h2>题目描述</n-h2>
    <n-h4 v-dompurify-html="md.render(question.content)"></n-h4>
    <n-h2>测试集信息</n-h2>
    <n-space vertical>
      <n-h4>{{ question.label }}</n-h4>
    </n-space>
    <n-h4 v-dompurify-html="md.render(question.testcaseAbstract)"></n-h4>
    <n-h2>答题框</n-h2>
    <sql-editor v-model:value="useranswer" :value-change="valueChange" />

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
  text-align: left;
  margin: 0 auto;
  max-width: 800px;
}

.card {
  text-align: left;
}
</style>
