<template>
  <div class="about">
    <h1>{{msg}}</h1>
  </div>
  <h2 @click="l1">点此进入登录界面</h2>
</template>

<script lang = "ts">
import { useRouter } from "vue-router"
export default {
  el: '#app',
  setup(){
      let msg = "ABOUT PAGE"
      return {msg}
  },
  methods: {
    l1(){
      alert("YES")
      const router = useRouter();
      router.replace('/');
    }
  },
}
</script>