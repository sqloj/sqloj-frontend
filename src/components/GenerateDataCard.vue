<script lang="ts" setup>
import { ref, h, VNode } from 'vue';
import { useMessage, NTooltip, SelectOption } from 'naive-ui';
import { constructor } from '../setting/constructor';
import MarkdownIt from 'markdown-it';

const message = useMessage();
let md = new MarkdownIt();
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
      tip: '起始数字 ++(...)'
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
      tip: '生成日期，格式可自定义'
    },
    {
      label: '时间',
      value: 'time',
      tip: '生成时间，格式可自定义'
    },
    {
      label: '日期时间',
      value: 'datetime',
      tip: '生成日期 + 时间，格式可自定义'
    },
    {
      label: '自选',
      value: 'pick',
      tip: '从标签(自定义)中随机挑选'
    },
    {
      label: '英文名字',
      value: 'name',
      tip: 'A simple English name will be randomly generated'
    },
    {
      label: '英文句子',
      value: 'sentence',
      tip: '随机单词凑出来的句子'
    },
    {
      label: '英文文章',
      value: 'paragraph',
      tip: '随机句子凑出来的文章'
    },
    {
      label: 'URL',
      value: 'url',
      tip: 'http://...'
    },
    {
      label: 'IP',
      value: 'ip',
      tip: '1.1.1.1'
    },
    {
      label: '邮箱',
      value: 'email',
      tip: '...@sy.edu'
    },
    {
      label: '域名',
      value: 'domain',
      tip: 'roger.dev'
    },
    {
      label: '中国大区',
      value: 'region',
      tip: '随机生成一个（中国）大区'
    },
    {
      label: '省',
      value: 'province',
      tip: '随机生成一个省（或直辖市、自治区、特别行政区）'
    },
    {
      label: '18 位身份证号',
      value: 'id',
      tip: '随机生成一个 18 位身份证号'
    }
  ])
};

const optionOfQuotation = [
  {
    label: '反引号',
    value: '`'
  },
  {
    label: '单引号',
    value: "'"
  },
  {
    label: '双引号',
    value: '"'
  },
  {
    label: '括号',
    value: '?'
  }
];

