<script lang="ts" setup>
import { ref, onBeforeMount, onMounted, watch } from 'vue';

class Listform {
  title: string;
  key: string;
  constructor(t: string, k: string) {
    this.title = t;
    this.key = k;
  }
}

// const dataRef = ref([]);
let dataArr: Array<Array<Listform>> = new Array<Array<Listform>>();
let set: Array<number> = new Array<number>();
let count = 0;
const isready = ref(false);

const props = defineProps<{
  dataRef: {}[][];
}>();

watch(
  () => props.dataRef,
  () => {
    listRender();
  }
);

const listRender = () => {
  dataArr.length = 0;
  set.length = 0;
  count = 0;

  if (props.dataRef.length === 0) {
    dataArr.push(new Array<Listform>());
    set.push(count);
  }
  for (let i of props.dataRef) {
    let array: Array<Listform> = new Array<Listform>();
    if (i.length > 0) {
      for (let col in i[0]) {
        let value = new Listform(col, col);
        array.push(value);
      }
    }
    dataArr.push(array);
    set.push(count);
    count++;
  }
  isready.value = true;
};

onMounted(() => {
  listRender();
});
</script>

<template>
  <div :v-if="isready">
    <div v-for="idx in set" id="manage-container" :key="idx">
      <n-data-table
        :bordered="false"
        :columns="dataArr[idx]"
        :data="dataRef[idx]"
        :pagination="{ pagesize: 10 }"
        :row-key="(row: any) => row.key"
        :loading="false"
      />
    </div>
  </div>
</template>

<style scoped>
#manage-container {
  padding-top: 15px;
}
</style>
