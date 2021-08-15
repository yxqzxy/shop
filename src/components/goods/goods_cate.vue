<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <!-- 添加按键 -->
        <el-col>
          <el-button type="primary" @click="addQuerydialogVisible">
            添加分类
          </el-button>
        </el-col>
        <!-- 表格区域 -->
        <tree-table
          :data="goodscate"
          :columns="columns"
          :selection-type="false"
          :expand-type="false"
          show-index
          index-text="#"
        >
          <template v-slot:isok="scope">
            <div class="hightgreen" v-if="scope.row.is_promote == false">
              <i class="el-icon-success"></i>
            </div>
            <div v-else><i class="el-icon-error,red"></i></div>
          </template>

          <!-- 排序 -->
          <template v-slot:order="scope">
            <el-tag type="pirmary" sizi="mini" v-if="scope.row.hot_mumber == 0">
              一级
            </el-tag>
            <el-tag type="warning" sizi="mini" v-if="scope.row.hot_mumber == 1">
              二级
            </el-tag>
            <el-tag type="danger" sizi="mini" v-if="scope.row.hot_mumber == 2">
              三级
            </el-tag>
          </template>
          <!-- 操作 -->
          <template v-slot:opt="scope">
            <el-button type="primary" icon="el-icon-eidt">搜索</el-button>
            <el-button type="danger" icon="el-icon-delete">删除</el-button>
          </template>
        </tree-table>

        <!-- 页面栏区域 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 4, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-row>

      <!-- 添加分类对话框 -->
      <el-dialog title="添加分类" :visible.sync="addQueryInfo" width="30%">
        <el-form
          :model="addCateForm"
          status-icon
          :rules="addCateFromRules"
          ref="addCateFormRef"
          label-width="100px"
        >
          <el-form-item label="分类名称" prop="cate_name">
            <el-input v-model="addCateForm.cate_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类" prop="cate_name">
            <el-cascader
              expand-trigger="hover"
              v-model="selectKeys"
              :options="this.parentList"
              :props="expandTrigger"
              @change="handelChange"
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addQueryInfo = false">
            取消
          </el-button>
          <el-button @click="sureQuerydialogVisible(addCateForm)">
            确定
          </el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getGoodsCateList, addCategories } from '../../network/home'
export default {
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      goodscate: [],
      // 总数据条数
      total: 0,
      // 为table指定列的定义
      columns: [
        {
          label: ' 分类名称',
          prop: 'goods_name',
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok',
        },
        {
          label: '排序',
          type: 'template',
          template: 'order',
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt',
        },
      ],
      selectKeys: [],
      expandTrigger: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      parentList: [],
      // 添加分类对话框
      addQueryInfo: false,
      // 添加分类列表
      addCateForm: {
        cate_pid: 0,
        cate_name: '',
        cat_level: 0,
      },
      addCateFromRules: {
        cate_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
        ],
        checkPass: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getGoodsCate()
  },
  methods: {
    // 获取商品列表
    getGoodsCate() {
      getGoodsCateList(
        this.queryInfo.type,
        this.queryInfo.pagenum,
        this.queryInfo.pagesize
      ).then((res) => {
        if (res.meta.status != 200) {
          return this.$message.error('获取数据列表错误')
        }
        this.goodscate = res.data.goods
        this.total = res.data.total
      })
    },
    // 监听pagesize的变化
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsCate()
    },
    // 监听pagenum的变化
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsCate()
    },
    //添加分类
    addQuerydialogVisible(addCateForm) {
      this.QuerydialogVisible(addCateForm)
      this.addQueryInfo = true
    },
    // 确定添加
    QuerydialogVisible(addCateForm) {
      addCategories(
        addCateForm.cate_pid,
        addCateForm.cate_name,
        addCateForm.cat_level
      ).then((res) => {
        console.log(res.data)
        this.parentList = res.data
      })
    },
    handelChange() {},
    sureQuerydialogVisible() {
      this.addQueryInfo = false
    },
  },
}
</script>

<style lang="less" scoped>
.hightgreen {
  color: lightgreen;
}
.hightred {
  color: red;
}
</style>>

