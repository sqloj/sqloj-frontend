<script lang="ts" setup>
import { h, Component } from 'vue';
import { NIcon, useMessage } from 'naive-ui';
import type { MenuOption } from 'naive-ui';
import {
  PersonOutline as PersonIcon,
  AddCircleOutline as AddIcon,
  CallOutline as CallIcon,
  InformationCircleOutline as InfoIcon,
  BugOutline as BugIcon,
  GitCommitOutline as CommitIcon
} from '@vicons/ionicons5';

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const accout = JSON.parse(sessionStorage.account);

const emit = defineEmits(['getRoute']);

const menuOptions: MenuOption[] = [
  {
    type: 'group',
    label: '个人信息',
    key: 'info',
    children: [
      {
        label: accout.username,
        key: 'SelfInfo',
        icon: renderIcon(InfoIcon)
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
        key: 'StudentManage',
        icon: renderIcon(PersonIcon)
      },
      {
        label: '题目管理',
        key: 'QuestionManage',
        icon: renderIcon(AddIcon)
      },
      {
        label: '提交记录',
        key: 'SubmitRecord',
        icon: renderIcon(CommitIcon)
      },
      {
        label: '权限管理',
        key: 'AdminAccountManage',
        icon: renderIcon(BugIcon)
      },
      {
        label: '联系我们',
        key: 'call-us',
        icon: renderIcon(CallIcon)
      }
    ]
  }
];

const message = useMessage();

const handleUpdateValue = (key: string, item: MenuOption) => {
  message.info(`${item.label}`);
  emit('getRoute', key);
};
</script>

<template>
  <n-menu :options="menuOptions" @update:value="handleUpdateValue" />
</template>
