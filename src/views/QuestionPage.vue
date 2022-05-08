<script lang="ts" setup>
import { useMessage } from 'naive-ui';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const message = useMessage();
const question = JSON.parse(sessionStorage.question);

onMounted(() => {
  console.log(router.currentRoute.value.params.QuestionId);
  console.log(question.id);
  if (question.id != router.currentRoute.value.params.QuestionId) {
    // !== 出问题
    message.error('题目信息错误');
    router.back();
  }
});
</script>

<template>
  <n-h1>#{{ question.id }}</n-h1>
</template>
