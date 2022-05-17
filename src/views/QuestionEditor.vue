<script lang="ts" setup>
import { useMessage } from 'naive-ui';
import { onMounted, Ref, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Pencil, BugOutline, CloseOutline } from '@vicons/ionicons5';
import axios from 'axios';

/*
  读取当前的题目信息，{id, content, answer, passnum, testcase_id}
*/

const router = useRouter();
const message = useMessage();
const loadingRef = ref(true);
let question = ref({ id: '', content: '', answer: '', testcase_id: '' });

// 依赖数据库选择
let optionsRef: Ref<{}[]> = ref([]);
const questionid = router.currentRoute.value.params.QuestionId;

onMounted(() => {
  // 从路由中读取 QuestionId 的值

  axios
    .post(`/api/testcase/list`)
    .then(res => res.data)
    .then(data => {
      for (let t of data.testcase) {
        optionsRef.value.push({ label: t.describe, value: t.id });
      }
    })
    .catch(error => {
      console.error(error);
      message.error('错误！');
    })
    .finally(() => {
      if (Number.isFinite(Number(questionid))) {
        axios
          .post(`/api/v1/question/info/{id}`, { id: Number(questionid) })
          .then(res => res.data)
          .then(data => {
            if (data.success) {
              question.value = data.question;
            } else {
              message.error(data.message);
              router.back();
            }
          })
          .finally(() => {
            loadingRef.value = false;
          });
      } else {
        message.error('错误的编号');
        router.back();
      }
    });
});
/*
  修改题目
*/
const handleSubmit = () => {
  axios
    .post(`/api/v1/question/update`, question.value)
    .then(res => res.data)
    .then(data => {
      if (data.success) {
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
    .post(`/api/v1/question/delete`, { id: questionid })
    .then(res => res.data)
    .then(data => {
      if (data.success) {
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
      <n-input
        v-model:value="question.answer"
        type="textarea"
        placeholder="请填写答案"
      />
      <n-h2>依赖数据库</n-h2>
      <n-select
        v-model:value="question.testcase_id"
        :options="optionsRef"
        style="max-width: 500px"
        default-value="default_choose"
        :loading="loadingRef"
      />
    </div>

    <n-space style="margin-top: 1.6rem">
      <n-button secondary strong type="primary" size="large" @click="handleRun">
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
