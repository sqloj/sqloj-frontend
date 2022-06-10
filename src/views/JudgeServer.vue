<script lang="ts" setup>
import { h, onMounted, ref } from 'vue';
import { NButton, useMessage } from 'naive-ui';
import { Add } from '@vicons/ionicons5';
import axios from 'axios';

const dataRef = ref([]);
const loadingRef = ref(true);
const message = useMessage();
const checkedRowKeysRef = ref([]);
const showModal = ref(false);
const showAddModal = ref(false);

const formInline = ref({
  id: 0,
  url: '',
  password: '',
  typeName: '',
  judgeTypeID: ''
});

const actions = [
  {
    title: '编辑',
    act: (row: any) => {
      showModal.value = true;
      formInline.value = row;
    }
  },
  {
    title: 'ping',
    act: (row: any) => {
      handlePing(row.url, row.password);
    }
  },
  {
    title: '删除',
    act: (row: any) => {
      axios
        .post('api/v1/judge/delete', null, { params: { id: row.id } })
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
    title: '地址',
    key: 'url'
  },
  {
    title: '密码',
    key: 'password'
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
            onClick: () => act.act(row)
          },
          { default: () => act.title }
        );
      });
      return buttons;
    }
  }
];

const query = () => {
  axios
    .get('api/v1/judge/list')
    .then(res => res.data)
    .then(data => {
      if (data.code === 0) {
        dataRef.value = data.data;
        loadingRef.value = false;
      } else {
        message.error(data.message);
      }
    })
    .catch(error => {
      loadingRef.value = false;
      console.error(error);
      message.error('出错');
    });
};

onMounted(query);

const addJudge = () => {
  showAddModal.value = true;
};
const handleAdd = () => {
  axios
    .post('api/v1/judge/insert', formInline.value)
    .then(res => res.data)
    .then(data => {
      if (data.code === 0) {
        message.success('添加成功');
        showAddModal.value = false;
      } else {
        message.error(data.message);
      }
    })
    .catch(error => {
      console.error(error);
      message.error('出错');
    })
    .finally(() => {
      query();
    });
};

const handlePing = (url: String, password: String) => {
  axios
    .post('api/v1/judge/ping', {
      id: 0,
      judgeTypeID: 0,
      typeName: '',
      url: url,
      password: password
    })
    .then(res => res.data)
    .then(data => {
      if (data.code === 0) {
        message.success('连接正常');
      } else {
        message.error(data.message);
      }
    })
    .catch(error => {
      console.error(error);
      message.error('ERROR!');
    });
};

const handleUpdate = () => {
  showModal.value = false;
  axios
    .post('api/v1/judge/update', formInline.value)
    .then(res => res.data)
    .then(data => {
      if (data.code === 0) {
        message.success('更新成功');
      } else {
        message.error(data.message);
      }
    })
    .finally(() => {
      query();
    });
};
</script>

<template>
  <n-layout id="manage-container">
    <n-h1>测评机管理</n-h1>
    <n-space style="margin-bottom: 8px">
      <n-button type="primary" size="medium" @click="addJudge">
        <template #icon>
          <n-icon size="18">
            <Add />
          </n-icon>
        </template>
        添加测评机
      </n-button>
    </n-space>
    <n-data-table
      v-model:checked-row-keys="checkedRowKeysRef"
      :bordered="false"
      :columns="columns"
      :data="dataRef"
      :pagination="{ pageSize: 10 }"
      :row-key="(row: any) => row.userid"
      :loading="loadingRef"
    />

    <n-modal v-model:show="showModal">
      <n-card
        style="width: 500px"
        title="测评机"
        :bordered="false"
        size="medium"
        role="dialog"
        aria-modal="true"
        header-style="text-align: center"
        footer-style="text-align: center"
      >
        <!-- 内容 -->
        <n-form label-placement="left" size="medium" :model="formInline">
          <!-- input URL -->
          <n-form-item label="地址" class="inputtext" path="url">
            <n-input v-model:value="formInline.url" placeholder=""> </n-input>
          </n-form-item>
          <!-- input password -->
          <n-form-item label="密码" class="inputtext" path="password">
            <n-input v-model:value="formInline.password" placeholder="">
            </n-input>
          </n-form-item>
        </n-form>

        <template #footer>
          <!-- 尾部 -->
          <n-space justify="center">
            <n-button
              type="primary"
              size="medium"
              @click="handlePing(formInline.url, formInline.password)"
            >
              Ping
            </n-button>
            <n-button type="primary" size="medium" @click="handleUpdate">
              编辑
            </n-button>
          </n-space>
        </template>
      </n-card>
    </n-modal>
    <n-modal v-model:show="showAddModal">
      <n-card
        style="width: 500px"
        title="测评机"
        :bordered="false"
        size="medium"
        role="dialog"
        aria-modal="true"
        header-style="text-align: center"
        footer-style="text-align: center"
      >
        <!-- 内容 -->
        <n-form label-placement="left" size="medium" :model="formInline">
          <!-- input URL -->
          <n-form-item label="地址" class="inputtext" path="url">
            <n-input v-model:value="formInline.url" placeholder=""> </n-input>
          </n-form-item>
          <!-- input password -->
          <n-form-item label="密码" class="inputtext" path="password">
            <n-input v-model:value="formInline.password" placeholder="">
            </n-input>
          </n-form-item>
        </n-form>

        <template #footer>
          <!-- 尾部 -->
          <n-space justify="center">
            <n-button
              type="primary"
              size="medium"
              @click="handlePing(formInline.url, formInline.password)"
            >
              Ping
            </n-button>
            <n-button type="primary" size="medium" @click="handleAdd">
              添加
            </n-button>
          </n-space>
        </template>
      </n-card>
    </n-modal>
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
