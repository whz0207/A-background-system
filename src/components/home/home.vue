<template>
  <div class="home">
    <!-- 头部区域 -->
    <el-container>
      <el-header>
        <TopHead/>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <!-- 侧边栏区域 -->
          <Aside/>
        </el-aside>
        <!-- 内容区域 -->
        <el-main>
          <!-- 添加一个路由 -->
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
// 引入头部组件
import TopHead from "../layout/tophead/tophead.vue";
import Aside from "../layout/aside/aside.vue";

export default {
  // 进入一个组件执行的代码
  // mounted() {
  //   // 判断是否存在token
  //   let token = window.localStorage.getItem("token");
  //   // console.log(token);
  //   // 判断
  //   if (!token) {
  //     // 说明没有登录，需要重新跳转回login
  //     this.$router.push({ name: "login" });
  //   }
  // },
  components: {
    TopHead,
    Aside
  }
};
</script>

<style scoped>
.home {
  height: 100%;
}

.el-header {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #545c64;
  color: #333;
  /* text-align: center; */
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  /* text-align: center; */
  /* line-height: 160px; */
}

.el-container {
  height: 100%;
}
</style>
