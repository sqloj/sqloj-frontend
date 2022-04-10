<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useMessage } from 'naive-ui';
import axios from 'axios';
import { PersonOutline, LockClosedOutline } from '@vicons/ionicons5';

interface FormState {
  username: string;
  password: string;
}

const formRef = ref();
const loadingRef = ref(false);
const autoLogin = ref(true);
const router = useRouter();
const message = useMessage();

const formInline: FormState = reactive({
  username: 'admin',
  password: '123456',
  isCaptcha: true,
});

const rules = {
  username: { required: true, message: '请输入用户名', trigger: 'blur' },
  password: { required: true, message: '请输入密码', trigger: 'blur' },
};

const logon = () => {
  router.push('/Register');
};

const handleSubmit = () => {
  // alert("登入成功！")
  // router.replace('/Main')
  loadingRef.value = true;
  axios
    .post('/api/login', {
      ...formInline,
    })
    .then((res) => {
      loadingRef.value = false;
      return res.data;
    })
    .then((data) => {
      // let msg = data.message;
      if (data.success) {
        localStorage.account = JSON.stringify({
          username: formInline.username,
          password: formInline.password,
        });
        message.success(`欢迎回来！${formInline.username}`);
        router.replace('/Main');
      } else {
        message.error('用户名或密码错误！');
      }
    })
    .catch((error) => {
      console.error(error);
      message.error('ERROR!');
    });
};
</script>

<template>
  <div class="view-account">
    <div
      class="view-account-container"
      style="text-align: center"
    >
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
          <n-form-item
            class="inputtext"
            path="username"
          >
            <n-input
              v-model:value="formInline.username"
              placeholder="用户名"
            >
              <template #prefix>
                <n-icon :component="PersonOutline" />
              </template>
            </n-input>
          </n-form-item>

          <n-form-item
            class="inputtext"
            path="password"
          >
            <n-input
              v-model:value="formInline.password"
              class="input-text"
              type="password"
              show-password-on="mousedown"
              placeholder="密码"
            >
              <template #prefix>
                <n-icon :component="LockClosedOutline" />
              </template>
            </n-input>
          </n-form-item>
          <n-form-item class="default-color">
            <div class="flex justify-between">
              <div class="flex-initial">
                <n-checkbox v-model:checked="autoLogin">
                  自动登录
                </n-checkbox>
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
    background-image: url("../assets/images/login.svg");
    background-repeat: no-repeat;
    background-position: 50%;
    background-size: 100%;
  }

  .page-account-container {
    padding: 32px 0 24px 0;
  }
}
</style>
