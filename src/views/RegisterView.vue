

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { PersonOutline, LockClosedOutline } from '@vicons/ionicons5';
import axios from 'axios';
import { useMessage } from 'naive-ui';

const chooses = [
  {
    key: '学生',
    value: 'student',
  }, {
    key: '老师',
    value: 'teacher',
  },
];

interface FormState {
  username: string;
  password1: string;
  password2: string;
  ID: string;
}

const formRef = ref();
const loading = ref(false);
const router = useRouter();
const isStudent = reactive({
  value: '',
});

const formInline:FormState = reactive({
  username: '',
  password1: '',
  password2: '',
  ID: '',
});

const rules = {
  username: { required: true, message: '请输入用户名' },
  password1: { required: true, message: '请输入密码' },
  password2: { required: true, message: '请再次输入密码' },
  ID: { required: true, message: '请输入ID' },
};

const message = useMessage();

const handleSubmit = () => {
  console.error(isStudent);
  if (formInline.password1 !== formInline.password2) {
    message.error('两次密码不一致，请重新输入！');
    formInline.password1 = '';
    formInline.password2 = '';
  } else {
    axios.post(
      '/api/logon',
      {
        ...formInline,
      },
    )
      .then(
        (res) => res.data,
      )
      .then((data) => {
        if (data.success) {
          localStorage.account = JSON.stringify(
            {
              username: formInline.username,
              password: formInline.password1,
            },
          );
          message.success('注册成功！');
          router.replace('/Main');
        }
      }).catch((error) => {
        console.error(error);
        message.error('错误！');
      });
  }
};
</script>

<template>
  <div class="view-account">
    <div class="view-account-container">
      <n-h1 style="text-align: center; ">
        注册账号
      </n-h1>
      <div class="view-account-form">
        <n-form
          ref="formRef"
          label-placement="left"
          size="large"
          :model="formInline"
          :rules="rules"
        >
          <!-- input name -->
          <n-form-item
            label="姓名"
            class="inputtext"
            path="username"
          >
            <n-input
              v-model:value="formInline.username"
              placeholder="请输入用户名"
            >
              <template #prefix>
                <n-icon
                  size="18"
                  color="#808695"
                >
                  <PersonOutline />
                </n-icon>
              </template>
            </n-input>
          </n-form-item>

          <!-- input password-->
          <n-form-item
            label="密码"
            class="inputtext"
            path="password1"
          >
            <n-input
              v-model:value="formInline.password1"
              type="password"
              show-password-on="click"
              placeholder="请输入密码"
            >
              <template #prefix>
                <n-icon
                  size="18"
                  color="#808695"
                >
                  <LockClosedOutline />
                </n-icon>
              </template>
            </n-input>
          </n-form-item>
          <!-- input password again-->
          <n-form-item
            label="密码"
            class="inputtext"
            path="password2"
          >
            <n-input
              v-model:value="formInline.password2"
              type="password"
              show-password-on="click"
              placeholder="请再次输入密码"
            >
              <template #prefix>
                <n-icon
                  size="18"
                  color="#808695"
                >
                  <LockClosedOutline />
                </n-icon>
              </template>
            </n-input>
          </n-form-item>
          <!--ID-->
          <div v-if="isStudent.value === 'student'">
            <n-form-item
              label="学号"
              class="inputtext"
              path="ID"
            >
              <n-input
                v-model:value="formInline.ID"
                placeholder="请输入ID"
              />
            </n-form-item>
          </div>
          <div v-if="isStudent.value === 'teacher'">
            <n-form-item
              label="工号"
              class="inputtext"
              path="ID"
            >
              <n-input
                v-model:value="formInline.ID"
                placeholder="请输入ID"
              />
            </n-form-item>
          </div>

          <!-- choose student or teacher -->
          <n-radio-group
            v-model:value="isStudent.value"
            name="radiogroup"
          >
            <n-space>
              <n-radio
                v-for="choose in chooses"
                :key="choose.key"
                :value="choose.value"
              >
                {{ choose.key }}
              </n-radio>
            </n-space>
          </n-radio-group>
          <br>
          <br>
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
    text-align:left;
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
