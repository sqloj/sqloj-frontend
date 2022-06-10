<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { Pencil, CloseOutline } from '@vicons/ionicons5';
import MarkdownIt from 'markdown-it';
import axios from 'axios';
import { useMessage } from 'naive-ui';
import { useRouter } from 'vue-router';

let md = new MarkdownIt();
const message = useMessage();
const router = useRouter();
const articleid = router.currentRoute.value.params.ArticleId;
const rules = {
  title: { required: true, trigger: ['blur'], message: '请起一个标题吧' }
};
const formValue = ref({
  id: '',
  title: '',
  content: ''
});

const query = () => {
  if (Number.isFinite(Number(articleid))) {
    axios
      .get(`api/v1/article/info/${Number(articleid)}`)
      .then(res => res.data)
      .then(data => {
        if (data.code === 0) {
          formValue.value = data.data;
        } else {
          message.error(data.message);
          router.replace('/main/knowledge-share');
        }
      })
      .catch(error => {
        console.error(error);
        message.error('错误！');
      });
  } else {
    message.error('错误的编号');
    router.back();
  }
};

onMounted(query);

const handleModify = () => {
  axios
    .post(`api/v1/article/update`, {
      ...formValue.value,
      userID: JSON.parse(localStorage.account).id
    })
    .then(res => res.data)
    .then(data => {
      if (data.code === 0) {
        message.success('提交成功');
        router.back();
      } else {
        message.error(data.message);
      }
    })
    .catch(error => {
      console.error(error);
      message.error('错误！');
    });
};

const handleDelete = () => {
  axios
    .post(`api/v1/article/update`, formValue.value)
    .then(res => res.data)
    .then(data => {
      if (data.code === 0) {
        formValue.value.id = data.data.id;
        message.success('提交成功');
        router.push({
          name: 'article-page',
          params: {
            ArticleId: Number(formValue.value.id)
          }
        });
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
  <div class="view-info">
    <div class="view-info-container">
      <n-card :title="formValue.title" style="margin-bottom: 16px">
        <n-tabs
          default-value="editor"
          justify-content="space-evenly"
          type="line"
        >
          <n-tab-pane name="editor" tab="编辑">
            <!-- 表单 -->
            <n-form ref="formRef" :model="formValue" :rules="rules">
              <n-form-item path="title" label="标题">
                <n-input v-model:value="formValue.title" placeholder="" />
              </n-form-item>
              <n-form-item label="内容" path="content">
                <n-input
                  v-model:value="formValue.content"
                  placeholder=""
                  type="textarea"
                  :autosize="{ minRows: 15 }"
                />
              </n-form-item>
            </n-form>
          </n-tab-pane>
          <n-tab-pane name="display" tab="预览">
            <n-scrollbar x-scrollable>
              <div
                v-dompurify-html="md.render(formValue.content)"
                v-katex
                v-highlight
              ></div>
            </n-scrollbar>
          </n-tab-pane>
        </n-tabs>
        <n-space justify="space-between">
          <n-button
            secondary
            strong
            type="primary"
            size="large"
            @click="handleModify"
          >
            <template #icon>
              <n-icon size="18">
                <Pencil />
              </n-icon>
            </template>
            提交
          </n-button>
          <n-button
            secondary
            strong
            type="error"
            size="large"
            @click="handleDelete"
          >
            <template #icon>
              <n-icon size="18">
                <CloseOutline />
              </n-icon>
            </template>
            删除
          </n-button>
        </n-space>
      </n-card>
    </div>
  </div>
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