// 主内容
const customValue = ref([
  {
    choose: '',
    colname: '',
    message: {
      initnum: 1,
      min: null,
      max: null,
      dmin: null,
      dmax: null,
      date: 'yyyy-MM-dd',
      time: 'HH:mm:ss',
      model: {
        tags: []
      }
    }
  },
  {
    choose: '',
    colname: '',
    message: {
      initnum: 1,
      min: null,
      max: null,
      dmin: null,
      dmax: null,
      date: 'yyyy-MM-dd',
      time: 'HH:mm:ss',
      model: {
        tags: []
      }
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
      min: null,
      max: null,
      dmin: null,
      dmax: null,
      date: 'yyyy-MM-dd',
      time: 'HH:mm:ss',
      model: {
        tags: []
      }
    }
  };
};
// 组件变化后的回调
const formValue = ref({
  tablename: '',
  num: null,
  quotation: '`'
});

const showModel = ref('');
const show = () => {
  let need = [];
  for (let i of customValue.value) {
    if (i.choose !== '') {
      need.push(i);
    }
  }
  let res = constructor({
    tablename: formValue.value.tablename,
    num: Math.min(Number(formValue.value.num), 10),
    quotation: formValue.value.quotation,
    need: need
  });
  showModel.value = '\n### 部分结果\n\n```sql\n' + res + '\n```';
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
        <n-form-item label="行数" path="num">
          <n-input-number
            v-model:value="formValue.num"
            :show-button="false"
            clearable
            placeholder="最好不要过大"
          />
        </n-form-item>
        <n-form-item label="引号" path="num">
          <n-select
            v-model:value="formValue.quotation"
            style="width: 80px"
            :options="optionOfQuotation"
          />
        </n-form-item>
      </n-form>
    </n-space>

    <n-dynamic-input
      v-model:value="customValue"
      show-sort-button
      :on-create="onCreate"
    >
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
          />

          <div v-if="value.choose === 'auto increment'">
            <n-input-number
              v-model:value="value.message.initnum"
              :show-button="false"
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
              <n-input-number
                v-model:value="value.message.min"
                :show-button="false"
                placeholder="最小值"
              />
              <n-input-number
                v-model:value="value.message.max"
                :show-button="false"
                placeholder="最大值"
              />
            </n-space>
          </div>
          <div v-else-if="value.choose === 'float'">
            <n-space>
              <n-input-number
                v-model:value="value.message.min"
                :show-button="false"
                placeholder="最小值"
              />
              <n-input-number
                v-model:value="value.message.max"
                :show-button="false"
                placeholder="最大值"
              />
              <n-input-number
                v-model:value="value.message.dmin"
                :show-button="false"
                placeholder="最小位数"
              />
              <n-input-number
                v-model:value="value.message.dmax"
                :show-button="false"
                placeholder="最大位数"
              />
            </n-space>
          </div>
          <div v-else-if="value.choose === 'date'">
            <n-input
              v-model:value="value.message.date"
              type="text"
              placeholder="日期格式(用 - 连接)"
            />
          </div>
          <div v-else-if="value.choose === 'time'">
            <n-input
              v-model:value="value.message.time"
              type="text"
              placeholder="时间格式(用 : 连接)"
            />
          </div>
          <div v-else-if="value.choose === 'datetime'">
            <n-space>
              <n-input
                v-model:value="value.message.date"
                type="text"
                placeholder="日期格式(用 - 连接)"
              />
              <n-input
                v-model:value="value.message.time"
                type="text"
                placeholder="时间格式(用 : 连接)"
              />
            </n-space>
          </div>
          <div v-else-if="value.choose === 'pick'">
            <n-form :model="value.message.model">
              <n-form-item path="tags" :show-label="false">
                <n-dynamic-tags v-model:value="value.message.model.tags" />
              </n-form-item>
            </n-form>
          </div>
          <div v-else-if="value.choose === 'name'">
            <n-input
              type="text"
              :disabled="true"
              placeholder="A simple English name will be randomly generated"
            />
          </div>
          <div v-else-if="value.choose === 'sentence'">
            <n-space>
              <n-input-number
                v-model:value="value.message.min"
                :show-button="false"
                placeholder="最少单词个数"
              />
              <n-input-number
                v-model:value="value.message.max"
                :show-button="false"
                placeholder="最大单词个数"
              />
            </n-space>
          </div>
          <div v-else-if="value.choose === 'paragraph'">
            <n-space>
              <n-input-number
                v-model:value="value.message.min"
                :show-button="false"
                placeholder="最少句子个数"
              />
              <n-input-number
                v-model:value="value.message.max"
                :show-button="false"
                placeholder="最大句子个数"
              />
            </n-space>
          </div>
          <div v-else-if="value.choose === 'url'">
            <n-input type="text" :disabled="true" placeholder="生成一个 URL" />
          </div>
          <div v-else-if="value.choose === 'ip'">
            <n-input type="text" :disabled="true" placeholder="生成一个 IP" />
          </div>
          <div v-else-if="value.choose === 'email'">
            <n-input type="text" :disabled="true" placeholder="生成一个邮箱" />
          </div>
          <div v-else-if="value.choose === 'domain'">
            <n-input type="text" :disabled="true" placeholder="生成一个域名" />
          </div>
          <div v-else-if="value.choose === 'region'">
            <n-input
              type="text"
              :disabled="true"
              placeholder="生成一个中国大区"
            />
          </div>
          <div v-else-if="value.choose === 'province'">
            <n-input
              type="text"
              :disabled="true"
              placeholder="生成一个省（或直辖市、自治区、特别行政区）"
            />
          </div>
          <div v-else-if="value.choose === 'id'">
            <n-input
              type="text"
              :disabled="true"
              placeholder="随机生成一个 18 位身份证"
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
        <n-popover placement="bottom" trigger="click" @update:show="show">
          <template #trigger>
            <n-button type="success" strong secondary>预览</n-button>
          </template>
          <span
            v-dompurify-html="md.render(showModel)"
            v-highlight
            v-katex
          ></span>
        </n-popover>
        <n-button
          strong
          secondary
          type="primary"
          size="medium"
          @click="handleGen"
        >
          生成
        </n-button>
      </n-space>
    </template>
  </n-card>
</template>
