<script lang="ts" setup>
import { h, Component, ref } from 'vue';
import { NIcon } from 'naive-ui';
import type { MenuOption } from 'naive-ui';
import {
  PersonOutline as PersonIcon,
  AddCircleOutline as AddIcon,
  CallOutline as CallIcon,
  InformationCircleOutline as InfoIcon,
  BugOutline as BugIcon,
  GitCommitOutline as CommitIcon,
  ArrowBackCircleOutline as ArrowBack,
  ServerOutline as DataBase,
  CloudDoneOutline as CloudIcon,
  SchoolOutline as SchoolIcon,
  ShareOutline as ShareIcon,
  BarChartOutline as BarIcon
} from '@vicons/ionicons5';

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const accout = JSON.parse(localStorage.account);
const emit = defineEmits(['getRoute']);

const menuOptions: MenuOption[] = [
  {
    type: 'group',
    label: accout.username,
    key: 'info',
    children: [
      {
        label: '个人信息',
        key: 'self-info',
        icon: renderIcon(InfoIcon)
      },
      {
        label: '答题情况',
        key: 'self-page',
        icon: renderIcon(BarIcon)
      },
      {
        label: '退出登录',
        key: 'logout',
        icon: renderIcon(ArrowBack)
      }
    ]
  },
  {
    type: 'group',
    label: '控制台',
    key: 'console',
    children: [
      {
        label: '学生管理',
        key: 'student-manage',
        icon: renderIcon(PersonIcon)
      },
      {
        label: '题目管理',
        key: 'question-manage',
        icon: renderIcon(AddIcon)
      },
      {
        label: '测试数据集',
        key: 'test-case',
        icon: renderIcon(DataBase)
      },
      {
        label: '提交记录',
        key: 'submit-record',
        icon: renderIcon(CommitIcon)
      },
      {
        label: '知识分享',
        key: 'knowledge-share',
        icon: renderIcon(ShareIcon)
      },
      {
        label: '权限管理',
        key: 'admin-accoun-manage',
        icon: renderIcon(SchoolIcon)
      },
      {
        label: '测评机管理',
        key: 'judge-server',
        icon: renderIcon(CloudIcon)
      },
      {
        label: '联系我们',
        key: 'call-us',
        icon: renderIcon(CallIcon)
      }
    ]
  }
];

const menuOptionsForStu: MenuOption[] = [
  {
    type: 'group',
    label: '个人信息',
    key: 'info',
    children: [
      {
        label: accout.username,
        key: 'self-info',
        icon: renderIcon(InfoIcon)
      },
      {
        label: '答题情况',
        key: 'self-page',
        icon: renderIcon(BarIcon)
      },
      {
        label: '退出登录',
        key: 'logout',
        icon: renderIcon(ArrowBack)
      }
    ]
  },
  {
    type: 'group',
    label: '控制台',
    key: 'console',
    children: [
      {
        label: '题目列表',
        key: 'question-manage',
        icon: renderIcon(AddIcon)
      },
      {
        label: '提交记录',
        key: 'submit-record',
        icon: renderIcon(CommitIcon)
      },
      {
        label: '知识分享',
        key: 'knowledge-share',
        icon: renderIcon(ShareIcon)
      },
      {
        label: '联系我们',
        key: 'call-us',
        icon: renderIcon(CallIcon)
      }
    ]
  }
];

const handleUpdateValue = (key: String) => {
  emit('getRoute', key);
};
</script>

<template>
  <div v-if="accout.role === 1">
    <n-menu :options="menuOptionsForStu" @update:value="handleUpdateValue" />
  </div>
  <div v-else>
    <n-menu :options="menuOptions" @update:value="handleUpdateValue" />
  </div>
</template>
