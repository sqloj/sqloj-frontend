<script lang="ts" setup>
import { h, onMounted, ref } from 'vue';
import { NButton, useMessage } from 'naive-ui';
import { Pencil, PersonAddOutline } from '@vicons/ionicons5';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { SQL } from '../setting/const';

const router = useRouter();

const actions = [
  {
    title: '编辑',
    act: (id: any) => {
      router.push({
        name: 'test-case-editor',
        params: {
          testcaseId: id
        }
      });
    }
  },
  {
    title: '删除',
    act: (id: any) => {
      axios
        .post('/api/testcase/delete', { id: id })
        .then(res => res.data)
        .then(data => {
          if (data.code === 0) {
            message.success('删除成功');
          } else {
            message.error(data.message);
          }
        })
        .catch(error => {
          console.error(error);
          message.error('ERROR!');
        })
        .finally(() => {
          query();
        });
    }
  }
];

const columns = [
  {
    title: '编号',
    key: 'id'
  },
  {
    title: '描述',
    key: 'label',
    width: '50%'
  },
  {
    title: '数据库类型',
    key: 'lang'
  },
  {
    title: '操作',
    key: 'action',
    render(row: any) {
      const buttons = actions.map(act => {
        return h(
          NButton,
          {
            style: {
              marginRight: '12px'
            },
            size: 'small',
            onClick: () => act.act(row.id)
          },
          { default: () => act.title }
        );
      });
      return buttons;
    }
  }
];

const dataRef = ref([]);
const loadingRef = ref(true);
const message = useMessage();

/*
  查询数据集{"id" ,"label" ,"abstract" ,"content" ,"lang"},
*/
const query = () => {
  axios
    .get('/api/v1/testcase/list')
    .then(res => res.data)
    .then(data => {
      for (let i of data.data) {
        i.lang = SQL[i.lang];
      }
      dataRef.value = data.data;
      loadingRef.value = false;
    });
};

onMounted(query);
</script>

<template>
  <n-layout id="manage-container">
    <n-space vertical>
      <n-h1>测试集</n-h1>
      <n-data-table
        :bordered="false"
        :columns="columns"
        :data="dataRef"
        :pagination="{ pageSize: 10 }"
        :row-key="(row: any) => row.id"
        :loading="loadingRef"
      />

      <!--delete and addStudents button -->
      <div></div>
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

.space {
  margin-left: 20px;
  margin-right: 20px;
}
</style>
