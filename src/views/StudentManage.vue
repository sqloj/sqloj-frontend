<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useMessage } from 'naive-ui';
import { Pencil, PersonAddOutline } from '@vicons/ionicons5';
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
const showModal = ref();
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

// 添加学生
const formInline = ref({
  userid: '',
  username: '',
  classes: '',
  password: '123456'
});

const handleSubmit = () => {
  console.log(formInline.value);
  if (formInline.value.userid === '') {
    return message.error('请填写学号!');
  } else if (formInline.value.userid.length > 20) {
    formInline.value.userid = '';
    return message.error('学号过长，请重新输入！');
  }

  if (formInline.value.username === '') {
    return message.error('请填写姓名!');
  } else if (formInline.value.username.length > 30) {
    formInline.value.username = '';
    return message.error('姓名过长，请重新输入！');
  }

  if (formInline.value.classes === '') {
    return message.error('请填写班级!');
  } else if (formInline.value.classes.length > 30) {
    formInline.value.classes = '';
    return message.error('班级名过长，请重新输入！');
  }

  if (formInline.value.password === '') {
    return message.error('密码不能为空!');
  } else if (formInline.value.password.length < 6) {
    return message.error('密码过短，长度小于 6 字符！');
  } else if (formInline.value.password.length > 50) {
    formInline.value.password = '';
    return message.error('密码过长！');
  }

  axios
    .post('/api/student/insert', formInline.value)
    .then(res => res.data)
    .then(data => {
      if (data.success) {
        message.success('添加成功！');
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
      <div>
        <n-button
          secondary
          strong
          type="primary"
          size="large"
          class="space"
          @click="handleDelete"
        >
          <template #icon>
            <n-icon size="18">
              <Pencil />
            </n-icon>
          </template>
          批量删除
        </n-button>

        <n-button
          secondary
          strong
          type="primary"
          size="large"
          class="space"
          @click="showModal = true"
        >
          <template #icon>
            <n-icon size="18">
              <PersonAddOutline />
            </n-icon>
          </template>
          添加学生
        </n-button>
        <!--弹出的卡片-->
        <n-modal v-model:show="showModal">
          <n-card
            style="width: 500px"
            title="添加学生"
            :bordered="false"
            size="medium"
            role="dialog"
            aria-modal="true"
            header-style="text-align: center"
            footer-style="text-align: center"
          >
            <!-- 内容 -->

            <n-form label-placement="left" size="medium" :model="formInline">
              <!-- input ID -->
              <n-form-item label="学号" class="inputtext" path="userid">
                <n-input v-model:value="formInline.userid" placeholder="学号">
                </n-input>
              </n-form-item>

              <!-- input name -->
              <n-form-item label="姓名" class="inputtext" path="username">
                <n-input v-model:value="formInline.username" placeholder="姓名">
                </n-input>
              </n-form-item>

              <!-- input class -->
              <n-form-item label="班级" class="inputtext" path="classes">
                <n-input v-model:value="formInline.classes" placeholder="班级">
                </n-input>
              </n-form-item>

              <!-- input password-->
              <n-form-item label="密码" class="inputtext" path="password">
                <n-input
                  v-model:value="formInline.password"
                  type="password"
                  show-password-on="mousedown"
                  placeholder="密码"
                  @keyup.enter="handleSubmit"
                >
                </n-input>
              </n-form-item>
            </n-form>

            <template #footer>
              <!-- 尾部 -->
              <n-button type="primary" size="medium" @click="handleSubmit">
                <template #icon>
                  <n-icon size="18">
                    <PersonAddOutline />
                  </n-icon>
                </template>
                添加
              </n-button>
            </template>
          </n-card>
        </n-modal>
      </div>
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
