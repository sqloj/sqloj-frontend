<script lang="ts" setup>
import { useMessage } from 'naive-ui';
import { onBeforeMount, onMounted, ref } from 'vue';
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
// 权限管理，是否为编辑页面
let Control = ref({
  admin: false,
  edit: false
});
// 编辑内容
let QueEdit = ref({
  content: '',
  answer: '',
  testcase_id: ''
});
// 依赖数据库选择
let options: Array<Object> = [];

onMounted(() => {
  Control.value.admin = JSON.parse(localStorage.account).admin;
  // 从路由中读取 QuestionId 的值
  const questionid = router.currentRoute.value.params.QuestionId;
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
      // 如果是老师，调用查找依赖数据库（切换时再调用有bug）
      if (Control.value.admin) {
        axios
          .post(`/api/testcase/list`)
          .then(res => res.data)
          .then(data => {
            const testcase = data.testcase;
            for (let t of testcase) {
              options.push({ label: t.describe, value: t.id });
            }
          })
          .catch(error => {
            console.error(error);
            message.error('错误！');
          })
          .finally(() => {
            Control.value.edit = true;
            QueEdit.value.content = question.value.content;
            QueEdit.value.answer = question.value.answer;
            QueEdit.value.testcase_id = question.value.testcase_id;
          });
      }
    });
});
/*
  切换到编辑状态
*/
const handleEdit = () => {
  Control.value.edit = true;
  // 信息
  QueEdit.value.content = question.value.content;
  QueEdit.value.answer = question.value.answer;
  QueEdit.value.testcase_id = question.value.testcase_id;
};

/*
  产看 answer 的运行结果
*/
const run = () => {
  console.log('运行');
};
/*
  修改题目
*/
const handleSubmit = () => {
  axios
    .post(`/api/question/update`, {
      id: question.value.id,
      ...QueEdit.value
    })
    .then(res => {
      //切回答题页面，并更新内容
      Control.value.edit = false;
      question.value.content = QueEdit.value.content;
      const newquestion = {
        id: question.value.id,
        ...QueEdit.value
      };
      question.value = newquestion;
      localStorage.question = JSON.stringify(newquestion);
      return res.data;
    })
    .then(data => {
      if (data.success) {
        const userJson = {
          id: question.value.id,
          ...QueEdit.value
        };
        localStorage.question = JSON.stringify(userJson);
        message.success('信息更新成功！');
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
    <div v-if="Control.edit === false">
      <n-button
        v-if="Control.admin"
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
      <n-space>
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
      <!-- </n-space> -->
    </div>
    <div v-else>
      <div>
        <n-h2>题目描述</n-h2>
        <n-input
          v-model:value="QueEdit.content"
          type="textarea"
          placeholder="请填写题目内容"
          :autofocus="true"
        />
        <n-h2>题目答案</n-h2>
        <n-input
          v-model:value="QueEdit.answer"
          type="textarea"
          placeholder="请填写答案"
        />
        <n-h2>依赖数据库</n-h2>
        <n-select
          v-model:value="QueEdit.testcase_id"
          :options="options"
          style="max-width: 500px"
          default-value="default_choose"
        />
      </div>

      <n-space justify="space-between" style="margin-top: 1.6rem">
        <n-button secondary strong type="primary" size="large" @click="run">
          <template #icon>
            <n-icon size="18">
              <BugOutline />
            </n-icon>
          </template>
          运行
        </n-button>
        <n-button secondary strong type="primary" size="large" @click="run">
          <template #icon>
            <n-icon size="18">
              <BugOutline />
            </n-icon>
          </template>
          测试
        </n-button>
        <n-button secondary strong type="primary" size="large" @click="run">
          <template #icon>
            <n-icon size="18">
              <BugOutline />
            </n-icon>
          </template>
          删除
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
      </n-space>
    </div>
  </div>
</template>

<style scoped>
.manage-container {
  padding: 20px;
  padding-top: 80px;
  overflow: auto;
  text-align: left;
  padding-left: 5%;
  padding-right: 5%;
}

.card {
  text-align: left;
}
</style>
