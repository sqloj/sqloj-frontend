<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useMessage } from 'naive-ui';
import { Pencil } from '@vicons/ionicons5';
import axios from 'axios';

const columns = [
  {
    type: 'selection'
  },
  {
    title: '学号',
    key: 'id'
  },
  {
    title: '姓名',
    key: 'name'
  },
  {
    title: '班级',
    key: 'classes'
  },
  {
    title: '过题数',
    key: 'acnum'
  }
];

const dataRef = ref([]);
const loadingRef = ref(true);
const message = useMessage();
const checkedRowKeysRef = ref([]);
const handleCheck = (rowKeys: any) => {
  checkedRowKeysRef.value = rowKeys;
};

onMounted(() => {
  axios
    .post('/api/student/manage/list')
    .then(res => res.data)
    .then(data => {
      dataRef.value = data.user;
      loadingRef.value = false;
    });
});

const handleDelete = () => {
  console.log(checkedRowKeysRef.value);
  for (let id in checkedRowKeysRef.value) {
    console.log(checkedRowKeysRef.value[id]);
    // 依据 id 一个个发起删除请求
    axios
      .post('/api/student/delete', { id })
      .then(res => {
        loadingRef.value = false;
        return res.data;
      })
      .then(data => {
        console.log(data);
        if (data.success === false) {
          message.error(data.message);
        }
      })
      .catch(error => {
        console.error(error);
        message.error('ERROR!');
      });
  }

  message.success('删除成功');
  // 更新学生列表
  axios
    .post('/api/student/manage/list')
    .then(res => res.data)
    .then(data => {
      dataRef.value = data.user;
      loadingRef.value = false;
    });
  // 选中数组清空
  checkedRowKeysRef.value.splice(0, checkedRowKeysRef.value.length);
};

const pagination = {
  pageSize: 10
};
</script>

<template>
  <n-layout id="manage-container">
    <n-space vertical>
      <n-h1>学生管理</n-h1>
      <n-data-table
        :bordered="false"
        :columns="columns"
        :data="dataRef"
        :pagination="pagination"
        :row-key="(row: any) => row.id"
        :loading="loadingRef"
        @update:checked-row-keys="handleCheck"
      />

      <!--button -->

      <n-button
        secondary
        strong
        type="primary"
        size="large"
        @click="handleDelete"
      >
        <template #icon>
          <n-icon size="18">
            <Pencil />
          </n-icon>
        </template>
        批量删除
      </n-button>
    </n-space>
  </n-layout>
</template>

<style scoped>
#manage-container {
  padding: 20px;
  padding-top: 80px;
  overflow: auto;
  text-align: center;
  padding-left: 5%;
  padding-right: 5%;
  margin-bottom: 1rem;
}
</style>
