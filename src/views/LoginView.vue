<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useMessage } from 'naive-ui';
import axios from 'axios';
import { PersonOutline, LockClosedOutline } from '@vicons/ionicons5';

interface FormState {
  userid: string;
  password: string;
}

const formRef = ref();
const loadingRef = ref(false);
const autoLogin = ref(true);
const router = useRouter();
const message = useMessage();

const formInline: FormState = reactive({
  userid: '',
  password: ''
});

const rules = {
  userid: { required: true, message: '请输入学工号' },
  password: { required: true, message: '请输入密码' }
};

const setCookie = (userid: string, password: string, exday: number) => {
  var exdate = new Date(); //获取时间
  exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exday); //保存的天数
  //字符串拼接cookie
  window.document.cookie =
    'userID' + '=' + userid + ';path=/;expires=' + exdate.toUTCString();
  window.document.cookie =
    'userPwd' + '=' + password + ';path=/;expires=' + exdate.toUTCString();
};
//读取cookie
const getCookie = () => {
  if (document.cookie.length > 0) {
    // console.log("获取cookie document.cookie", document.cookie);
    var arr = document.cookie.split('; ');
    for (var i = 0; i < arr.length; i++) {
      var arr2 = arr[i].split('='); //再次切割
      // console.log("arr2", arr2);
      //判断查找相对应的值
      if (arr2[0] === 'userID') {
        formInline.userid = arr2[1];
      } else if (arr2[0] === 'userPwd') {
        formInline.password = arr2[1];
      }
    }
  }
};
const clearCookie = () => {
  setCookie('', '', 7);
};

onMounted(() => {
  getCookie();
});

const logon = () => {
  router.push('/Register');
};

const handleSubmit = () => {
  if (autoLogin.value) {
    setCookie(formInline.userid, formInline.password, 7);
  } else {
    clearCookie();
  }

  if (formInline.userid == '') {
    return message.error('请填写您的 ID');
  }

  if (formInline.password === '') {
    return message.error('请填写密码！');
  }

  loadingRef.value = true;
  axios
    .post('/api/user/login', {
      ...formInline
    })
    .then(res => {
      loadingRef.value = false;
      return res.data;
    })
    .then(data => {
      if (data.success) {
        localStorage.account = JSON.stringify({
          userid: formInline.userid,
          password: formInline.password
        });
        message.success(`欢迎回来！${formInline.userid}`);
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
