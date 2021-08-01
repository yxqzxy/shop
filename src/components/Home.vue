<template>
  <div id="home">
    <el-button type="info" round @click="back">退出</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    back() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
  },
}
</script>

<style>
</style>