<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{ navTitle }}</el-breadcrumb-item>
    <el-breadcrumb-item>{{ navContent }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  // 将来要在父组件传入两个参数： navTitle，navContent
  props: ['navTitle', 'navContent']
};
</script>

<style>
</style>
