<script lang="ts" setup>
import axios from 'axios';
import { editor } from 'monaco-editor';
import { useMessage } from 'naive-ui';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import SqlEditor from '../components/SqlEditor.vue';

const router = useRouter();
const message = useMessage();
const testcaseid = router.currentRoute.value.params.testcaseId;
const db_options = [
  {
    value: 1,
    label: 'MySQL'
  },
  {
    value: 2,
    label: 'SQL Server'
  },
  {
    value: 3,
    label: 'MariaDB'
  }
];
let testcase = ref({
  label: '',
  abstract: '',
  content: '',
  lang: null
});

onMounted(() => {
  // 从路由中读取 testcaseid 的值
  console.log(testcaseid);
  axios
    .get(`/api/v1/testcase/info/${testcaseid}`)
    .then(res => res.data)
    .then(data => {
      if (data.code === 0) {
        testcase.value = data.data;
      } else {
        message.error(data.message);
      }
    })
    .catch(error => {
      message.error('错误');
      console.log(error);
    });
});

const handleSubmit = () => {
  console.log(testcase.value);
  axios
    .post(`/api/v1/testcase/update`, {
      id: testcaseid,
      ...testcase.value
    })
    .then(res => res.data)
    .then(data => {
      if (data.code === 0) {
        message.error('更新成功');
        router.replace('/main/test-case');
      } else {
        message.error(data.message);
      }
    })
    .catch(error => {
      message.error('错误');
      console.log(error);
    });
};

const handleDelete = () => {
  axios
    .post(`/api/v1/testcase/delete`, null, { params: { id: testcaseid } })
    .then(res => res.data)
    .then(data => {
      if (data.code === 0) {
        message.error('删除成功');
        router.replace('/main/test-case');
      } else {
        message.error(data.message);
      }
    })
    .catch(error => {
      message.error('错误');
      console.log(error);
    });
};
</script>

<template>
  <div class="manage-container">
    <n-h1>测试集</n-h1>
    <n-form :model="testcase">
      <n-form-item label="标签" class="inputtext" path="label">
        <n-input
          v-model:value="testcase.label"
          placeholder="请填写标签内容"
          :autofocus="true"
        />
      </n-form-item>
      <n-form-item label="数据库" class="inputtext" path="lang">
        <n-select v-model:value="testcase.lang" :options="db_options" />
      </n-form-item>
      <n-form-item label="建表语句" class="inputtext" path="abstract">
        <sql-editor v-model:value="testcase.abstract" />
      </n-form-item>
      <n-form-item label="插入语句" class="inputtext" path="content">
        <sql-editor v-model:value="testcase.content" />
      </n-form-item>
    </n-form>
    <n-space>
      <n-button type="primary" @click="handleSubmit"> 修改 </n-button>

      <n-button type="error" @click="handleDelete"> 删除 </n-button>
    </n-space>
  </div>
</template>

<style scoped>
.manage-container {
  max-width: 800px;
  margin: 80px auto;
}

.card {
  text-align: left;
}
</style>
