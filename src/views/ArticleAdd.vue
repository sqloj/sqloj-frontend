<script lang="ts" setup>
import { ref } from 'vue';
import { Pencil } from '@vicons/ionicons5';
import MarkdownIt from 'markdown-it';
import axios from 'axios';
import { useMessage } from 'naive-ui';
import { useRouter } from 'vue-router';

let md = new MarkdownIt();
const message = useMessage();
const router = useRouter();
const rules = {
  title: { required: true, trigger: ['blur'], message: '请起一个标题吧' }
};
const userid = JSON.parse(localStorage.account).id;
const formValue = ref({
  id: '',
  title: '',
  content: ''
});

const handleAdd = () => {
  axios
    .post(`api/v1/article/insert`, {
      ...formValue.value,
      userID: userid
    })
    .then(res => res.data)
    .then(data => {
      if (data.code === 0) {
        message.success('提交成功');
        router.push({
          name: 'article-page',
          params: {
            ArticleId: data.data.id
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
        <n-button
          secondary
          strong
          type="primary"
          size="large"
          @click="handleAdd"
        >
          <template #icon>
            <n-icon size="18">
              <Pencil />
            </n-icon>
          </template>
          提交
        </n-button>
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
