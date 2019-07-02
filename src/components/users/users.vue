<template>
  <!-- 添加一个根组件 -->
  <el-card>
    <!-- 添加一个面包屑导航 -->
    <BreadNav :navTitle="'用户管理'" :navContent="'用户列表'" />
    <!-- 添加一个搜索框 -->
    <el-row class="searchRow">
      <el-col :span="8">
        <el-input placeholder="请输入内容" v-model="search" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="searchData"></el-button>
        </el-input>
      </el-col>
      <el-col :span="16">
        &nbsp;
        <el-button type="success" plain @click="showAdd">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 添加一个表格 -->
    <el-table :data="tableData" style="width: 100%" :border="true" class="table">
      <!-- 
            el-table: 会自动遍历数据源
                border: 设置边框
            el-table-column: 表格的列
                property: 当前列表显示的字段
                label: 当前列的表头
                width: 当前列的宽度
                注意点：
                    1）列中无法显示boolean值
                    2）如果要在列中显示自己的内容，应该添加template
                    3) slot-scope="scope" 中的scope.row 显示的就是这一行的数据源
      -->
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="姓名" width="120"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="120"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="120"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <!-- 数据源 -->
          <!-- {{scope.row}} -->
          <el-switch
            @change="changeSta(scope.row.id,scope.row.mg_state)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            plain
            size="mini"
            @click="showEdit(scope.row.id)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            plain
            size="mini"
            @click="deleteUser(scope.row.id)"
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-check"
            plain
            size="mini"
            @click="chanRole(scope.row.id,scope.row.role_id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增的对话框 -->
    <!-- 
        el-dialog: 对话框
        visible.sync: 控制当前对话框的显示和隐藏
    -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" :model="form" ref="addForm">
        <el-form-item prop="username" label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码" :label-width="formLabelWidth">
          <el-input type="password" v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="postAdd">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialog">
      <el-form :model="form" ref="editForm">
        <el-form-item prop="username" label="用户名" :label-width="formLabelWidth">
          <el-input :disabled="true" v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="editAdd">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色的对话框 -->
    <el-dialog title="分配角色" :visible.sync="checkDialog">
      <el-form :model="form">
        <el-form-item prop="username" label="当前用户" :label-width="formLabelWidth">{{ form.username }}</el-form-item>
        <el-form-item label="请选择角色" :label-width="formLabelWidth">
          <!-- 角色id -->
          <!-- {{ form.rid }} -->
          <el-select v-model="form.rid" placeholder="请选择角色">
            <!-- label: 设置 Option 之间的文本 value: 设置 option 的 value 属性 -->
            <el-option :value="-1" label="请选择" :disabled="true"></el-option>
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="checkDialog = false">取 消</el-button>
        <el-button type="primary" @click="postCheck">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
// 引入面包屑导航
import BreadNav from '../layout/breadnav/breadnav.vue'

