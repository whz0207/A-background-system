<template>
  <!-- 用来使用 element -->
  <div>
    <h1>这个组件用来帮助我们使用element-ui</h1>
    <h3>使用Elementui中的按钮组件</h3>
    <el-button type="primary">主要按钮</el-button>
    <el-button type="primary" icon="el-icon-edit" circle></el-button>
    <h3>多选框组件</h3>
    <el-checkbox v-model="checked">备选项</el-checkbox>
    <el-checkbox v-model="checked">备选项</el-checkbox>
    <el-checkbox v-model="checked">备选项</el-checkbox>
    <h3>面包屑导航</h3>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">活动管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {};
</script>

<style>
</style>
