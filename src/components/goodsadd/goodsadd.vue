<template>
  <div>
    <el-card>
      <!-- 面包屑 -->
      <BreadNav :navTitle="'商品管理'" :navContent="'商品列表'"/>
      <!-- 消息提示框 -->
      <el-alert title="添加商品信息" type="info" center show-icon class="alert"></el-alert>
      <!-- 步骤条 -->
      <el-steps align-center :active="active" finish-status="success" class="steps">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
      </el-steps>
      <!-- 标签栏 -->
      <el-tabs tabPosition="left" class="tabs" @tab-click="tabclick">
        <el-tab-pane label="基本信息" name="first">
          <el-form :label-position="'top'" :rules="rules" label-width="80px" :model="addObj">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addObj.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_name">
              <el-input v-model="addObj.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_name">
              <el-input v-model="addObj.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_name">
              <el-input v-model="addObj.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              {{ cateSelect }}
              <el-cascader v-model="cateSelect" :options="cateList" :props="cateObj"></el-cascader>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="second">
          <div class="mydiv" v-for="(item,index1) in manyparams" :key="index1">
            <h4>{{ item.attr_name }}</h4>
            <div class="myitem">
              <el-checkbox
                v-model="checked"
                border
                v-for="(val,index2) in item.attr_vals.split(',')"
                :key="index2"
              >{{ val }}</el-checkbox>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="third">
          <div class="mydiv" v-for="(item,index) in onlyparams" :key="index">
            <h4>{{ item.attr_name }}</h4>
            <el-input v-model="item.attr_vals" placeholder="请输入内容"></el-input>
          </div>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="fourth">
          <!-- 图片上传框 -->
          <!-- file-list: 上传文件列表集合 -->
          <el-upload
            class="upload-demo"
            action="http://localhost:8888/api/private/v1/upload"
            :on-preview="preview"
            :on-remove="remove"
            :on-success="uploadSuccess"
            :file-list="fileList"
            :headers="uploadHead"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
          {{ fileList }}
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="fifth">
          <el-button @click="addGoods">添加商品</el-button>
          <quill-editor v-model="content" class="editor"></quill-editor>
        </el-tab-pane>
      </el-tabs>
      <!-- 点击图片预览时的对话框 -->
      <el-dialog title="图片预览" :visible.sync="dialogImg">
        <img ref="myImg">
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogImg = false">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import BreadNav from "../layout/breadnav/breadnav.vue";
export default {
  data() {
    return {
      active: 0, // 步骤条的标识
      addObj: {
        // 添加对象的属性
        goods_name: "",
        goods_price: "",
        goods_weight: "",
        goods_number: ""
      },
      rules: {
        // 验证规则
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ]
      },
      cateList: [], // 分类框中的数据源
      cateObj: {
        // 控制级联框显示的文本
        value: "cat_id", // 当前选项对应的值
        label: "cat_name" // 显示的文本
      },
      cateSelect: [], // 当前级联框选中的数据
      manyparams: [], // 动态参数（商品参数）
      onlyparams: [], // 静态参数 （商品属性）
      checked: true, // 默认选中多选框
      fileList: [], // 文件上传列表的集合
      uploadHead: {
        Authorization: localStorage.getItem("token")
      }, // 上传的请求头
      dialogImg: false, // 图片预览的对话框默认隐藏
      content: ""
    };
  },
  components: {
    BreadNav
  },
  methods: {
    // 给tab选项卡添加事件
    tabclick(tab, event) {
      this.active = +tab.index;
      // 判断是否点击了商品参数&商品分类
      if (tab.index === "1" || tab.index === "2") {
        // 判断分类中是否选择了数据：只需要判断它的数组长度
        if (this.cateSelect.length == 0) {
          this.$message.error("请选择商品分类");
          return;
        }
        // 获取分类的参数
        this.getCateParams(tab.index);
      }
    },
    // 得到所有的分类数据
    async getCateList() {
      let res = await this.$http.get(`categories?type=3`);
      // 解构
      let { meta, data } = res.data;
      // 判断
      if (meta.status === 200) {
        this.cateList = data;
      } else {
        this.$message.error(meta.msg);
      }
    },
    // 封装一个方法用来获取分类的参数
    async getCateParams(index) {
      // 得到分类的id
      let id = this.cateSelect[this.cateSelect.length - 1];
      // 设置一个参数用来判断当前点击的是商品参数还是商品属性
      let sel = index === "1" ? "many" : "only";
      // 根据选中的参数分类去加载商品参数
      var res = await this.$http.get(`categories/${id}/attributes?sel=${sel}`);
      // 解构
      let { meta, data } = res.data;
      // 判断
      if (meta.status === 200) {
        if (index === "1") {
          // 给商品参数赋值
          this.manyparams = data;
        } else {
          this.onlyparams = data;
        }
      } else {
        this.$message.error(meta.msg);
      }
    },
    // 图片上传成功进执行的函数
    uploadSuccess(res, file, fileList) {
      // 将上传成功的图片保存到 fileList 中
      // res: 服务器响应回来的数据
      // tmp_path: 生成的图片的名称
      // url: 上传后图片所在的服务器的路径
      // file: 本次上传文件信息(包含了 res)
      // fileList: 上传的所有文件信息(包含了 file)
      this.fileList.push({
        name: res.data.tmp_path,
        url: res.data.url
      });
    },
    // 删除图片时触发
    remove(file, fileList) {
      // 通过 file 中的属性去删除 fileList 中的数据
      for (var i = 0; i < this.fileList.length; i++) {
        console.log(file);
        if (this.fileList[i].name === file.name) {
          this.fileList.splice(i, 1);
        }
      }
    },
    // 图片预览的方法
    preview(file) {
      // 打开图片预览对话框
      this.dialogImg = true;
      // 是通过 demo 去操作 vue 的页面(页面不会有响应式的效果)
      // 解决方法:1) 将 src中的图片数据放到data中
      //         2) 等页面重新渲染时我们才执行这个 demo 操作
      this.$nextTick(function() {
        this.$refs.myImg.src = file.url;
      });
    },
    // 提交新增的数据
    async addGoods() {
      // 准备提交的数据
      let addObjs = {
        goods_name: this.addObj.goods_name,
        goods_price: this.addObj.goods_price,
        goods_weight: this.addObj.goods_weight,
        goods_number: this.addObj.goods_number,
        goods_cat: this.cateSelect.join(","), //商品分类(一级，二级，三级)
        goods_introduce: this.content // 商品介绍
      };
      // console.log(addObjs);
      // 发送请求
      let res = await this.$http.post("goods", addObjs);
      let { meta } = res.data;
      if (meta.status === 201) {
        this.$message({
          type: "success",
          message: meta.msg
        });
        // 成功后跳转回商品列表
        this.$router.push("/goods");
      } else {
        this.$message.error(meta.msg);
      }
    }
  },
  mounted() {
    this.getCateList();
  }
};
</script>

<style lang="scss">
$height: 20px;

.alert,
.steps,
.tabs,
.editor {
  margin-top: $height;
}

.el-step__title {
  font-size: 12px !important;
}

.mydiv,
h4 {
  font-weight: 400;
  font-size: 14px;
}
.ql-editor {
  height: 300px;
}
</style>