export default {
  data() {
    return {
      search: "",
      tableData: [],
      pagenum: 1, // 当前页
      pagesize: 20, // 显示数据数量
      form: {
        // 表示表单中的数据
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      dialogFormVisible: false, // 控制新增对话框的显示和隐藏
      editDialog: false, // 控制修改对话框的显示和隐藏
      checkDialog: false, // 控制分配角色对话框的显示和隐藏
      formLabelWidth: "100px", // 文本宽度
      rules: {
        //添加验证规则
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入用户密码", trigger: "blur" }
        ]
      },
      options: [] // 下拉框数据
    };
  },
  methods: {
    // 获取所有用户数据
    getUserList() {
      // 得到 token
      // let token = window.localStorage.getItem("token");
      // 发送请求时需要在请求头中添加 token
      this.$http
        .get("users", {
          // headers: {
          //   // 添加 token
          //   Authorization: token
          // },
          params: {
            query: this.search,
            pagenum: this.pagenum,
            pagesize: this.pagesize
          }
        })
        .then(res => {
          //   console.log(res);
          let { data, meta } = res.data;
          if (meta.status === 200) {
            // 将数据保存到tableData
            this.tableData = data.users;
          }
        });
    },
    //显示新增对话框
    showAdd() {
      this.dialogFormVisible = true;
      // 清空数据
      this.form.username = "";
      this.form.password = "";
      this.form.email = "";
      this.form.mobile = "";
    },
    // 提交新增数据
    postAdd() {
      let token = window.localStorage.getItem("token");
      //1. 验证数据是否合法
      this.$refs.addForm.validate(valid => {
        if (valid) {
          //2. 将数据提交到服务器
          this.$http
            .post(
              "users",
              {
                // 表示表单中的数据
                username: this.form.username,
                password: this.form.password,
                email: this.form.email,
                mobile: this.form.mobile
              },
              {
                // // token
                // headers: {
                //   // 在请求头中添加 token
                //   Authorization: token
                // }
              }
            )
            .then(res => {
              console.log(res);
              //3. 接收结果
              let { data, meta } = res.data;
              if (meta.status === 201) {
                //提示添加成功
                this.$message({
                  message: meta.msg,
                  type: "success"
                });
                // 重新渲染用户数据
                this.getUserList();
                // 关闭添加用户面板
                this.dialogFormVisible = false;
                // 清空数据
                this.form.username = "";
                this.form.password = "";
                this.form.email = "";
                this.form.mobile = "";
              } else {
                this.$message.error(meta.msg);
              }
            });
        } else {
          this.$message.error("参数不合法");
        }
      });
    },
    // 搜索数据
    searchData() {
      this.getUserList();
    },
    // 打开修改面板&得到要修改的数据
    showEdit(id) {
      // 打开修改面板
      this.editDialog = true;
      // 得到 token
      let token = window.localStorage.getItem("token");
      // 发送请求时需要在请求头中添加 token
      this.$http
        .get(`users/${id}`, {
          // headers: {
          //   Authorization: token
          // }
        })
        .then(res => {
          let { meta, data } = res.data;
          if (meta.status === 200) {
            this.form = data;
          }
        });
    },
    // 修改数据
    editAdd() {
      this.$http
        .put(
          `users/${this.form.id}`,
          {
            email: this.form.email,
            mobile: this.form.mobile
          },
          {
            // headers: {
            //   Authorization: localStorage.getItem("token")
            // }
          }
        )
        .then(res => {
          // 解构赋值
          let { meta, data } = res.data;
          if (meta.status === 200) {
            //提示修改成功
            this.$message({
              message: meta.msg,
              type: "success"
            });
            // 重新渲染用户数据
            this.getUserList();
            // 关闭修改用户面板
            this.editDialog = false;
          } else {
            this.$message.error(meta.msg);
          }
        });
    },
    // 删除数据
    deleteUser(id) {
      this.$confirm("确定删除该用户?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http
          .delete(`users/${id}`, {
            // headers: {
            //   Authorization: localStorage.getItem("token")
            // }
          })
          .then(res => {
            //解构赋值
            let { data, meta } = res.data;
            if (meta.status === 200) {
              //提示删除成功
              this.$message({
                message: meta.msg,
                type: "success"
              });
              // 重新渲染用户数据
              this.getUserList();
            } else {
              this.$message.error(meta.msg);
            }
          })
          .catch(() => {});
      });
    },
    // 修改用户状态
    changeSta(id, state) {
      // 发送设置状态请求
      this.$http
        .put(
          `users/${id}/state/${state}`,
          {},
          {
            // headers: {
            //   Authorization: localStorage.getItem("token")
            // }
          }
        )
        .then(res => {
          console.log(res.data);
          let { meta } = res.data;
          if (meta.status === 200) {
            //提示设置成功
            this.$message({
              message: meta.msg,
              type: "success"
            });
            // 重新渲染用户数据
            // this.getUserList();
          } else {
            this.$message.error(meta.msg);
          }
        });
    },
    // 获取下拉数据
    getOption() {
      this.$http
        .get("roles", {
          // headers: {
          //   Authorization: localStorage.getItem("token")
          // }
        })
        .then(res => {
          this.options = res.data.data;
        });
    },
    // 显示分配用户角色对话框并获得角色数据
    chanRole(id) {
      // 打开分配面板
      this.checkDialog = true;
      // 根据 id  获取用户信息
      this.$http
        .get(`users/${id}`, {
          // headers: {
          //   Authorization: localStorage.getItem("token")
          // }
        })
        .then(res => {
          let { data, meta } = res.data;
          console.log(data);
          if (meta.status === 200) {
            this.form = data;
          } else {
            this.$message.error(meta.msg);
          }
        });
    },
    // 修改用户角色
    postCheck() {
      this.$http
        .put(
          `users/${this.form.id}/role`,
          {
            rid: this.form.rid
          },
          {
            // headers: {
            //   Authorization: localStorage.getItem("token")
            // }
          }
        )
        .then(res => {
          let { meta, data } = res.data;
          if (meta.status === 200) {
            //提示修改成功
            this.$message({
              message: meta.msg,
              type: "success"
            });
            // 重新渲染用户数据
            this.getUserList();
            // 关闭分配角色面板
            this.checkDialog = false;
          } else {
            this.$message.error(meta.msg);
          }
        });
    }
  },
  mounted() {
    // 获取 users 中的数据
    this.getUserList();
    // 获取下拉框中的数据
    this.getOption();
  },
  components:{
    BreadNav
  }
};
</script>

<style scoped>
.searchRow {
  margin-top: 20px;
}

.table {
  margin-top: 20px;
}
</style>
