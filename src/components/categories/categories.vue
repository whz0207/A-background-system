<template>
  <div>
    <!-- 卡片 -->
    <el-card>
      <!-- 面包屑 -->
      <BreadNav :navTitle="'商品管理'" :navContent="'商品分类'"/>
      <!-- 按钮 -->
      <el-button class="addCate" type="success" plain>添加分类</el-button>
      <!-- 表格 -->
      <el-table :data="pageList" style="width: 100%" :border="true" class="CateTable">
        <el-table-tree-column
          file-icon="icon icon-file"
          folder-icon="icon icon-folder"
          prop="cat_name"
          treeKey="cat_id"
          parentKey="cat_pid"
          levelKey="cat_level"
          label="分类名称"
        ></el-table-tree-column>
        <el-table-column label="级别">
          <template
            slot-scope="scope"
          >{{ scope.row.cat_level === 0 ? '一级' :(scope.row.cat_level === 1 ? '二级': '三级') }}</template>
        </el-table-column>
        <el-table-column label="是否有效">
          <template slot-scope="scope">{{ scope.row.cat_deleted ? '无效' : '有效' }}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button type="primary" icon="el-icon-edit" plain size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" plain size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <!-- 
        el-pagination: 分页组件
      -->
      <el-pagination
        @size-change="sizeChange"
        @current-change="currentChange"
        :current-page="currentPage"
        :page-sizes="pagesizes"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import BreadNav from "../layout/breadnav/breadnav.vue";

export default {
  data() {
    return {
      CateList: [], // 数据源
      total: 0, // 数据的总条数
      pageList: [], // 页数
      pagesize:5, //页容量
      pagesizes:[5,10,15], // 所有可选的页容量
      currentPage:1 // 当前页
    };
  },
  components: {
    BreadNav
  },
  methods: {
    async getCateList() {
      // 获取所有的分类数据
      let res = await this.$http.get(`categories?type=3`);
      // 解构赋值
      let { meta, data } = res.data;
      if (meta.status === 200) {
        this.CateList = data;
        // 得到数据的总条数
        this.total = data.length
        // 第一次得到分页数据
        this.getPageList()
      } else {
        this.$message.error(meta.msg);
      }
    },
    // 当当前页发生改变时，触发
    currentChange(val){
      // val 改变后的当前页
      this.currentPage = val
      // 重新获取分页数据
      this.getPageList()
    },
    // 得到分页数据源
    getPageList(){
      // 计算开始和结束的数据
      let start = (this.currentPage - 1)* this.pagesize
      let end = this.currentPage * this.pagesize
      console.log(this.CateList,start,end);
      // 得到数据源
      this.pageList = this.CateList.slice(start,end)
    },
    // 当页容量发生改变时，触发
    sizeChange(val){
      // val 页容量改变后的值
      this.pagesize = val
      // 重新请求数据
      this.getPageList()
    }
  },
  mounted() {
    this.getCateList();
  }
};
</script>

<style scoped>
.addCate {
  margin-top: 20px;
}
.CateTable {
  margin-top: 20px;
}
</style>
