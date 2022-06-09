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
const userID = router.currentRoute.value.params.userID;
const total = ref({
  id: '',
  username: '',
  department: '',
  signature: '',
  role: null,
  UNKNOWN: 0,
  ACCEPT: 0,
  'WRONG ANSWER': 0,
  'COMPLETE ERROR': 0,
  TOTAL: 0
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
    width: '50%',
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
    key: 'updateTime'
  }
];

const queryArticle = () => {
  console.log(userID);
  axios
    .post(`api/v1/article/filter`, {
      userID: userID
    })
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

const queryUser = () => {
  axios
    .post(`api/v1/user/filter`, null, {
      params: {
        id: userID
      }
    })
    .then(res => res.data)
    .then(data => {
      if (data.code === 0) {
        if (data.data.length === 0) {
          message.error('用户不存在');
          router.back();
          return;
        }
        total.value = data.data[0];
        console.log(total.value);
      } else {
        message.error('请求失败');
        message.error(data.message);
      }
    })
    .catch(error => {
      message.error(error);
      console.log(error);
    });
};

const queryRecord = () => {
  axios
    .post(`api/v1/submit/filter`, {
      userID: userID
    })
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

const queryScore = () => {
  let promises = [];
  let count = 0;
  for (let i = 0; i < 5; i++) {
    promises.push(
      axios
        .post('api/v1/submit/count', {
          userID: userID,
          result: i
        })
        .then(res => res.data)
        .then(data => {
          if (data.code === 0) {
            count += data.data;
            switch (i) {
              case 0:
                total.value.UNKNOWN = data.data;
                break;
              case 1:
                total.value.ACCEPT = data.data;
                break;
              case 3:
                total.value['WRONG ANSWER'] = data.data;
                break;
              case 4:
                total.value['COMPLETE ERROR'] = data.data;
                break;
            }
          } else {
            message.error(data.message);
          }
        })
        .catch(error => {
          console.error(error);
          message.error('ERROR!');
        })
    );
  }
  // 重新加载列表
  Promise.all(promises).finally(() => {
    total.value.TOTAL = count;
  });
};

onMounted(() => {
  queryUser();
  queryScore();
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

          <n-tab-pane name="info" tab="信息">
            <n-h4>姓名：{{ userID }}</n-h4>
            <n-h4>个性签名：</n-h4>
            <n-h3>{{ total.signature }}</n-h3>
          </n-tab-pane>
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
