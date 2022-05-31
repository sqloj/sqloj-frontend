<script lang="ts" setup>
import { ref, h, VNode } from 'vue';
import { NTooltip, SelectOption } from 'naive-ui';

// 可供选择的类型

const option = {
  renderOption: ({ node, option }: { node: VNode; option: SelectOption }) =>
    h(NTooltip, null, {
      trigger: () => node,
      default: () => option.tip
    }),
  options: ref([
    {
      label: '自增',
      value: 'auto increment',
      tip: '起始数字 + 1'
    },
    {
      label: '中文名字',
      value: 'cname',
      tip: '生成简单的中文名'
    },
    {
      label: '整数',
      value: 'integer',
      tip: '生成 min ~ max 之间的数'
    },
    {
      label: '布尔值',
      value: 'boolean',
      tip: '概率计算公式为 min / (min + max)'
    },
    {
      label: '浮点数',
      value: 'float',
      tip: 'min(整数最小) ~ max ; dmin(小数最小位数) ~ dmax'
    },
    {
      label: '日期',
      value: 'date',
      tip: '生成一个日期，格式可以自定义'
    }
  ])
};

// 选择下拉框的滚动
const handleScroll = (e: Event) => {
  const currentTarget = e.currentTarget as HTMLElement;
  if (
    currentTarget.scrollTop + currentTarget.offsetHeight >=
    currentTarget.scrollHeight
  ) {
    option.options.value.push(
      {
        label: `v1-${option.options.value.length}`,
        value: `v1-${option.options.value.length}`,
        tip: `v1-${option.options.value.length}`
      },
      {
        label: `v2-${option.options.value.length}`,
        value: `v2-${option.options.value.length}`,
        tip: `v2-${option.options.value.length}`
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
      initnum: 1,
      min: null,
      max: null,
      dmin: 0,
      dmax: 17,
      data: 'yyy-MM-dd'
    }
  }
]);

// 按 + 后的回调
const onCreate = () => {
  return {
    choose: '',
    colname: '',
    message: {
      initnum: 1,
      min: 0,
      max: 100,
      dmin: 0,
      dmax: 17,
      data: 'yyy-MM-dd'
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
            :options="option.options.value"
            :render-option="option.renderOption"
            style="width: 100px"
            :reset-menu-on-options-change="false"
            @scroll="handleScroll"
          />

          <div v-if="value.choose === 'auto increment'">
            <n-input
              v-model:value="value.message.initNum"
              type="text"
              placeholder="起始数"
            />
          </div>
          <div v-else-if="value.choose === 'cname'">
            <n-input
              type="text"
              :disabled="true"
              placeholder="会自动生成简单的中文名字"
            />
          </div>
          <div v-else-if="value.choose === 'integer'">
            <n-space>
              <n-input-number
                v-model:value="value.message.min"
                placeholder="最小值"
              />
              <n-input-number
                v-model:value="value.message.max"
                placeholder="最大值"
              />
            </n-space>
          </div>
          <div v-else-if="value.choose === 'boolean'">
            <n-space>
              <n-input v-model:value="value.message.min" placeholder="最小值" />
              <n-input v-model:value="value.message.max" placeholder="最大值" />
            </n-space>
          </div>
          <div v-else-if="value.choose === 'float'">
            <n-space>
              <n-input v-model:value="value.message.min" placeholder="最小值" />
              <n-input v-model:value="value.message.max" placeholder="最大值" />
              <n-input
                v-model:value="value.message.dmin"
                placeholder="最小位数"
              />
              <n-input
                v-model:value="value.message.dmax"
                placeholder="最大位数"
              />
            </n-space>
          </div>
          <div v-else-if="value.choose === 'date'">
            <n-input
              type="text"
              :disabled="true"
              placeholder="生成 yyyy-mm-dd 日期"
            />
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
