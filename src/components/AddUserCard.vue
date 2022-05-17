<script lang="ts" setup>
import { ref } from 'vue';
import { useMessage } from 'naive-ui';
import { PersonAddOutline } from '@vicons/ionicons5';
import axios from 'axios';

const message = useMessage();

const props = defineProps<{
  isadmin: boolean;
}>();

const formInline = ref({
  userid: '',
  username: '',
  classes: '',
  password: '123456',
  admin: props.isadmin
});

const rules = {
  userid: { required: true, trigger: ['blur'], message: '请输入 ID' },
  username: { required: true, trigger: ['blur'], message: '请输入用户名' },
  classes: { required: true, trigger: ['blur'], message: '请输入学院或班级' },
  password: { required: true, trigger: ['blur'], message: '请输入密码' }
};

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
  <!-- <n-modal> -->
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
    <n-form
      label-placement="left"
      size="medium"
      :model="formInline"
      :rules="rules"
    >
      <!-- input ID -->
      <div v-if="props.isadmin">
        <n-form-item label="工号" class="inputtext" path="userid">
          <n-input v-model:value="formInline.userid" placeholder="工号">
          </n-input>
        </n-form-item>
      </div>
      <div v-else>
        <n-form-item label="学号" class="inputtext" path="userid">
          <n-input v-model:value="formInline.userid" placeholder="学号">
          </n-input>
        </n-form-item>
      </div>
      <!-- input name -->
      <n-form-item label="姓名" class="inputtext" path="username">
        <n-input v-model:value="formInline.username" placeholder="姓名">
        </n-input>
      </n-form-item>
      <!-- input class -->
      <div v-if="props.isadmin">
        <n-form-item label="学院" class="inputtext" path="classes">
          <n-input v-model:value="formInline.classes" placeholder="学院">
          </n-input>
        </n-form-item>
      </div>
      <div v-else>
        <n-form-item label="班级" class="inputtext" path="classes">
          <n-input v-model:value="formInline.classes" placeholder="班级">
          </n-input>
        </n-form-item>
      </div>
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
  <!-- </n-modal> -->
</template>
