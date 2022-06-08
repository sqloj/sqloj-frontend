<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { Pencil, CalendarOutline } from '@vicons/ionicons5';
import MarkdownIt from 'markdown-it';
import axios from 'axios';
import { useMessage } from 'naive-ui';
import { useRouter } from 'vue-router';
import { USER } from '../setting/const';

let md = new MarkdownIt();
const message = useMessage();
const router = useRouter();
const articleid = router.currentRoute.value.params.ArticleId;
const role = JSON.parse(localStorage.account).role;
const userid = JSON.parse(localStorage.account).id;
const formValue = ref({
  id: '',
  username: '',
  authorId: '',
  title: '',
  content: '',
  updateTime: ''
});

const showbutton = ref(false);

const query = () => {
  if (Number.isFinite(Number(articleid))) {
    axios
      .get(`/api/v1/article/info/${Number(articleid)}`)
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
      })
      .finally(() => {
        if (role === USER.TEACHER || userid === formValue.value.authorId) {
          showbutton.value = true;
        }
      });
  } else {
    message.error('错误的编号');
    router.back();
  }
};

onMounted(query);

const handleEditor = () => {
  router.push({
    name: 'article-editor',
    params: {
      ArticleId: Number(formValue.value.id)
    }
  });
};
</script>

<template>
  <div class="view-info">
    <div class="view-info-container">
      <n-card :title="formValue.title" style="margin-bottom: 16px">
        <n-space :size="30">
          <n-h4>{{ formValue.username }}</n-h4>
          <n-h4>
            <n-icon :component="CalendarOutline" size="18" />
            {{ formValue.updateTime }}</n-h4
          >
          <n-button
            v-if="showbutton"
            secondary
            strong
            type="default"
            size="small"
            @click="handleEditor"
          >
            <template #icon>
              <n-icon size="18">
                <Pencil />
              </n-icon>
            </template>
            编辑
          </n-button>
        </n-space>
        <n-divider />
        <n-scrollbar x-scrollable>
          <div
            v-dompurify-html="md.render(formValue.content)"
            v-katex
            v-highlight
          ></div>
        </n-scrollbar>
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
