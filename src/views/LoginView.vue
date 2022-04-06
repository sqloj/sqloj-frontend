<template>
  <div class="view-account">
    <h2> 欢迎使用 DML语句在线评判系统 </h2>
    <div class="view-account-container">
      <div class="view-account-top">
                <!-- 图片标签 -->
<!--                <div class="view-account-top-logo">-->
<!--                  <img src="~@/assets/images/account-logo.png" alt="" />-->
<!--                </div>-->
      </div>
        <!-- FORM 表单-->
        <div class="view-account-form">
          <n-form
                ref="formRef"
                label-placement="left"
                size="large"
                :model="formInline"
                :rules="rules"
            >
           <n-form-item class = "inputtext" path="username">
             <n-input v-model:value="formInline.username" placeholder="请输入用户名">
               <template #prefix>
                 <n-icon size="18" color="#808695">
                   <PersonOutline />
                  </n-icon>
               </template>
             </n-input>
            </n-form-item>
          <n-form-item class = "inputtext" path="password">
            <n-input
              v-model:value="formInline.password"
              type="password"
              showPasswordOn="click"
              placeholder="请输入密码"
            >
              <template #prefix>
                <n-icon size="18" color="#808695">
                  <LockClosedOutline />
                </n-icon>
              </template>
            </n-input>
          </n-form-item>
          <n-form-item class="default-color">
            <div class="flex justify-between">
              <div class="flex-initial">
                <n-checkbox v-model:checked="autoLogin">自动登录</n-checkbox>
              </div>
            </div>
          </n-form-item>
          <n-form-item>
            <n-button type="primary" @click="handleSubmit" size="large" :loading="loading" block>
              登录
            </n-button>
          </n-form-item>
          <div class="flex-initial" style="margin-left: auto">
            <a href="javascript:" style="float: right;">注册账号</a>
          </div>
          </n-form>
        </div>
      </div>
  </div>
<router-view/>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import {useRouter} from 'vue-router'
import { PersonOutline, LockClosedOutline} from '@vicons/ionicons5';
import axios from 'axios'

interface FormState {
  username: string;
  password: string;
}

const formRef = ref();
const loading = ref(false);
const autoLogin = ref(true);
const router = useRouter();

const formInline = reactive({
  username: 'admin',
  password: '123456',
  isCaptcha: true,
});

const rules = {
  username: { required: true, message: '请输入用户名', trigger: 'blur' },
  password: { required: true, message: '请输入密码', trigger: 'blur' },
};

const handleSubmit = () => {
  // alert("登入成功！")
  // router.replace('/Main')


    axios.post(`/api/login`,
    {
        formInline
    }
    ).then(res => {
      // console.log(res)
      console.log(res.data)
      console.log(res.data.data)
        if (res.data.data.success) {
            var ret = res.data.data.message;
            alert(ret)
            localStorage["account"] = JSON.stringify(res.data.data);
            router.replace('/Main')
            // if (ret.teacher) {
            //     window.location.href = "html/TeacherMain.html";
            // } else {
            //     window.location.href = "html/StudentMain.html";
            // }
        } else {
            alert("ERROR");
        }
    }).catch(res => {
        console.log("error");
    })
    };
</script>


<style lang="less" scoped>
  .inputtext {
    text-align:left;
  }
  .view-account {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: auto;

    &-container {
      flex: 1;
      padding: 32px 0;
      width: 384px;
      margin: 0 auto;
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