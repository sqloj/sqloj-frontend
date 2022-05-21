<script lang="ts" setup>
import { useMessage } from 'naive-ui';
import { onMounted, Ref, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Pencil, ArrowBack, CloseOutline } from '@vicons/ionicons5';
import axios from 'axios';
import SqlEditor from '../components/SqlEditor.vue';

/*
  读取当前的题目信息，"id", "content", "answer", "testcaseID" ,"label" ,"abstract" ,"lang"
*/

const router = useRouter();
const message = useMessage();
const loadingRef = ref(true);
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

// 依赖数据库选择
let optionsRef: Ref<{}[]> = ref([]);
const questionid = router.currentRoute.value.params.QuestionId;

onMounted(() => {
  axios
    .get(`/api/v1/testcase/list`)
    .then(res => res.data)
    .then(data => {
      if (data.code === 0) {
        for (let t of data.data) {
          optionsRef.value.push({ label: t.label, value: t.id });
        }
      } else {
        message.error(data.message);
      }
    })
    .catch(error => {
      console.error(error);
      message.error('错误！');
    })
    .finally(() => {
      if (Number.isFinite(Number(questionid))) {
        axios
          .get(`/api/v1/question/info/${Number(questionid)}`)
          .then(res => res.data)
          .then(data => {
            if (data.code === 0) {
              question.value = data.data;
              valueChange.value = !valueChange.value;
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
            loadingRef.value = false;
          });
      } else {
        message.error('错误的编号');
        router.replace('/main/question-manage');
      }
    });
});
/*
  修改题目
  "id" ,"content" ,"answer" ,"testcaseID"
*/
const handleSubmit = () => {
  axios
    .post(`/api/v1/question/update`, {
      id: question.value.id,
      content: question.value.content,
      answer: question.value.answer,
      testcaseID: question.value.testcaseID
    })
    .then(res => res.data)
    .then(data => {
      if (data.code === 0) {
        message.success('信息更新成功！');
      } else {
        message.error(data.message);
      }
    })
    .catch(error => {
      console.error(error);
      message.error('错误！');
    })
    .finally(() => {
      //切回答题页面
      router.push({
        name: 'question',
        params: {
          QuestionId: Number(questionid)
        }
      });
    });
};

const handleRun = () => {
  router.push({
    name: 'question',
    params: {
      QuestionId: Number(questionid)
    }
  });
};

const handleDelete = () => {
  axios
    .post(`/api/v1/question/delete`, null, {
      params: { id: Number(questionid) }
    })
    .then(res => res.data)
    .then(data => {
      if (data.code === 0) {
        message.success('删除成功');
        router.replace('/main/question-manage');
      } else {
        message.error(data.message);
      }
    })
    .catch(error => {
      console.error(error);
      message.error('错误！');
    });
};
</script>

<template>
  <div class="manage-container">
    <n-h1 style="text-align: center">#{{ question.id }}</n-h1>
    <div>
      <n-h2>题目描述</n-h2>
      <n-input
        v-model:value="question.content"
        type="textarea"
        placeholder="请填写题目内容"
        :autofocus="true"
      />
      <n-h2>题目答案</n-h2>
      <sql-editor v-model:value="question.answer" :value-change="valueChange" />
      <n-h2>依赖数据集</n-h2>
      <n-select
        v-model:value="question.testcaseID"
        :options="optionsRef"
        style="max-width: 500px"
        :default-value="question.label"
        :loading="loadingRef"
      />
    </div>

    <n-space style="margin-top: 1.6rem">
      <n-button secondary strong type="primary" size="large" @click="handleRun">
        <template #icon>
          <n-icon size="18">
            <ArrowBack />
          </n-icon>
        </template>
        测试
      </n-button>

      <n-button
        secondary
        strong
        type="primary"
        size="large"
        @click="handleSubmit"
      >
        <template #icon>
          <n-icon size="18">
            <Pencil />
          </n-icon>
        </template>
        修改
      </n-button>

      <n-button
        secondary
        strong
        type="error"
        size="large"
        style="text-align: right"
        @click="handleDelete"
      >
        <template #icon>
          <n-icon size="18">
            <CloseOutline />
          </n-icon>
        </template>
        删除
      </n-button>
    </n-space>
  </div>
</template>

<style scoped>
.manage-container {
  padding-top: 80px;
  text-align: left;
  margin: 0 auto;
  max-width: 800px;
}

.card {
  text-align: left;
}
</style>
