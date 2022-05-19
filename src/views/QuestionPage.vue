<script lang="ts" setup>
import { useMessage } from 'naive-ui';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Pencil, BugOutline } from '@vicons/ionicons5';
import axios from 'axios';
import SqlEditor from '../components/SqlEditor.vue';
import { USER } from '../setting/const';

/*
  读取当前的题目信息，
    "id", "content", "answer", "testcaseID" ,"label" ,"abstract" ,"lang"
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
  abstract: '',
  lang: ''
});
let useranswer = ref('');
const showAbstract = ref(false);
let TestCaseAbstract = '';

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
          question.value = data.data;
          TestCaseAbstract = question.value.abstract;
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
  question.value.abstract = TestCaseAbstract;
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
    <n-h4>{{ question.content }}</n-h4>
    <n-h2>测试集信息</n-h2>
    <n-space vertical>
      <n-h4>{{ question.label }}</n-h4>
      <n-button secondary strong type="default" size="medium" @click="show">
        显示建表信息
      </n-button>
    </n-space>
    <div v-if="showAbstract">
      <sql-editor
        v-model:value="question.abstract"
        :value-change="showAbstract"
      />
    </div>
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
