import BreadNav from '../layout/breadnav/breadnav.vue'

export default {
    data() {
        return {
            commonList: [], //所有商品数据
            search: '',
            currentPage: 1, // 当前页
            pageSize: 10, // 每页容量
            total: 0, // 总数据量
            pagesizes: [10,20,30,40,50] // 所有可选的页容量

        }
    },
    components: {
        BreadNav
    },
    methods: {
        // 获取所有商品数据
        async getCommonList() {
            let res = await this.$http.get(`goods?pagenum=${this.currentPage}&pagesize=${this.pageSize}&query=${this.search}`)
            let { meta, data } = res.data
            if (meta.status === 200) {
                this.total = data.total
                this.commonList = data.goods
            } else {
                this.$message.error(meta.msg)
            }
        },
        // 当当前页发生改变时，触发
        currentChange(val){
            this.currentPage = val
            this.getCommonList()
        },
        // 当分页数据发生改变时，触发
        sizeChange(val){
            this.pageSize = val
            this.getCommonList()
        },
        // 搜索数据
        searchCommon(){
            this.getCommonList()
        },
        // 跳转到添加商品
        toAdd(){
            this.$router.push('/goods/add')
        }
    },
    mounted() {
        this.getCommonList()
    }
}