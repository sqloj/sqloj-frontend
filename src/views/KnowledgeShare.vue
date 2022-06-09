<script lang="ts" setup>
import { h, onMounted, ref } from 'vue';
import { NA, useMessage } from 'naive-ui';
import { useRouter } from 'vue-router';
import { CreateOutline } from '@vicons/ionicons5';
import axios from 'axios';

const columns = [
  {
    title: '编号',
    key: 'id'
  },
  {
    title: '标题',
    key: 'title',
    ellipsis: true,
    render(row: any) {
      return h(
        NA,
        {
          onClick() {
            router.push({
              name: 'article-page',
              params: {
                ArticleId: row.id
              }
            });
          },
          style: "color: #6699ff"
        },
        {
          default: () => row.title
        }
      );
    }
  },
  {
    title: '作者',
    key: 'username',
    render(row: any) {
      return h(
        NA,
        {
          onClick() {
            router.push({
              name: 'self-page',
              params: {
                UserId: row.userID
              }
            });
          },
          style: "color: black"
        },
        {
          default: () => row.username
        }
      );
    }
  },
  {
    title: '时间',
    key: 'updateTime'
  }
];

const dataRef = ref([]);
const loadingRef = ref(true);
const message = useMessage();
const router = useRouter();

const query = () => {
  axios
    .post(`api/v1/article/filter`, {})
    .then(res => res.data)
    .then(data => {
      if (data.code === 0) {
        dataRef.value = data.data;
        loadingRef.value = false;
      } else {
        message.error(data.message);
      }
    })
    .catch(error => {
      loadingRef.value = false;
      message.error(error);
      console.log(error);
    });
};
onMounted(query);

const addArticle = () => {
  router.push('article-add');
};
</script>

<template>
  <n-layout id="manage-container">
    <n-space vertical>
      <n-h1>分享</n-h1>
      <!-- form -->
      <n-space>
        <n-form ref="formRef" label-placement="left" inline>
          <n-form-item>
            <n-button type="primary" size="medium" @click="addArticle">
              <template #icon>
                <n-icon size="18">
                  <CreateOutline />
                </n-icon>
              </template>
              发帖
            </n-button>
          </n-form-item>
        </n-form>
      </n-space>
      <n-data-table
        :bordered="false"
        :columns="columns"
        :data="dataRef"
        :pagination="{ pageSize: 20 }"
        :row-key="(row: any) => row.id"
        :loading="loadingRef"
      />
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
  overflow: hidden;
}

.space {
  margin-left: 20px;
  margin-right: 20px;
}
</style>
