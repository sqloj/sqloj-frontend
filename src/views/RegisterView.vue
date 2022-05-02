<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  PersonOutline,
  LockClosedOutline,
  AccessibilityOutline,
  PeopleOutline
} from '@vicons/ionicons5';
import axios from 'axios';
import { useMessage } from 'naive-ui';

const formRef = ref();
const loading = ref(false);
const router = useRouter();
const message = useMessage();

const formInline = ref({
  userid: '',
  username: '',
  classes: '',
  password1: '',
  password2: '',
  password: ''
});

const rules = {
  userid: { required: true, message: '请输入学号' },
  username: { required: true, message: '请输入用户名' },
  classes: { required: true, message: '请输入班级' },
  password1: { required: true, message: '请输入密码' },
  password2: { required: true, message: '请再次输入密码' }
};

const handleSubmit = () => {
  if (formInline.value.userid === '') {
    return message.error('请填写您的学号!');
  } else if (formInline.value.userid.length > 20) {
    formInline.value.userid = '';
    return message.error('学号过长，请重新输入！');
  }

  if (formInline.value.username === '') {
    return message.error('请填写您的姓名!');
  } else if (formInline.value.username.length > 30) {
    formInline.value.username = '';
    return message.error('姓名过长，请重新输入！');
  }

  if (formInline.value.classes === '') {
    return message.error('请填写您的班级!');
  } else if (formInline.value.classes.length > 30) {
    formInline.value.classes = '';
    return message.error('班级名过长，请重新输入！');
  }

  if (formInline.value.password1 === '') {
    return message.error('密码不能为空!');
  } else if (formInline.value.password1.length < 6) {
    return message.error('密码过短，长度小于 6 字符！');
  } else if (formInline.value.password1.length > 50) {
    formInline.value.password1 = '';
    formInline.value.password2 = '';
    return message.error('密码过长！');
  }

  if (formInline.value.password1 !== formInline.value.password2) {
    message.error('两次密码不一致，请重新输入！');
    formInline.value.password1 = '';
    formInline.value.password2 = '';
    return;
  } else {
    formInline.value.password = formInline.value.password1;
  }

  axios
    .post('/api/student/insert', formInline.value)
    .then(res => res.data)
    .then(data => {
      if (data.success) {
        const userJson = {
          userid: formInline.value.userid,
          password: formInline.value.password
        };
        localStorage.user = JSON.stringify(userJson);
        message.success('注册成功！');
        router.replace('/Login');
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
  <div class="view-account">
    <div class="view-account-container">
      <n-h1 style="text-align: center"> 注册账号 </n-h1>
      <div class="view-account-form">
        <n-form
          ref="formRef"
          label-placement="left"
          size="large"
          :model="formInline"
          :rules="rules"
        >
          <!-- input ID -->
          <n-form-item label="学号" class="inputtext" path="userid">
            <n-input v-model:value="formInline.userid" placeholder="请输入学号">
              <template #prefix>
                <n-icon size="18" color="#808695">
                  <AccessibilityOutline />
                </n-icon>
              </template>
            </n-input>
          </n-form-item>

          <!-- input name -->
          <n-form-item label="姓名" class="inputtext" path="username">
            <n-input
              v-model:value="formInline.username"
              placeholder="请输入用户名"
            >
              <template #prefix>
                <n-icon size="18" color="#808695">
                  <PersonOutline />
                </n-icon>
              </template>
            </n-input>
          </n-form-item>

          <!-- input class -->
          <n-form-item label="班级" class="inputtext" path="class">
            <n-input
              v-model:value="formInline.classes"
              placeholder="请输入班级"
            >
              <template #prefix>
                <n-icon size="18" color="#808695">
                  <PeopleOutline />
                </n-icon>
              </template>
            </n-input>
          </n-form-item>

          <!-- input password-->
          <n-form-item label="密码" class="inputtext" path="password1">
            <n-input
              v-model:value="formInline.password1"
              type="password"
              show-password-on="mousedown"
              placeholder="请输入密码"
              @keyup.enter="handleSubmit"
            >
              <template #prefix>
                <n-icon size="18" color="#808695">
                  <LockClosedOutline />
                </n-icon>
              </template>
            </n-input>
          </n-form-item>
          <!-- input password again-->
          <n-form-item label="密码" class="inputtext" path="password2">
            <n-input
              v-model:value="formInline.password2"
              type="password"
              show-password-on="mousedown"
              placeholder="请再次输入密码"
              @keyup.enter="handleSubmit"
            >
              <template #prefix>
                <n-icon size="18" color="#808695">
                  <LockClosedOutline />
                </n-icon>
              </template>
            </n-input>
          </n-form-item>

          <!--button-->
          <n-form-item>
            <n-button
              type="primary"
              size="large"
              :loading="loading"
              block
              @click="handleSubmit"
            >
              注册
            </n-button>
          </n-form-item>
        </n-form>
      </div>
    </div>
  </div>
  <router-view />
</template>

<style lang="less" scoped>
.inputtext {
  text-align: left;
}

.view-account {
  height: 100%;

  &-container {
    flex: 1;
    overflow: auto;
    padding: 20px;
    padding-top: 80px;
    margin: 0 auto;
    max-width: 400px;
  }

  &-top {
    padding: 32px 0;
    text-align: center;

    &-desc {
      font-size: 14px;
      color: #808695;
    }
  }

  &-other {
    width: 100%;
  }

  .default-color {
    color: #515a6e;

    .ant-checkbox-wrapper {
      color: #515a6e;
    }
  }
}

@media (min-width: 768px) {
  .view-account {
    background-image: url('../assets/images/login.svg');
    background-repeat: no-repeat;
    background-position: 50%;
    background-size: 100%;
  }

  .page-account-container {
    padding: 32px 0 24px 0;
  }
}
</style>
