<script lang="ts" setup>
import { useMessage } from 'naive-ui';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import SqlEditor from '../components/SqlEditor.vue'

const router = useRouter();
const  sql = [
    {
      value: 0,
      label: "Mysql"
    },
    {
      value: 1,
      label: 'SqlServer'
    }
  ]


onMounted(() => {
  // 从路由中读取 testcaseid 的值
  const testcaseid = router.currentRoute.value.params.testcaseId;
  console.log(testcaseid);
});

let testcase = ref({
  label: '',
  abstract: '',
  content: '',
  lang: 0
})
const update1 = (str: any) => {
  testcase.value.abstract = str
}
const update2 = (str: any) => {
  testcase.value.content = str
}


const handleSubmit = () => {
  console.log(testcase.value)
}

const handleDelete = () => {

}

</script>

<template>
  <div class="manage-container">
    <n-h1>测试集</n-h1>
    <n-space vertical>
      <n-h2>测试集描述</n-h2>
      <n-input v-model:value="testcase.label" placeholder="请填写描述内容" :autofocus="true" />
      <n-h2>建表语句</n-h2>
      <div class="container">
        <sql-editor @update:value="update1" />
      </div>
    </n-space>
    <n-space vertical style="margin-top: 1.6rem">
      <n-h2>插入语句</n-h2>
      <div class="container">
        <sql-editor @update:value="update2" />
      </div>
      <!-- <> -->
    </n-space>
    <n-space style="margin-top: 1.6rem">
      <n-radio-group v-model:value="testcase.lang" name="radiogroup">
        <n-space>
          <n-radio v-for="s in sql" :key="s.value" :value="s.value">
            {{ s.label }}
          </n-radio>
        </n-space>
      </n-radio-group>
    </n-space>
    <n-space style="margin-top: 1.6rem">

      <n-button secondary strong type="primary" size="large" @click="handleSubmit">
        修改
      </n-button>

      <n-button secondary strong type="error" size="large" style="text-align: right" @click="handleDelete">
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
  padding-left: 5%;
  padding-right: 5%;
}

.card {
  text-align: left;
}

.container {
  height: 100%;
  width: 100%;
}
</style>
