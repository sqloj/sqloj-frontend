<script lang="ts" setup>
import axios from 'axios';
import { useMessage } from 'naive-ui';
import { onMounted, Ref, ref } from 'vue';
import { useRouter } from 'vue-router';
import SqlEditor from '../components/SqlEditor.vue';

const router = useRouter();
const message = useMessage();
const db_options: Ref<{}[]> = ref([]);

onMounted(() => {
  axios
    .get(`api/v1/judge/allSupport`)
    .then(res => res.data)
    .then(data => {
      if (data.code === 0) {
        for (let i of data.data) {
          db_options.value.push({ value: i.typeID, label: i.typeName });
        }
      } else {
        message.error(data.message);
        router.back();
      }
    })
    .catch(error => {
      message.error('错误');
      console.log(error);
    });
});

let testcase = ref({
  label: '',
  abstract: '',
  content: '',
  lang: null
});

const handleSubmit = () => {
  if (testcase.value.lang === null) {
    return message.error('请选择数据库');
  }
  axios
    .post(`api/v1/testcase/insert`, testcase.value)
    .then(res => res.data)
    .then(data => {
      if (data.code === 0) {
        message.success('添加成功');
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
      <n-button type="primary" @click="handleSubmit"> 添加 </n-button>
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
