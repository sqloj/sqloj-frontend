<script lang="ts" setup>
import { ref, onBeforeMount } from 'vue';
import axios from 'axios';

const props = defineProps<{
  api: string;
  pagination?: number;
}>();

class Listform {
  title: string;
  key: string;
  constructor(t: string, k: string) {
    this.title = t;
    this.key = k;
  }
}

const dataRef = ref([]);
let dataArr: Array<Listform> = [];
const isready = ref(false);

onBeforeMount(() => {
  console.log(dataArr);
  axios
    .post(props.api)
    .then(res => {
      console.log(res.data.user);
      return res.data;
    })
    .then(data => {
      console.log(...data.user);
      var usermsg = data.user;
      dataRef.value = data.user;
      for (var i = 0; i < usermsg.length && i < 1; i++) {
        for (let j in usermsg[i]) {
          let value = new Listform(j, j);
          console.log(value);
          dataArr.push(value);
        }
      }
      console.log(dataArr);
      isready.value = true;
    });
});
</script>

<template>
  <div
    v-if="isready"
    style="text-align: center; padding-left: 5%; padding-right: 5%"
  >
    <n-h1>Child Page</n-h1>
    <n-layout id="manage-container">
      <n-space vertical :size="12">
        <n-data-table
          :bordered="false"
          :columns="dataArr"
          :data="dataRef"
          :pagination="10"
          :row-key="(row: any) => row.id"
          :loading="false"
        />
      </n-space>
    </n-layout>
  </div>
</template>

<style scoped>
#manage-container {
  padding: 20px;
}
</style>
