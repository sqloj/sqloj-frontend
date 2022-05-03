<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  PersonOutline,
  LockClosedOutline,
  AccessibilityOutline
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
  password: ''
});

// const rules = {
//   userid: { required: true, message: '请输入学号' },
//   username: { required: true, message: '请输入用户名' },
//   password: { required: true, message: '请输入密码' }
// };

onMounted(() => {
  let account = JSON.parse(sessionStorage.account);
  formInline.value.username = account.username;
  formInline.value.userid = account.user.userid;
});

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
<n-layout>
  <div class="view-info">
    <div class="view-info-container">
      <n-h1> 个人信息 </n-h1>
      <div class="view-info-form">
        <n-form
          ref="formRef"
          label-placement="left"
          size="large"
          :model="formInline"
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

          <!-- input password-->
          <n-form-item label="密码" class="inputtext" path="password">
            <n-input
              v-model:value="formInline.password"
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


          <!--button-->
          <n-form-item>
            <n-button
              type="primary"
              size="large"
              :loading="loading"
              block
              @click="handleSubmit"
            >
              更新基本信息
            </n-button>
          </n-form-item>
        </n-form>
      </div>
    </div>
  </div>
  <router-view />
</n-layout>
</template>

<style lang="less" scoped>
.inputtext {
  text-align: left;
}

.view-info {
  height: 100%;
  

  &-container {
    flex: 1;
    overflow: auto;
    padding: 20px;
    padding-top: 80px;
    margin: 0 auto;
    max-width: 800px;
  }

}
</style>
