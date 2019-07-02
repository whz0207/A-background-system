<template>
  <div>
    <el-row>
      <!-- 分为三个部分 -->
      <el-col class="top" :span="4">
        <div class="grid-content bg-purple">
          <img src="../../../../static/logo3.png" alt>
        </div>
      </el-col>
      <el-col class="top" :span="16">
        <div class="grid-content bg-purple">
          <h1>有情文化管理后台</h1>
        </div>
      </el-col>
      <el-col class="top" :span="4">
        <div class="grid-content bg-purple">
          <a href="javascript:;" class="logout" @click="logout">退出</a>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  methods: {
    //退出登录
    logout() {
      this.$confirm("确认退出登录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "退出成功!"
          });
          // 清除token
          window.localStorage.removeItem("token");
          // 回到登录页面
          this.$router.push("/login");
        })
        .catch(() => {});
    }
  }
};
</script>

<style scoped>
.logout {
  float: right;
  text-decoration: none;
}

.top {
  height: 60px;
}

h1 {
  margin: 0;
}

img {
  width: 150px;
  height: 60px;
}
</style>
