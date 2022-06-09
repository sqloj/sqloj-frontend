<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  PersonOutline,
  LockClosedOutline,
  AccessibilityOutline,
  Pencil,
  PeopleOutline,
  ArrowBack,
  StarOutline
} from '@vicons/ionicons5';
import axios from 'axios';
import { useMessage } from 'naive-ui';
import { USER } from '../setting/const';

const formRef = ref();
const router = useRouter();
const message = useMessage();
let oldPassword = '';

const formInline = ref({
  id: '',
  username: '',
  signature: '',
  department: '',
  password: '',
  newpassword: '',
  newpassword_again: '',
  role: USER.STUDENT
});

/*
  加载区分老师和学生，{role, username, id, department , passwoed}
*/
onMounted(() => {
  axios
    .post(`api/v1/user/filter`, null, {
      params: {
        id: JSON.parse(localStorage.account).id
      }
    })
    .then(res => res.data)
    .then(data => {
      if (data.code === 0) {
        formInline.value = data.data[0];
        oldPassword = JSON.parse(localStorage.account).password;
      } else {
        message.error('请求失败');
        message.error(data.message);
      }
    })
    .catch(error => {
      message.error(error);
      console.log(error);
    });
});

/*
  修改个人信息
*/

const handleSubmit = () => {
  if (formInline.value.username === '') {
    return message.error('姓名不能为空!');
  } else if (formInline.value.username.length > 30) {
    formInline.value.username = '';
    return message.error('姓名过长，请重新输入！');
  }

  if (
    formInline.value.role === USER.STUDENT &&
    formInline.value.department === ''
  ) {
    return message.error('请填写您的班级!');
  } else if (formInline.value.department.length > 30) {
    formInline.value.department = '';
    return message.error('班级名过长，请重新输入！');
  }
  if (formInline.value.password !== undefined) {
    if (formInline.value.password !== oldPassword) {
      return message.error('密码错误!');
    } else if (
      formInline.value.newpassword !== formInline.value.newpassword_again
    ) {
      return message.error('两次密码不一致！');
    }
    axios
      .post(
        `/api/v1/user/update`,
        {
          id: formInline.value.id,
          username: formInline.value.username,
          password: formInline.value.newpassword,
          department: formInline.value.department,
          signature: formInline.value.signature,
          role: formInline.value.role
        },
        {
          params: {
            oldPassword: oldPassword
          }
        }
      )
      .then(res => res.data)
      .then(data => {
        if (data.code === 0) {
          localStorage.account = JSON.stringify({
            id: formInline.value.id,
            username: formInline.value.username,
            password: oldPassword,
            department: formInline.value.department,
            signature: formInline.value.signature,
            role: formInline.value.role
          });
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
  } else {
    axios
      .post(
        `/api/v1/user/update`,
        {
          id: formInline.value.id,
          username: formInline.value.username,
          password: oldPassword,
          department: formInline.value.department,
          signature: formInline.value.signature,
          role: formInline.value.role
        },
        {
          params: {
            oldPassword: oldPassword
          }
        }
      )
      .then(res => res.data)
      .then(data => {
        if (data.code === 0) {
          localStorage.account = JSON.stringify({
            id: formInline.value.id,
            username: formInline.value.username,
            password: oldPassword,
            department: formInline.value.department,
            signature: formInline.value.signature,
            role: formInline.value.role
          });
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
  }
};

const goback = () => {
  router.back();
};
</script>

<template>
  <n-layout>
    <div class="view-info">
      <div class="view-info-container">
        <n-h1 style="margin-bottom: 3rem"> 个人资料 </n-h1>
        <n-form ref="formRef" size="large" :model="formInline">
          <!-- input ID 老师和学生分开显示-->
          <div v-if="formInline.role === USER.STUDENT">
            <n-form-item label="学号" class="inputtext" path="id">
              <n-input v-model:value="formInline.id" readonly="true">
                <template #prefix>
                  <n-icon size="18" color="#808695">
                    <AccessibilityOutline />
                  </n-icon>
                </template>
              </n-input>
            </n-form-item>
          </div>
          <div v-else>
            <n-form-item
              v-if="formInline.role"
              label="工号"
              class="inputtext"
              path="id"
            >
              <n-input v-model:value="formInline.id" readonly="true">
                <template #prefix>
                  <n-icon size="18" color="#808695">
                    <AccessibilityOutline />
                  </n-icon>
                </template>
              </n-input>
            </n-form-item>
          </div>
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

          <!-- input department -->
          <div v-if="formInline.role === USER.STUDENT">
            <n-form-item label="班级" class="inputtext" path="department">
              <n-input v-model:value="formInline.department">
                <template #prefix>
                  <n-icon size="18" color="#808695">
                    <PeopleOutline />
                  </n-icon>
                </template>
              </n-input>
            </n-form-item>
          </div>
          <div v-else>
            <n-form-item label="部门" class="inputtext" path="department">
              <n-input v-model:value="formInline.department">
                <template #prefix>
                  <n-icon size="18" color="#808695">
                    <PeopleOutline />
                  </n-icon>
                </template>
              </n-input>
            </n-form-item>
          </div>
          <n-form-item label="个性签名" class="inputtext" path="signature">
            <n-input v-model:value="formInline.signature" placeholder="">
              <template #prefix>
                <n-icon size="18" color="#808695">
                  <StarOutline />
                </n-icon>
              </template>
            </n-input>
          </n-form-item>
          <!-- input password 旧密码正确后才生效-->
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

        <!--button goback and update-->
        <n-space justify="space-between">
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
        </n-space>
      </div>
    </div>
  </n-layout>
</template>

<style lang="less" scoped>
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
