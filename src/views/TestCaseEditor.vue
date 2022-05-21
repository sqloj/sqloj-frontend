<script lang="ts" setup>
import axios from 'axios';
import { editor } from 'monaco-editor';
import { useMessage } from 'naive-ui';
import { onMounted, Ref, ref } from 'vue';
import { useRouter } from 'vue-router';
import SqlEditor from '../components/SqlEditor.vue';

const router = useRouter();
const message = useMessage();
const valueChange = ref(false);
const testcaseid = router.currentRoute.value.params.testcaseId;
const db_options: Ref<{}[]> = ref([]);
let testcase = ref({
  label: '',
  abstract: '',
  content: '',
  typeID: null
});

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
    })
    .finally(() => {
      axios
        .get(`/api/v1/testcase/info/${testcaseid}`)
        .then(res => res.data)
        .then(data => {
          if (data.code === 0) {
            console.log(data.data);
            testcase.value = data.data;
            valueChange.value = !valueChange.value;
          } else {
            message.error(data.message);
          }
        })
        .catch(error => {
          message.error('错误');
          console.log(error);
        });
    });
});

const handleSubmit = () => {
  // console.log({id: testcaseid,
  //     label:  testcase.value.label,
  //     content: testcase.value.content.replace(/\r\n/, ' '),
  //     abstract: testcase.value.abstract.replace(/\r\n/, ' '),
  //     typeID: testcase.value.typeID});
  axios
    .post(`/api/v1/testcase/update`, {
      id: testcaseid,
      label: testcase.value.label,
      content: testcase.value.content.replace(/\r\n/, ' '),
      abstract: testcase.value.abstract.replace(/\r\n/, ' '),
      // typeID: testcase.value.typeID,
      typeName: testcase.value.typeID
    })
    .then(res => res.data)
    .then(data => {
      if (data.code === 0) {
        message.success('更新成功');
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
        message.success('删除成功');
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
        <n-select v-model:value="testcase.typeID" :options="db_options" />
      </n-form-item>
      <n-form-item label="申明语句" class="inputtext" path="abstract">
        <sql-editor
          v-model:value="testcase.abstract"
          :value-change="valueChange"
        />
      </n-form-item>
      <n-form-item label="插入语句" class="inputtext" path="content">
        <sql-editor
          v-model:value="testcase.content"
          :value-change="valueChange"
        />
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
