<script lang="ts" setup>
import { useMessage } from 'naive-ui';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Pencil , BugOutline} from '@vicons/ionicons5'
import axios from 'axios';

const router = useRouter();
const message = useMessage();
const question = JSON.parse(sessionStorage.question);
const useranswer = ref('');

let Control = ref({
  admin: false,
  edit: false,
});

let QueEdit = ref({
  content: '',
  answer: '',
  testcase_id: '',
});
let options: Array<Object> = [];

onMounted(() => {
  Control.value.admin = JSON.parse(sessionStorage.account).admin;
  console.log(Control.value.admin);
  if (question.id != router.currentRoute.value.params.QuestionId) {
    // !== 出问题
    message.error('题目信息错误');
    router.back();
  }
});

const handleEdit = () => {
  Control.value.edit = true;
    axios
    .post(`/api/testcase/list`,)
    .then(res => res.data)
    .then(data => {
      QueEdit.value.content = question.content;
      QueEdit.value.answer = question.answer;

      const testcase = data.testcase;
      for (let t of testcase) {
        options.push({ label: t.describe, value: t.id })
      }
    })
    .catch(error => {
      console.error(error);
      message.error('错误！');
    });
}
const run = () => {
  router.back();
}

const handleSubmit = () => {
  axios
    .post(`/api/question/update`, {
      id : question.id,
      ...QueEdit.value
    })
    .then(res => res.data)
    .then(data => {
      console.log(data);
      if (data.success) {
        const userJson = {
          id: question.id,
          ...QueEdit.value
        };
        sessionStorage.question = JSON.stringify(userJson);
        message.success('信息更新成功！');
        location.reload();
      } else {
        message.error(data.message);
      }
    })
    .catch(error => {
      console.error(error);
      message.error('错误！');
    });
    Control.value.edit = false;
}

</script>

<template>
    <div class="manage-container">
    <n-h1 style="text-align: center;">#{{ question.id }}</n-h1>
    <div v-if="Control.edit === false">
      <n-button v-if="Control.admin" secondary strong type="primary" size="medium" @click="handleEdit">
        <template #icon>
          <n-icon size="18">
            <Pencil />
          </n-icon>
        </template>
        编辑题目
      </n-button>
      <!-- <n-space vertical> -->
      <n-h2>题目描述</n-h2>
      <n-divider />
      <n-h4>{{ question.content }}</n-h4>
      <n-h2>答题框</n-h2>
      <n-input v-model:value="useranswer" type="textarea" placeholder="在此处填写答案" :autofocus="true" />
      <!-- </n-space> -->
    </div>
    <div v-else>
      <div>
      <n-h2>题目描述</n-h2>
      <n-divider />
      <n-input v-model:value="QueEdit.content" type="textarea" placeholder="请填写题目内容" :autofocus="true" />
      <n-h2>题目答案</n-h2>
      <n-divider />
      <n-input v-model:value="QueEdit.answer" type="textarea" placeholder="请填写答案" />
      <n-h2>依赖数据库</n-h2>
      <n-divider />
      <n-select v-model:value="QueEdit.testcase_id" :options="options" style="max-width: 500px;"/>
      </div>

      <n-space justify="space-between" style="margin-top: 1.6rem;">
        <n-button secondary strong type="primary" size="large" @click="run">
          <template #icon>
            <n-icon size="18">
              <BugOutline />
            </n-icon>
          </template>
          运行
        </n-button>
        <n-button secondary strong type="primary" size="large" @click="handleSubmit">
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
  overflow-x: unset !important;
}

.card {
  text-align: left;
}
</style>
