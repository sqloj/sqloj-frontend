<template>
  <h1>{{msg}}</h1>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/Login">Login</router-link> |
    <router-link to="/Main">Main</router-link>
  </nav>
  <router-view/>
</template>

<script lang="ts">

export default {

  setup(){
    const msg = "Hello Vue !"
    return {msg}
  }
}
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
