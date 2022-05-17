<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useMessage } from 'naive-ui';
import { Pencil, PersonAddOutline } from '@vicons/ionicons5';
import axios from 'axios';

/*
  展示学生管理信息 {userid, username, classes, acnum}
*/
const columns = [
  {
    title: '工号',
    key: 'userid'
  },
  {
    title: '姓名',
    key: 'username'
  },
  {
    title: '学院',
    key: 'classes'
  }
];

const dataRef = ref([]);
const loadingRef = ref(true);
const message = useMessage();
const checkedRowKeysRef = ref([]);
const showModal = ref(false);
const handleCheck = (rowKeys: any) => {
  checkedRowKeysRef.value = rowKeys;
};

/*
  查询学生列表的api （应当只有学生）
*/
const query = () => {
  axios
    .post('/api/admin/manage/list')
    .then(res => res.data)
    .then(data => {
      dataRef.value = data.admin;
      loadingRef.value = false;
    });
};

onMounted(query);

// 添加老师
const formInline = ref({
  userid: '',
  username: '',
  classes: '',
  password: '123456',
  admin: true
});

const handleSubmit = () => {
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

  if (formInline.value.classes.length > 30) {
    formInline.value.classes = '';
    return message.error('学院名过长，请重新输入！');
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
    .post('/api/v1/user/register', formInline.value)
    .then(res => res.data)
    .then(data => {
      if (data.success) {
        message.success('添加成功！');
        showModal.value = false;
      } else {
        message.error(data.message);
      }
    })
    .catch(error => {
      console.error(error);
      message.error('错误！');
    })
    .finally(() => {
      query();
    });
};
</script>

<template>
  <n-layout id="manage-container">
    <n-space vertical>
      <n-h1>管理员列表</n-h1>
      <n-data-table
        :bordered="false"
        :columns="columns"
        :data="dataRef"
        :pagination="{ pageSize: 10 }"
        :row-key="(row: any) => row.userid"
        :loading="loadingRef"
        @update:checked-row-keys="handleCheck"
      />

      <!--delete and addStudents button -->
      <div>
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
          新增管理员
        </n-button>

        <!--弹出的卡片-->
        <n-modal v-model:show="showModal">
          <n-card
            style="width: 500px"
            title="添加管理员"
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
              <n-form-item label="工号" class="inputtext" path="userid">
                <n-input v-model:value="formInline.userid" placeholder="工号">
                </n-input>
              </n-form-item>
              <!-- input name -->
              <n-form-item label="姓名" class="inputtext" path="username">
                <n-input v-model:value="formInline.username" placeholder="姓名">
                </n-input>
              </n-form-item>
              <!-- input class -->
              <n-form-item label="学院" class="inputtext" path="classes">
                <n-input v-model:value="formInline.classes" placeholder="学院">
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
