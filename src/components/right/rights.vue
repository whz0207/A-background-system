<template>
  <!-- 添加一个根组件 -->
  <el-card>
    <!-- 面包屑导航 -->
    <BreadNav :navTitle="'权限管理'" :navContent="'权限列表'"/>
    <!-- 表格 -->
    <el-table :data="rightData" style="width: 100%" :border="true" class="rightTable">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
      <el-table-column prop="path" label="路径" width="180"></el-table-column>
      <el-table-column prop="level" label="层级">
          <template slot-scope="scope">
              {{ scope.row.level == '0' ? '一级' :(scope.row.level == '1' ? '二级' : '三级') }}
          </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
//引入面包屑导航
import BreadNav from "../layout/breadnav/breadnav.vue";

export default {
  data() {
    return {
      rightData: []
    };
  },
  components: {
    BreadNav
  },
  methods: {
    getRightList() {
      this.$http
        .get(`rights/list`, {
          // headers: {
          //   Authorization: localStorage.getItem("token")
          // }
        })
        .then(res => {
          let { meta, data } = res.data;
          console.log(res);
          
          if (meta.status === 200) {
            this.rightData = data;
          }
        });
    }
  },
  mounted(){
      // 渲染权限数据
      this.getRightList()
  }
};
</script>

<style>
.rightTable {
  margin-top: 20px;
}
</style>
