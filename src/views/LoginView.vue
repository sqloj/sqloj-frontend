<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useMessage } from 'naive-ui';
import axios from 'axios';
import { PersonOutline, LockClosedOutline } from '@vicons/ionicons5';

const formRef = ref();
const loadingRef = ref(false);
const autoLogin = ref(true);
const router = useRouter();
const message = useMessage();

const formInline = ref({
  userid: '',
  password: ''
});

const rules = {
  userid: { required: true, message: '请输入学工号' },
  password: { required: true, message: '请输入密码' }
};

onMounted(() => {
  if (localStorage.hasOwnProperty('user')) {
    const userJson = localStorage.getItem('user') || '{}';
    formInline.value = JSON.parse(userJson);
  }
});

const logon = () => {
  router.push('/Register');
};

const handleSubmit = () => {
  if (autoLogin.value) {
    localStorage.user = JSON.stringify(formInline.value);
  } else {
    localStorage.removeItem('user');
  }

  if (formInline.value.userid === '') {
    return message.error('请填写您的 ID!');
  }

  if (formInline.value.password === '') {
    return message.error('请填写密码！');
  }

  loadingRef.value = true;
  axios
    .post('/api/user/login', formInline.value)

    .then(res => {
      loadingRef.value = false;
      return res.data;
    })
    .then(data => {
      if (data.success) {
        sessionStorage.account = JSON.stringify({
          ...formInline.value,
          username: data.username,
          admin: data.admin
        });
        message.success(`欢迎回来！${data.username}`);
        router.replace('/Main');
      } else {
        message.error('用户名或密码错误！');
      }
    })
    .catch(error => {
      console.error(error);
      message.error('ERROR!');
    });
};
</script>

<template>
  <div class="view-account">
    <div class="view-account-container" style="text-align: center">
      <n-h1>DML 语句评判系统</n-h1>
      <!-- FORM 表单-->
      <div class="view-account-form">
        <n-form
          ref="formRef"
          label-placement="left"
          size="large"
          :model="formInline"
          :rules="rules"
        >
          <n-form-item class="inputtext" path="userid">
            <n-input v-model:value="formInline.userid" placeholder="ID">
              <template #prefix>
                <n-icon :component="PersonOutline" />
              </template>
            </n-input>
          </n-form-item>

          <n-form-item class="inputtext" path="password">
            <n-input
              v-model:value="formInline.password"
              class="input-text"
              type="password"
              show-password-on="mousedown"
              placeholder="密码"
              @keyup.enter="handleSubmit"
            >
              <template #prefix>
                <n-icon :component="LockClosedOutline" />
              </template>
            </n-input>
          </n-form-item>
          <n-form-item class="default-color">
            <div class="flex justify-between">
              <div class="flex-initial">
                <n-checkbox v-model:checked="autoLogin"> 自动登录 </n-checkbox>
              </div>
            </div>
          </n-form-item>
          <n-form-item>
            <n-button
              type="primary"
              size="large"
              :loading="loadingRef"
              block
              @click="handleSubmit"
            >
              登录
            </n-button>
          </n-form-item>
          <div class="flex-initial">
            新用户？
            <n-a
              href="javascript:"
              style="text-decoration: none"
              @click="logon"
            >
              注册！
            </n-a>
          </div>
        </n-form>
      </div>
    </div>
  </div>
  <router-view />
</template>

<style lang="less" scoped>
.inputtext {
  text-align: left;
  input {
    padding-left: 2em;
  }
}

.view-account {
  // height: 100vh;
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
    padding: 1em 0;
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
