<script lang="ts" setup>
import { h, onMounted, ref } from 'vue';
import { NButton, useMessage } from 'naive-ui';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { Add } from '@vicons/ionicons5';

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
        .post(`/api/v1/testcase/delete`, null, { params: { id: id } })
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
          console.error(error);
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
    key: 'typeName'
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
  查询数据集{"id" ,"label" ,"abstract" ,"content" ,"typeName"},
*/
const query = () => {
  axios
    .get('/api/v1/testcase/list')
    .then(res => res.data)
    .then(data => {
      dataRef.value = data.data;
      loadingRef.value = false;
    });
};

onMounted(query);

const addTestCase = () => {
  router.push('test-case-add');
};
</script>

<template>
  <n-layout id="manage-container">
    <n-space vertical>
      <n-h1>测试集</n-h1>
      <n-space style="margin-bottom: 8px">
        <n-button type="primary" size="medium" @click="addTestCase">
          <template #icon>
            <n-icon size="18">
              <Add />
            </n-icon>
          </template>
          添加测试集
        </n-button>
      </n-space>
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
