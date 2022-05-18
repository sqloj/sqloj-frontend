<template>
  <n-message-provider>
    <router-view />
  </n-message-provider>
</template>

<style lang="less">
#app {
  height: 100vh;
  width: 100%;
}

html,
body {
  margin: 0;
  padding: 0;
}

input:-webkit-autofill,
input:autofill {
  box-shadow: 0 0 0 100px #fff inset !important;
  border-color: transparent !important;
}
</style>
