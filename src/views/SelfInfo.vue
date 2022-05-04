<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  PersonOutline,
  LockClosedOutline,
  AccessibilityOutline,
  Pencil,
  ArrowBack
} from '@vicons/ionicons5';
import axios from 'axios';
import { useMessage } from 'naive-ui';

const formRef = ref();
const router = useRouter();
const message = useMessage();
let oldpassword = '';

const formInline = ref({
  userid: '',
  username: '',
  password: '',
  newpassword: '',
  newpassword_again: ''
});

onMounted(() => {
  let account = JSON.parse(sessionStorage.account);
  formInline.value.username = account.username;
  formInline.value.userid = account.userid;
  oldpassword = account.password;
});

const handleSubmit = () => {
  if (formInline.value.username === '') {
    return message.error('姓名不能为空!');
  } else if (formInline.value.username.length > 30) {
    formInline.value.username = '';
    return message.error('姓名过长，请重新输入！');
  }

  if (formInline.value.password !== '') {
    if (formInline.value.password !== oldpassword) {
      return message.error('密码错误!');
    } else {
      if (formInline.value.newpassword.length < 6) {
        return message.error('密码过短，长度小于 6 字符！');
      } else if (formInline.value.newpassword.length > 50) {
        formInline.value.newpassword = '';
        formInline.value.newpassword_again = '';
        return message.error('密码过长！');
      } else if (
        formInline.value.newpassword !== formInline.value.newpassword_again
      ) {
        return message.error('两次密码不一致！');
      }
    }
  }

  axios
    .post(`/api/user/update/info`, {
      userid: formInline.value.userid,
      username: formInline.value.username,
      password: formInline.value.newpassword
    })
    .then(res => res.data)
    .then(data => {
      if (data.success) {
        const userJson = {
          userid: data.userid,
          password: data.password,
          username: data.username,
          admin: data.admin
        };
        sessionStorage.account = JSON.stringify(userJson);
        message.success('信息更新成功！');
        location.reload();
      } else {
        message.error(data.message);
      }
    })
    .catch(error => {
      console.error(error);
      message.error('错误！');
    });
};

const goback = () => {
  router.back();
};
</script>

<template>
  <n-layout>
    <div class="view-info">
      <div class="view-info-container">
        <n-h1> 个人信息 </n-h1>
        <n-form
          ref="formRef"
          label-placement="left"
          size="large"
          :model="formInline"
        >
          <!-- input ID -->
          <n-form-item label="工号" class="inputtext" path="userid">
            <n-input v-model:value="formInline.userid" readonly="true">
              <template #prefix>
                <n-icon size="18" color="#808695">
                  <AccessibilityOutline />
                </n-icon>
              </template>
            </n-input>
          </n-form-item>

          <!-- input name -->
          <n-form-item label="姓名" class="inputtext" path="username">
            <n-input v-model:value="formInline.username">
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
              placeholder="请输入原密码（留空则不修改）"
            >
              <template #prefix>
                <n-icon size="18" color="#808695">
                  <LockClosedOutline />
                </n-icon>
              </template>
            </n-input>
          </n-form-item>

          <n-form
            ref="formRef"
            label-placement="left"
            size="large"
            :model="formInline"
            inline
          >
            <n-form-item class="inputtext" path="newpassword">
              <n-input
                v-model:value="formInline.newpassword"
                type="password"
                show-password-on="mousedown"
                placeholder="新密码"
                size="large"
                style="width: 400px"
              >
                <template #prefix>
                  <n-icon size="18" color="#808695">
                    <LockClosedOutline />
                  </n-icon>
                </template>
              </n-input>
            </n-form-item>
            <n-form-item class="inputtext" path="newpassword_again">
              <n-input
                v-model:value="formInline.newpassword_again"
                type="password"
                show-password-on="mousedown"
                placeholder="确认密码"
                size="large"
                style="width: 400px"
              >
                <template #prefix>
                  <n-icon size="18" color="#808695">
                    <LockClosedOutline />
                  </n-icon>
                </template>
              </n-input>
            </n-form-item>
          </n-form>
        </n-form>
        <n-space justify="center">
          <n-button
            secondary
            strong
            type="primary"
            size="large"
            @click="handleSubmit"
          >
            <template #icon>
              <n-icon size="18">
                <Pencil />
              </n-icon>
            </template>
            修改
          </n-button>
          <n-button
            secondary
            strong
            type="primary"
            size="large"
            @click="goback"
          >
            <template #icon>
              <n-icon size="18">
                <ArrowBack />
              </n-icon>
            </template>
            返回
          </n-button>
        </n-space>
      </div>
    </div>
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
