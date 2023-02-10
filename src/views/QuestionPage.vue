<script lang="ts" setup>
import { useMessage } from 'naive-ui';
import { onMounted, Ref, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Pencil, TerminalOutline, CodeSlashSharp } from '@vicons/ionicons5';
import axios from 'axios';
import SqlEditor from '../components/SqlEditor.vue';
import { DATABASE, RESULT, USER } from '../setting/const';
import SmartTable from '../components/SmartTable.vue';
import MarkdownIt from 'markdown-it';

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
  testcaseContent: '',
  testcaseLabel: '',
  judgeTypeID: 1,
  typeName: ''
});
class Redisform {
  redis: string;
  constructor(t: string) {
    this.redis = t;
  }
}
const useranswer = ref('');
const loadingRef = ref(false);
const loadingSubmitRef = ref(false);
let md = new MarkdownIt();

// 从路由中读取 QuestionId 的值
const questionid = router.currentRoute.value.params.QuestionId;
const userid = JSON.parse(localStorage.account).id;
const role = JSON.parse(localStorage.account).role;

onMounted(() => {
  if (Number.isFinite(Number(questionid))) {
    axios
      .get(`api/v1/question/info/${Number(questionid)}`)
      .then(res => res.data)
      .then(data => {
        if (data.code === 0) {
          question.value = data.data;
          if (question.value.testcaseAbstract.length === 0) {
            question.value.testcaseAbstract =
              '\n### 测试集信息\n\n```\n[[空]]\n```\n';
          } else {
            question.value.testcaseAbstract =
              '\n### 测试集信息\n\n```sql\n' +
              question.value.testcaseAbstract +
              '\n```';
          }
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

const dataRef: Ref<{}[][]> = ref([[]]);
const run = () => {
  const handleAnswer = useranswer.value;
  loadingRef.value = true;
  axios
    .post(`api/v1/submit/test`, {
      testcaseID: Number(question.value.testcaseID),
      code: handleAnswer
    })
    .then(res => res.data)
    .then(data => {
      if (data.code === 0) {
        message.success('运行成功');
        if (question.value.judgeTypeID === DATABASE.REDIS) {
          let dataArr: Array<Array<Redisform>> = new Array<Array<Redisform>>();
          let now: Array<Redisform> = new Array<Redisform>();
          for (let i in data.data) now.push(new Redisform(data.data[i]));
          dataArr.push(now);
          dataRef.value = dataArr;
        } else {
          dataRef.value = data.data;
        }
        loadingRef.value = false;
      } else {
        loadingRef.value = false;
        if (data.message !== null) message.error(data.message);
        else message.error('代码有误');
      }
    })
    .catch(error => {
      loadingRef.value = false;
      console.error(error);
      message.error('错误！');
    });
};

const submit = () => {
  const handleAnswer = useranswer.value;
  loadingSubmitRef.value = true;
  axios
    .post(`api/v1/submit/submit`, {
      questionID: question.value.id,
      userID: userid,
      code: handleAnswer
    })
    .then(res => res.data)
    .then(data => {
      loadingSubmitRef.value = false;
      if (data.code === 0) {
        message.info(RESULT[data.data.result]);
      } else {
        if (data.message !== null) message.error(data.message);
        else message.error('提交失败');
      }
    })
    .catch(error => {
      loadingSubmitRef.value = false;
      console.error(error);
      message.error('错误或超时');
    });
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
    <n-h1 style="text-align: center"
      >#{{ question.id }}. {{ question.label }}</n-h1
    >
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
    <n-p
      v-dompurify-html="md.render(question.content)"
      v-highlight
      v-katex
    ></n-p>
    <n-card class="card">
      <n-scrollbar style="max-height: 400px">
        <n-scrollbar x-scrollable>
          <div
            v-dompurify-html="md.render(question.testcaseAbstract)"
            v-highlight
            v-katex
          ></div>
        </n-scrollbar>
      </n-scrollbar>
    </n-card>

    <n-h2>答题框</n-h2>
    <div v-if="question.judgeTypeID === DATABASE.REDIS">
      <sql-editor
        v-model:value="useranswer"
        language="lua"
        :value-change="valueChange"
      />
    </div>
    <div v-if="question.judgeTypeID !== DATABASE.REDIS">
      <sql-editor
        v-model:value="useranswer"
        language="sql"
        :value-change="valueChange"
      />
    </div>
    <n-space justify="space-between">
      <n-button
        secondary
        strong
        type="primary"
        size="large"
        style="margin-top: 1.6rem"
        :loading="loadingRef"
        @click="run"
      >
        <template #icon>
          <n-icon size="18">
            <TerminalOutline />
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
        :loading="loadingSubmitRef"
        @click="submit"
      >
        <template #icon>
          <n-icon size="18">
            <CodeSlashSharp />
          </n-icon>
        </template>
        提交
      </n-button>
    </n-space>
    <div>
      <smart-table :data-ref="dataRef" />
    </div>
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
  max-height: 450px;
}
</style>
