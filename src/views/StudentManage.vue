<script lang="ts" setup>
import { h, onMounted, ref } from 'vue';
import { NA, useMessage } from 'naive-ui';
import { Pencil, PersonAddOutline } from '@vicons/ionicons5';
import axios from 'axios';
import { USER } from '../setting/const';
import { TableColumns } from 'naive-ui/es/data-table/src/interface';
import { useRouter } from 'vue-router';

/*
  展示学生管理信息 {id, username, department, passNum}
*/
const router = useRouter();
const columns: TableColumns<any> = [
  {
    type: 'selection'
  },
  {
    title: '学号',
    key: 'id',
    render(row: any) {
      return h(
        NA,
        {
          onClick() {
            router.push({
              name: 'self-page',
              params: {
                userID: row.id
              }
            });
          }
        },
        {
          default: () => row.id
        }
      );
    }
  },
  {
    title: '姓名',
    key: 'username',
    render(row: any) {
      return h(
        NA,
        {
          onClick() {
            router.push({
              name: 'self-page',
              params: {
                userID: row.id
              }
            });
          },
          style: 'color: black'
        },
        {
          default: () => row.username
        }
      );
    }
  },
  {
    title: '班级',
    key: 'department'
  },
  {
    title: '过题数',
    key: 'passNum'
  }
];

const dataRef = ref([]);
const loadingRef = ref(true);
const message = useMessage();
const checkedRowKeysRef = ref([]);
const showModal = ref(false);
/*
  查询输入框
*/
const formValue = ref({
  id: '',
  username: '',
  department: ''
});

/*
  查询学生列表的api （应当只有学生）
*/
const query = () => {
  axios
    .get(`api/v1/student/list`)
    .then(res => res.data)
    .then(data => {
      if (data.code === 0) {
        dataRef.value = data.data;
      } else {
        message.error(data.message);
      }
    })
    .catch(error => {
      console.error(error);
      message.error('ERROR!');
    })
    .finally(() => {
      loadingRef.value = false;
    });
};

onMounted(query);

/*
  批量删除学生
*/
const handleDelete = () => {
  let promises = [];
  for (let id of checkedRowKeysRef.value) {
    // 依据 id 一个个发起删除请求
    promises.push(
      axios
        .post('api/v1/user/delete', null, { params: { id: id } })
        .then(res => {
          return res.data;
        })
        .then(data => {
          if (data.code === 0) {
            message.success('删除成功');
          } else {
            message.error(data.message);
          }
        })
        .catch(error => {
          console.error(error);
          message.error('ERROR!');
        })
    );
  }
  // 重新加载列表
  Promise.all(promises).finally(() => {
    query();
    checkedRowKeysRef.value.length = 0;
  });
};

const findSubmit = () => {
  loadingRef.value = true;
  axios
    .post(`api/v1/user/filter`, null, {
      params: {
        id: formValue.value.id,
        username: formValue.value.username,
        department: formValue.value.department
      }
    })
    .then(res => res.data)
    .then(data => {
      if (data.code === 0) {
        dataRef.value = data.data;
      } else {
        message.error(data.message);
      }
    })
    .catch(error => {
      loadingRef.value = false;
      message.error(error);
      console.error(error);
    })
    .finally(() => {
      loadingRef.value = false;
    });
};

// 添加学生
const formInline = ref({
  id: '',
  username: '',
  department: '',
  password: '123456'
});

const handleSubmit = () => {
  if (formInline.value.id === '') {
    return message.error('请填写学号');
  } else if (formInline.value.id.length > 20) {
    formInline.value.id = '';
    return message.error('学号过长，请重新输入');
  }

  if (formInline.value.username === '') {
    return message.error('请填写姓名');
  } else if (formInline.value.username.length > 30) {
    formInline.value.username = '';
    return message.error('姓名过长，请重新输入');
  }

  if (formInline.value.department === '') {
    return message.error('请填写班级');
  } else if (formInline.value.department.length > 30) {
    formInline.value.department = '';
    return message.error('班级名过长，请重新输入');
  }

  if (formInline.value.password === '') {
    return message.error('密码不能为空');
  }

  axios
    .post('api/v1/user/register', {
      id: formInline.value.id,
      username: formInline.value.username,
      password: formInline.value.password,
      department: formInline.value.department,
      signature: '',
      role: USER.STUDENT
    })
    .then(res => res.data)
    .then(data => {
      if (data.code === 0) {
        message.success('添加成功');
        showModal.value = false;
      } else {
        message.error(data.message);
      }
    })
    .catch(error => {
      console.error(error);
      message.error('错误');
    })
    .finally(() => {
      query();
    });
};
</script>

<template>
  <n-layout id="manage-container">
    <n-space vertical>
      <n-h1>学生管理</n-h1>
      <n-space>
        <n-form ref="formRef" label-placement="left" inline :model="formValue">
          <n-form-item label="用户ID" path="queid">
            <n-input v-model:value="formValue.id" placeholder="" />
          </n-form-item>
          <n-form-item label="姓名" path="id">
            <n-input v-model:value="formValue.username" placeholder="" />
          </n-form-item>
          <n-form-item label="班级" path="id">
            <n-input v-model:value="formValue.department" placeholder="" />
          </n-form-item>
          <n-form-item>
            <n-button type="primary" size="medium" @click="findSubmit">
              查找
            </n-button>
          </n-form-item>
        </n-form>
      </n-space>
      <n-data-table
        v-model:checked-row-keys="checkedRowKeysRef"
        :bordered="false"
        :columns="columns"
        :data="dataRef"
        :pagination="{ pageSize: 10 }"
        :row-key="(row: any) => row.id"
        :loading="loadingRef"
      />

      <!--delete and addStudents button -->
      <div>
        <n-button
          secondary
          strong
          type="primary"
          size="large"
          class="space"
          @click="handleDelete"
        >
          <template #icon>
            <n-icon size="18">
              <Pencil />
            </n-icon>
          </template>
          批量删除
        </n-button>

        <n-button
          secondary
          strong
          type="primary"
          size="large"
          class="space"
          @click="showModal = true"
        >
          <template #icon>
            <n-icon size="18">
              <PersonAddOutline />
            </n-icon>
          </template>
          添加学生
        </n-button>

        <!--弹出的卡片-->
        <n-modal v-model:show="showModal">
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
            <n-form label-placement="left" size="medium" :model="formInline">
              <!-- input ID -->
              <n-form-item label="学号" class="inputtext" path="id">
                <n-input v-model:value="formInline.id" placeholder="学号">
                </n-input>
              </n-form-item>
              <!-- input name -->
              <n-form-item label="姓名" class="inputtext" path="username">
                <n-input v-model:value="formInline.username" placeholder="姓名">
                </n-input>
              </n-form-item>
              <!-- input class -->
              <n-form-item label="班级" class="inputtext" path="department">
                <n-input
                  v-model:value="formInline.department"
                  placeholder="班级"
                >
                </n-input>
              </n-form-item>
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
        </n-modal>
      </div>
    </n-space>
  </n-layout>
</template>

<style scoped>
#manage-container {
  padding: 20px;
  padding-top: 80px;
  overflow: auto;
  text-align: center;
  padding-left: 5%;
  padding-right: 5%;
  margin-bottom: 1rem;
}

.space {
  margin-left: 20px;
  margin-right: 20px;
}
</style>
