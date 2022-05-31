<script lang="ts" setup>
import axios from 'axios';
import { SelectOption } from 'naive-ui';
import { ref } from 'vue';

// 可供选择的类型
const optionsRef = ref([
  {
    label: '自增',
    value: 'auto increment'
  },
  {
    label: '中文名字',
    value: 'cname'
  },
  {
    label: '整数',
    value: 'integer'
  },
  {
    label: '日期',
    value: 'date'
  }
]);

// 选择下拉框的滚动
const handleScroll = (e: Event) => {
  const currentTarget = e.currentTarget as HTMLElement;
  if (
    currentTarget.scrollTop + currentTarget.offsetHeight >=
    currentTarget.scrollHeight
  ) {
    optionsRef.value.push(
      {
        label: `v1-${optionsRef.value.length}`,
        value: `v1-${optionsRef.value.length}`
      },
      {
        label: `v2-${optionsRef.value.length}`,
        value: `v2-${optionsRef.value.length}`
      }
    );
  }
};

// 主内容
const customValue = ref([
  {
    choose: '',
    colname: '',
    message: {
      min: null,
      max: null
    }
  },
  {
    choose: '',
    colname: '',
    message: {
      min: null,
      max: null
    }
  }
]);

// 按 + 后的回调
const onCreate = () => {
  return {
    choose: '',
    colname: '',
    message: {
      min: null,
      max: null
    }
  };
};
// 组件变化后的回调
const formValue = ref({
  tablename: '',
  num: 10
});

const show = () => {
  console.log(customValue.value);
};

const emit = defineEmits(['getData']);
const handleGen = () => {
  let need = [];
  for (let i of customValue.value) {
    if (i.choose !== '') {
      need.push(i);
    }
  }
  emit('getData', {
    ...formValue.value,
    need: need
  });
};
</script>

<template>
  <n-card
    style="width: 1000px"
    title="数据生成器"
    size="huge"
    role="dialog"
    aria-modal="true"
    header-style="text-align: center"
    footer-style="text-align: center"
  >
    <n-space>
      <n-form ref="formRef" label-placement="left" inline :model="formValue">
        <n-form-item label="表名" path="tablename">
          <n-input v-model:value="formValue.tablename" placeholder="" />
        </n-form-item>
        <n-form-item label="数量" path="num">
          <n-input v-model:value="formValue.num" placeholder="" />
        </n-form-item>
      </n-form>
    </n-space>

    <n-dynamic-input
      v-model:value="customValue"
      show-sort-button
      :on-create="onCreate"
    >
      <template #create-button-default> 随便搞点啥 </template>
      <template #default="{ value }">
        <n-space style="display: flex; align-items: center; width: 100%">
          <n-input
            v-model:value="value.colname"
            type="text"
            placeholder="列名"
          />
          <n-select
            v-model:value="value.choose"
            :options="optionsRef"
            style="width: 100px"
            :reset-menu-on-options-change="false"
            @scroll="handleScroll"
          />

          <div v-if="value.choose === 'cname'">
            <n-input
              type="text"
              :disabled="true"
              placeholder="会自动生成简单的中文名字"
            />
          </div>
          <div v-else-if="value.choose === 'auto increment'">
            <n-input
              type="text"
              :disabled="true"
              placeholder="从 1 开始自动增加"
            />
          </div>
          <div v-else-if="value.choose === 'date'">
            <n-input
              type="text"
              :disabled="true"
              placeholder="随机生成一个 yyyy-mm-dd 格式的日期"
            />
          </div>
          <div v-else-if="value.choose === 'integer'">
            <n-space start>
              <n-input-number
                v-model:value="value.message.min"
                placeholder="最小值"
                :min="-100000000"
                :max="100000000"
              />
              <n-input-number
                v-model:value="value.message.max"
                placeholder="最大值"
                :min="-100000000"
                :max="100000000"
              />
            </n-space>
          </div>
          <div v-else>
            <n-input type="text" placeholder="可能需要输入一些信息" />
          </div>
        </n-space>
      </template>
    </n-dynamic-input>

    <template #footer>
      <!-- 尾部 -->
      <n-space justify="center">
        <n-button type="primary" size="medium" @click="show"> 预览 </n-button>
        <n-button type="primary" size="medium" @click="handleGen">
          生成
        </n-button>
      </n-space>
    </template>
  </n-card>
</template>
