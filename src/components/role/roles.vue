<template>
  <!-- 添加一个根组件 -->
  <el-card>
    <!-- 面包屑导航 -->
    <BreadNav :navTitle="'权限管理'" :navContent="'角色列表'"/>
    <!-- 添加按钮 -->
    <el-button class="addRole">添加角色</el-button>
    <!-- 表格 -->
    <el-table :data="roleData" style="width: 100%" :border="true" class="roleTable">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- 外层行 -->
          <el-row v-for="(item1,index1) in scope.row.children" :key="index1">
            <!-- 一级权限 -->
            <el-col :span="4">
              <el-tag
                @close="close(scope.row.id,item1.id,scope)"
                :disable-transitions="true"
                closable
              >{{ item1.authName }}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row v-for="(item2,index2) in item1.children" :key="index2">
                <!-- 二级权限 -->
                <el-col :span="5">
                  <el-tag
                    @close="close(scope.row.id,item2.id,scope)"
                    closable
                    type="success"
                  >{{ item2.authName }}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <!-- 三级权限 -->
                <el-col :span="19">
                  <el-tag
                    @close="close(scope.row.id,item3.id,scope)"
                    class="tag3"
                    closable
                    v-for="(item3,index3) in item2.children"
                    :key="index3"
                    type="warning"
                  >{{ item3.authName }}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-if=" scope.row.children.length == 0 ">
            <el-col :span="24">没有分配权限</el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" plain size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" plain size="mini"></el-button>
          <el-button
            type="success"
            icon="el-icon-check"
            plain
            size="mini"
            @click="openDialog(scope)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分配用户权限 -->
    <el-dialog title="权限分配" :visible.sync="roleDialog">
      <!-- 
        props: 用来指定数据源中显示的文本属性&子选项的属性
        show-checkbox: 显示多选框
        data:绑定数据源
        default-expand-all: 展开所有项
        default-checked-keys: 设置默认选中
        node-key: 设置当前节点的唯一标识
      -->
      <el-tree
        :data="rightsList"
        :props="props"
        ref="tree"
        node-key="id"
        default-expand-all
        :default-checked-keys="defaultcheck"
        show-checkbox
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleDialog = false">取 消</el-button>
        <el-button type="primary" @click="setRole">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
//引入面包屑导航
import BreadNav from "../layout/breadnav/breadnav.vue";

export default {
  data() {
    return {
      roleData: [], //角色数据源
      rightsList: [], // 所有的权限数据
      roleDialog: false, // 分配角色权限对话框
      defaultcheck: [], // 默认选中的数组
      props: {
        label: "authName",
        children: "children"
      },
      rid: "" // 保存分配权限的角色ID
    };
  },
  components: {
    BreadNav
  },
  methods: {
    async getRoleList() {
      let res = await this.$http.get(`roles`, {
        // headers: {
        //   Authorization: localStorage.getItem("token")
        // }
      });
      console.log(res);
      let { data } = res.data;
      this.roleData = data;
    },
    // 删除角色权限
    /**
     * roleId 要删除权限的角色id
     * rightsId 要删除的权限id
     * scope 当前行的数据源
     */
    async close(roleId, rightsId, scope) {
      // 发送请求给服务器去删除角色对应的权限
      let res = await this.$http.delete(`roles/${roleId}/rights/${rightsId}`);
      // 解构赋值
      let { meta, data } = res.data;
      if (meta.status === 200) {
        //更新权限(返回的是该角色目前拥有的权限)
        scope.row.children = data;
      } else {
        this.$message.error(meta.msg);
      }
    },
    // 打开权限对话框
    // scope 当前行对应的数据源
    async openDialog(scope) {
      // 存入用户角色id
      this.rid = scope.row.id;
      // 打开分配权限对话框并清空默认选中
      this.defaultcheck = [];
      this.roleDialog = true;
      // 以树形结构获取权限数据
      let res = await this.$http.get(`rights/tree`);
      //解构赋值
      let { meta, data } = res.data;
      if (meta.status === 200) {
        this.rightsList = data;
        // 设置默认选中的权限
        // 得到所有的三级权限
        // 一级权限
        scope.row.children.forEach(item1 => {
          // 二级权限
          item1.children.forEach(item2 => {
            // 三级权限
            item2.children.forEach(item3 => {
              // 得到所有三级权限
              this.defaultcheck.push(item3.id);
            });
          });
        });
        console.log(this.defaultcheck);
      } else {
        this.$message.error(meta.msg);
      }
    },
    // 设置权限
    async setRole() {
      // 获取当前树形结构已经被选中
      // getCheckedKeys: 得到全选节点的key
      let allCheck = this.$refs.tree.getCheckedKeys();
      let half = this.$refs.tree.getHalfCheckedKeys();
      // 合并
      let arr = [...allCheck, ...half];
      // 转为字符串
      let rids = arr.join(",");
      console.log(rids);
      // 发送请求
      let res = await this.$http.post(`roles/${this.rid}/rights`, {
        rids: rids
      });
      let { meta } = res.data;
      if (meta.status === 200) {
        this.$message({
          type: "success",
          message: meta.msg
        });
        // 关闭分配权限对话框
        this.roleDialog = false;
      } else {
        this.$message.error(meta.msg);
      }
      // 重新获取数据
      this.getRoleList();
    }
  },
  mounted() {
    // 渲染角色数据
    this.getRoleList();
  }
};
</script>

<style>
.addRole {
  margin-top: 20px;
}
.roleTable {
  margin-top: 20px;
}
.tag3 {
  margin-bottom: 10px;
  margin-right: 10px;
}
</style>
