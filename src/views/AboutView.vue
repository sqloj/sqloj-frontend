<template>
  <div class="about">
    <h1>{{msg}}</h1>
  </div>
  <n-button type="info" @click="goHome">回到首页</n-button>
</template>

<script lang = "ts" setup>
import { useRouter } from "vue-router"


let msg = "ABOUT PAGE"
const router = useRouter();
function goHome() {
  alert("OK!");
  router.push('/');
}
</script>