<template>
  <div>
    <div class="logo">
      <img src="../../../static/logo3.png" alt width="300px" height="200" />
    </div>
    <div class="loginbox">
      <!-- 
        el-form: 这个组件中的内容都是表单元素
            :model: 绑定属性
            status-icon: 状态图标
            :rule: 添加验证规则
            ref: 在 vue 中可以通过 this.$refs 来操作 dom元素
            label-width: 文本宽度
        el-form-item: 表单中的表单元素
            label: 当前元素显示的文本
            prop: 设置验证规则
        el-input: input元素
            type: 类型
            v-model: 双向绑定的数据
            autocomplete: 自动补全(h5)
      -->
      <el-form
        :model="ruleForm"
        status-icon
        ref="ruleForm"
        label-width="100px"
        label-position="top"
        class="demo-ruleForm"
        :rules="rules"
      >
        <h3>用户登录</h3>
        <el-form-item label="用户名" prop="username">
          <el-input type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="btn" type="primary" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 用户对象
      ruleForm: {
        username: "",
        password: ""
      },
      // 验证规则
      rules: {
        username: [
          // 这个属性是必须的，如果没有提示message，当失去焦点时触发
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        password: [
          // 这个属性是必须的，如果没有提示message，当失去焦点时触发
          { required: true, message: "请输入用户密码", trigger: "blur" },
          { min: 3, max: 12, message: "长度在 3 到 12 个字符", trigger: "blur" }
        ]
      }
    };
  },
  // 点击验证
  methods: {
    login() {
      // 判断 form 中的元素是否满足验证条件
      this.$refs.ruleForm.validate(valid => {
        // valid boolean值，如果通过返回 true，如果失败返回false
        if (valid) {
          // 发送登录请求
          this.$http.post("login", this.ruleForm).then(res => {
            // 解构参数
            // console.log(res);
            // console.log(res.data);
            let { data, meta } = res.data;
            // 判断状态
            if (meta.status === 200) {
              //提示登录成功
              this.$message({
                message: meta.msg,
                type: "success"
              });
              // 将登陆的token保存到浏览器的 localStorage 中
              localStorage.setItem("token", res.data.data.token);
              // 登录成功后跳转到首页
              this.$router.push("/home");
            } else {
              this.$message.error(meta.msg);
            }
          });
          // console.log(this.$http);  //打印了一个wrap()函数
        } else {
          this.$message.error("请输入正确的用户名和密码");
          return false;
        }
      });
    }
  }
};
</script>
<!-- scoped: 该属性设置的样式不影响别的组件中的样式 -->
<style scoped>
.logo {
  position: absolute;
  left: 50%;
  margin-left: -150px;
}

.loginbox {
  width: 500px;
  padding: 40px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border-radius: 10px;
}
.loginbox .btn {
  width: 100%;
}
</style>
