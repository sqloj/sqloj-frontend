<script lang="ts" setup>
import { h, Component } from 'vue';
import { NIcon, useMessage } from 'naive-ui';
import type { MenuOption } from 'naive-ui';
import {
  PersonOutline as PersonIcon,
  AddCircleOutline as AddIcon,
  CallOutline as CallIcon,
  InformationCircleOutline as InfoIcon,
  BugOutline as BugIcon
} from '@vicons/ionicons5';

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const accout = JSON.parse(sessionStorage.account);

const menuOptions: MenuOption[] = [
  {
    type: 'group',
    label: '个人信息',
    key: 'info',
    children: [
      {
        label: () => accout.username,
        key: 'username',
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
        key: 'student-manage',
        icon: renderIcon(PersonIcon)
      },
      {
        label: '题目管理',
        key: 'add-question',
        icon: renderIcon(AddIcon)
      },
      {
        label: '权限管理',
        key: 'authority-manage',
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
  message.info(`[onUpdate:value]: ${JSON.stringify(key)}`);
  message.info(`[onUpdate:value]: ${JSON.stringify(item)}`);
};
</script>

<template>
  <n-menu :options="menuOptions" @update:value="handleUpdateValue" />
</template>
