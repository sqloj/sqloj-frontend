<script lang="ts" setup>
import { useMessage } from 'naive-ui';
import { onMounted, Ref, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Pencil } from '@vicons/ionicons5';
import SqlEditor from '../components/SqlEditor.vue';
import axios from 'axios';

/*
  读取当前的题目信息，{"id", "content", "answer", "testcaseID"}
*/

const router = useRouter();
const message = useMessage();
const loadingRef = ref(true);
let question = ref({ id: '', content: '', answer: '', testcaseID: '' });

// 依赖数据库选择
let optionsRef: Ref<{}[]> = ref([]);

onMounted(() => {
  axios
    .get(`/api/v1/testcase/list`)
    .then(res => res.data)
    .then(data => {
      for (let t of data.data) {
        optionsRef.value.push({ label: t.label, value: t.id });
      }
      loadingRef.value = false;
    })
    .catch(error => {
      console.error(error);
      message.error('错误！');
    });
});
/*
  修改题目
*/
const handleAdd = () => {
  console.log(question.value);
  axios
    .post(`/api/v1/question/insert`, question.value)
    .then(res => res.data)
    .then(data => {
      if (data.code === 0) {
        question.value.id = data.id;
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
          QuestionId: Number(question.value.id)
        }
      });
    });
};
</script>

<template>
  <div class="manage-container">
    <n-h1 style="text-align: center">#{{ question.id }} 自动编号</n-h1>
    <div>
      <n-h2>题目描述</n-h2>
      <n-input
        v-model:value="question.content"
        type="textarea"
        placeholder="请填写题目内容"
        :autofocus="true"
      />
      <n-h2>题目答案</n-h2>
      <sql-editor v-model:value="question.answer" />
      <!-- <n-input
        v-model:value="question.answer"
        type="textarea"
        placeholder="请填写答案"
      /> -->
      <n-h2>依赖数据库</n-h2>
      <n-select
        v-model:value="question.testcaseID"
        :options="optionsRef"
        style="max-width: 500px"
        default-value="default_choose"
        :loading="loadingRef"
      />
    </div>

    <n-space style="margin-top: 1.6rem">
      <n-button secondary strong type="primary" size="large" @click="handleAdd">
        <template #icon>
          <n-icon size="18">
            <Pencil />
          </n-icon>
        </template>
        添加
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
