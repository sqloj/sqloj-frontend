<script lang="ts" setup>
import axios from 'axios';
import { useMessage } from 'naive-ui';
import { onMounted, Ref, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ReceiptOutline } from '@vicons/ionicons5';
import SqlEditor from '../components/SqlEditor.vue';
import GenerateDataCard from '../components/GenerateDataCard.vue';
import { constructor } from '../setting/constructor';
import { SelectMixedOption } from 'naive-ui/es/select/src/interface';
import SmartTable from '../components/SmartTable.vue';
import { DATABASE } from '../setting/const';

const router = useRouter();
const message = useMessage();
const loadingRef = ref(false);
const db_options: Ref<SelectMixedOption[]> = ref([]);
let testcase = ref({
  label: '',
  abstract: '',
  content: '',
  judgeTypeID: null
});

class Redisform {
  redis: string;
  constructor(t: string) {
    this.redis = t;
  }
}

// init
onMounted(() => {
  axios
    .get(`api/v1/judge/allSupport`)
    .then(res => res.data)
    .then(data => {
      if (data.code === 0) {
        for (let i of data.data) {
          db_options.value.push({ value: i.judgeTypeID, label: i.typeName });
        }
      } else {
        message.error(data.message);
        router.back();
      }
    })
    .catch(error => {
      message.error('错误');
      console.error(error);
    });
});

// test
const showResult = ref(false);
const dataRef: Ref<{}[][]> = ref([[]]);
const handleTest = () => {
  if (testcase.value.judgeTypeID === null) {
    return message.error('请选择数据库');
  }
  loadingRef.value = true;
  axios
    .post(`api/v1/submit/testcase`, {
      abstract: testcase.value.abstract,
      content: testcase.value.content,
      judgeTypeID: testcase.value.judgeTypeID
    })
    .then(res => res.data)
    .then(data => {
      if (data.code === 0) {
        message.success('运行成功');
        if (testcase.value.judgeTypeID === DATABASE.REDIS) {
          let dataArr: Array<Array<Redisform>> = new Array<Array<Redisform>>();
          let now: Array<Redisform> = new Array<Redisform>();
          for (let i in data.data) now.push(new Redisform(data.data[i]));
          dataArr.push(now);
          dataRef.value = dataArr;
        } else {
          dataRef.value = data.data;
        }
        showResult.value = true;
        loadingRef.value = false;
      } else {
        loadingRef.value = false;
        message.error(data.message);
      }
    })
    .catch(error => {
      loadingRef.value = false;
      message.error('错误');
      console.error(error);
    });
};

const handleSubmit = () => {
  if (testcase.value.judgeTypeID === null) {
    return message.error('请选择数据库');
  }
  axios
    .post(`api/v1/testcase/insert`, {
      ...testcase.value,
      typeName: DATABASE[testcase.value.judgeTypeID]
    })
    .then(res => res.data)
    .then(data => {
      if (data.code === 0) {
        message.success('添加成功');
        router.replace('/main/test-case');
      } else {
        message.error(data.message);
      }
    })
    .catch(error => {
      message.error('错误');
      console.error(error);
    });
};

// 构造器部分
const showModal = ref(false);
const valueChange = ref(false);
const GenButton = () => {
  showModal.value = true;
};

const getData = (body: any) => {
  let res = constructor(body);
  testcase.value.content = testcase.value.content + '\r\n' + res;
  valueChange.value = !valueChange.value;
};
</script>

<template>
  <div class="manage-container">
    <n-h1>测试集</n-h1>

    <n-modal v-model:show="showModal">
      <generate-data-card @get-data="getData" />
    </n-modal>
    <n-form :model="testcase">
      <n-form-item label="标签" class="inputtext" path="label">
        <n-input
          v-model:value="testcase.label"
          placeholder="请填写标签内容"
          :autofocus="true"
        />
      </n-form-item>
      <n-form-item label="数据库" class="inputtext" path="judgeTypeID">
        <n-select
          v-model:value="testcase.judgeTypeID"
          :options="db_options"
          placeholder="请选择数据库类型"
        />
      </n-form-item>

      <n-form-item
        v-if="testcase.judgeTypeID !== DATABASE.REDIS"
        label="建表语句"
        class="inputtext"
        path="abstract"
      >
        <sql-editor v-model:value="testcase.abstract" language="sql" />
      </n-form-item>
      <n-form-item
        v-if="testcase.judgeTypeID === DATABASE.REDIS"
        label="建表语句 （lua 脚本）"
        class="inputtext"
        path="abstract"
      >
        <n-popover trigger="hover" :duration="10">
          <template #trigger>
            <sql-editor v-model:value="testcase.abstract" language="lua" />
          </template>
          <span>注意！在测试完后删除最后的 return 语句</span>
        </n-popover>
      </n-form-item>
      <!-- 构造器-->
      <n-button
        v-if="testcase.judgeTypeID !== DATABASE.REDIS"
        type="primary"
        size="small"
        strong
        secondary
        style="margin-bottom: 20px"
        @click="GenButton"
      >
        <template #icon>
          <n-icon size="18">
            <ReceiptOutline />
          </n-icon>
        </template>
        数据生成器
      </n-button>
      <n-form-item
        v-if="testcase.judgeTypeID !== DATABASE.REDIS"
        label="插入语句"
        class="inputtext"
        path="content"
      >
        <sql-editor
          v-model:value="testcase.content"
          :value-change="valueChange"
          language="sql"
        />
      </n-form-item>
    </n-form>
    <n-space>
      <n-popover trigger="hover">
        <template #trigger>
          <n-button type="primary" :loading="loadingRef" @click="handleTest">
            测试
          </n-button>
        </template>
        <span
          >若需要查看表的内容，请在插入语句内写对应的 SELECT
          语句,否则只会知道是否允许执行</span
        >
      </n-popover>

      <n-button type="primary" @click="handleSubmit"> 添加 </n-button>
    </n-space>
    <div v-if="showResult">
      <smart-table :data-ref="dataRef" />
    </div>
  </div>
</template>

<style scoped>
.manage-container {
  max-width: 800px;
  margin: 80px auto;
}

.card {
  text-align: left;
}
</style>
