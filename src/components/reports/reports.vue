<template>
  <div>
    <!-- 面包屑导航 -->
    <BreadNav :navTitle="'权限管理'" :navContent="'角色列表'"/>
    <div id="main" style="width:800px;height:400px"></div>
  </div>
</template>

<script>
// 引入图形化方法 echarts
import echarts from "echarts";
import BreadNav from '../layout/breadnav/breadnav.vue'

export default {
  async mounted() {
    // 基于准备好的dom,初始化echarts实例
    var myChart = echarts.init(document.getElementById("main"));
    // 动态获取数据
    let res = await this.$http.get(`reports/type/1`);
    let { meta, data } = res.data;
    var option = {
      title: {
        text: "销售数据统计"
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#6a7985"
          }
        }
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true
      }
    };
    // 合并对象
    option = {
      ...option,
      ...data
    };
    // 设置x轴的结构
    option.xAxis[0].type = "category";
    option.xAxis[0].boundaryGap = false;
    // 设置选项
    myChart.setOption(option);
  },
  components:{
      BreadNav
  }
};
</script>

<style scoped>
#main{
    margin-top: 20px;
}
</style>
