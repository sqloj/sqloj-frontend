<script lang="ts" setup>
import { ref, onMounted, h } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { NA, useMessage } from 'naive-ui';
import { RESULT } from '../setting/const';

const router = useRouter();
const message = useMessage();
const ArticleRef = ref([]);
const loadingArticleRef = ref(true);
const total = ref({
  UNKNOWN: 1,
  ACCEPT: 4,
  'WRONG ANSWER': 5,
  'COMPLETE ERROR': 4,
  TOTAL: 14
});

const queryInfo = () => {
  axios
    .get(`api/v1/submit{id}`)
    .then(res => res.data)
    .then(data => {
      if (data.code === 0) {
        total.value = data.data;
        total.value.TOTAL =
          total.value.ACCEPT +
          total.value['COMPLETE ERROR'] +
          total.value['WRONG ANSWER'] +
          total.value.UNKNOWN;
      } else {
        message.error(data.message);
      }
    })
    .catch(error => {
      message.error(error);
      console.log(error);
    });
};

const ArticleCol = [
  {
    title: '编号',
    key: 'id'
  },
  {
    title: '标题',
    key: 'title',
    ellipsis: true,
    width: '60%',
    render(row: any) {
      return h(
        NA,
        {
          onClick() {
            router.push({
              name: 'article-page',
              params: {
                ArticleId: row.id
              }
            });
          }
        },
        {
          default: () => row.title
        }
      );
    }
  },
  {
    title: '时间',
    key: 'time'
  }
];

const queryArticle = () => {
  axios
    .get(`api/v1/share/list{id}`)
    .then(res => res.data)
    .then(data => {
      ArticleRef.value = data.data;
      loadingArticleRef.value = false;
    })
    .catch(error => {
      loadingArticleRef.value = false;
      message.error(error);
      console.log(error);
    });
};

const RecordCol = [
  {
    title: '编号',
    key: 'id'
  },
  {
    title: '题目编号',
    key: 'questionID'
  },
  {
    title: '提交者',
    key: 'userID'
  },
  {
    title: '结果',
    key: 'result'
  },
  {
    title: '提交时间',
    key: 'time'
  }
];

const RecordRef = ref([]);
const loadingRecordRef = ref(true);

const queryRecord = () => {
  axios
    .get(`/api/v1/submit/list{id}`)
    .then(res => res.data)
    .then(data => {
      for (let i of data.data) {
        i.result = RESULT[i.result];
      }
      RecordRef.value = data.data;
      loadingRecordRef.value = false;
    })
    .catch(error => {
      loadingRecordRef.value = false;
      message.error(error);
      console.log(error);
    });
};

onMounted(() => {
  queryInfo();
  queryArticle();
  queryRecord();
});
</script>

<template>
  <div class="view-info">
    <div class="view-info-container">
      <n-card title="" style="margin-bottom: 16px">
        <n-tabs
          default-value="statistics"
          justify-content="space-evenly"
          type="line"
        >
          <n-tab-pane name="statistics" tab="统计" style="text-align: center">
            <n-space justify="space-around">
              <n-space>
                <n-progress
                  type="multiple-circle"
                  :stroke-width="5"
                  :circle-gap="1"
                  :percentage="[
                    (total.ACCEPT / total.TOTAL) * 100,
                    (total['WRONG ANSWER'] / total.TOTAL) * 100,
                    (total['COMPLETE ERROR'] / total.TOTAL) * 100,
                    (total.UNKNOWN / total.TOTAL) * 100
                  ]"
                  :color="['#00ff00', '#ff6666', '#33ccff', '#D3D3D3']"
                  :rail-style="[
                    { stroke: 'let(--info-color)', opacity: 0.3 },
                    { stroke: 'let(--success-color)', opacity: 0.3 },
                    { stroke: 'let(--warning-color)', opacity: 0.3 },
                    { stroke: 'let(--error-color)', opacity: 0.3 }
                  ]"
                >
                  <div style="text-align: center">提交统计</div>
                </n-progress>
              </n-space>
              <n-space vertical style="text-align: left">
                <n-tag type="success"> Accepted : {{ total.ACCEPT }} </n-tag>
                <n-tag type="error">
                  Wrong Answer : {{ total['WRONG ANSWER'] }}
                </n-tag>
                <n-tag type="info">
                  Complete Error : {{ total['COMPLETE ERROR'] }}
                </n-tag>
                <n-tag> Unkonwn : {{ total.UNKNOWN }}</n-tag>
                <n-tag type="warning"> Totle : {{ total.TOTAL }} </n-tag>
              </n-space>
            </n-space>
          </n-tab-pane>

          <n-tab-pane name="info" tab="信息"> </n-tab-pane>
        </n-tabs>
      </n-card>
      <!-- list -->
      <n-space vertical>
        <n-h4>发帖</n-h4>
        <n-data-table
          :bordered="false"
          :columns="ArticleCol"
          :data="ArticleRef"
          :pagination="{ pageSize: 5 }"
          :row-key="(row: any) => row.id"
          :loading="loadingArticleRef"
        />
        <n-h4>提交记录</n-h4>
        <n-data-table
          :bordered="false"
          :columns="RecordCol"
          :data="RecordRef"
          :pagination="{ pageSize: 5 }"
          :row-key="(row: any) => row.id"
          :loading="loadingRecordRef"
        />
      </n-space>
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
