<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- gutter的意思是列于列的间隙 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="query"
            clearable
            @clear="getUserLists"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserLists"
            >
            </el-button> </el-input
        ></el-col>
        <el-col :span="4">
          <!-- type的值是背景颜色 -->
          <el-button type="primary" @click="addDialogVisible = true">
            添加用户</el-button
          >
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="dataUsers" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="changeUserStatus(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template v-slot="scope">
            <!-- 修改用户信息框 -->
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除用户 -->
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="removeUser(scope.row.id)"
            ></el-button>
            <!-- 分配角色 -->
            <el-tooltip
              effect="dark"
              content="角色分配"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-star-off"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[1, 2, 3, 4, 5]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

      <!-- 添加用户的对话框 -->
      <el-dialog
        title="添加用户"
        @close="fromrest"
        :visible.sync="addDialogVisible"
        width="30%"
      >
        <!-- 内容主体区 -->
        <el-form
          :model="addForm"
          :rules="addFormrules"
          ref="ruleForm"
          label-width="100px"
          @close="isFiled"
        >
          <!-- 内部表单 -->
          <el-form-item label="用户名称" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="phonenum">
            <el-input v-model="addForm.phonenum"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改用户信息 -->
      <el-dialog title="修改用户信息" :visible.sync="editDialog" width="50%">
        <!-- 修改内容 -->
        <el-form
          :model="eidtFrom"
          :rules="addFormrules"
          ref="eidtFrom"
          label-width="100px"
        >
          <!-- 内部表单 -->
          <el-form-item label="用户名称" prop="username">
            <el-input v-model="eidtFrom.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="eidtFrom.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="eidtFrom.mobile"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialog = false">取 消</el-button>
          <el-button type="primary" @click="editUserFrom">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
  <!-- 搜索框 -->
</template>
  
<script>
import {
  getUserList,
  putUserStatus,
  putUserInfo,
  getUerId,
  editUserInfo,
  deleteUerId,
} from '../../network/home'
export default {
  data() {
    // 校验合法的邮箱格式
    let cheeckEmail = (rule, value, cb) => {
      const regEmail =
        /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
      if (regEmail.test(value)) return cb()

      cb(new Error('请输入合法的数值'))
    }
    // 校验合法的电话号码
    // 校验合法的邮箱格式
    let cheeckPhone = (rule, value, cb) => {
      const regEmail = /^1[3|4|5|7|8][0-9]{9}$/
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的电话号码'))
    }
    let cheeckmobile = (rule, value, cb) => {
      const regEmail = /^1[3|4|5|7|8][0-9]{9}$/
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的电话号码'))
    }
    return {
      query: '',
      // 当前的页数
      pagenum: 1,
      // 每页显示条数据
      pagesize: 2,
      dataUsers: [],
      total: 0,
      // 添加对话框的显示与隐藏
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        phonenum: '',
      },
      //添加表单验证规则对象
      addFormrules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6到 15个字符', trigger: 'blur' },
        ],
        email: [
          { required: true, message: '请输入邮箱名称', trigger: 'blur' },
          { validator: cheeckEmail, trigger: 'blur' },
        ],
        phonenum: [
          { required: true, message: '请输入11位电话号码', trigger: 'blur' },
          { validator: cheeckPhone, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入11位电话号码', trigger: 'blur' },
          { validator: cheeckmobile, trigger: 'blur' },
        ],
      },
      // 这是修改显示修改用户信息的
      editDialog: false,
      // 查询到的用户对象
      eidtFrom: {},
      //保存一下用户ID
      userId: '',
    }
  },
  created() {
    this.getUserLists()
  },
  methods: {
    getUserLists() {
      getUserList(this.query, this.pagenum, this.pagesize).then((res) => {
        if (res.meta.status != 200)
          return this.$message.console.error('用户获取失败')
        this.dataUsers = res.data.users
        this.total = res.data.total
      })
    },
    // 监听每页显示几条数据
    handleSizeChange(newsize) {
      this.pagesize = newsize
      this.getUserLists()
    },
    // 监听页码值改变数据
    handleCurrentChange(newPage) {
      this.pagenum = newPage
      this.getUserLists()
    },
    // 监听Swich状态的改变
    changeUserStatus(newstatus) {
      putUserStatus(newstatus.id, newstatus.mg_state).then((res) => {
        if (res.meta.status !== 200) {
          this.$message.error('用户状态修改失败')
          newstatus.mg_state = !newstatus.mg_state
        } else {
          this.$message.success('用户状态修改成功')
        }
      })
    },
    // 点击取消也就是关闭页面的时候就重置表单的内容
    fromrest() {
      this.$refs.ruleForm.resetFields()
    },
    addUser() {
      this.$refs.ruleForm.validate((res) => {
        if (!res) return
        //  若通过就可以发送真正的网络请求
        putUserInfo(
          this.addForm.username + '',
          this.addForm.passsword + '',
          this.addForm.email + '',
          this.addForm.phonenum + ''
        ).then((res) => {
          console.log(res.meta)
          if (res.meta.status != 201) return this.$message.error('用户添加失败')
          this.$message.success('用户添加成功')
          this.addDialogVisible = false
          // 重新获取用户列表
          this.getUserLists()
        })
      })
    },
    // 修改用户信息
    showEditDialog(id) {
      this.userId = id
      getUerId(id).then((res) => {
        if (res.meta.status != 200) {
          this.$message.error('用户查询失败')
        }
        this.editDialog = true
        this.eidtFrom = res.data
      })
    },
    //重置修改用户表单
    isFiled() {
      this.$refs.eidtFrom.resetFields()
    },
    // 表单验证后修改用户信息请求函数
    editUserFrom() {
      this.$refs.eidtFrom.validate((vaild) => {
        if (!vaild) return this.$message.error('表单初步验证修改失败')
        //若通过就发送请求
        editUserInfo(
          this.userId,
          this.eidtFrom.email,
          this.eidtFrom.mobile
        ).then((res) => {
          this.editDialog = false
          if (res.meta.status != 200) {
            this.$message.error('修改失败 ')
          }
          this.$message.success('修改成功')
          //重新获取用户列表
          this.getUserLists()
        })
      })
    },
    // 删除用户时的提示
    removeUser(userId) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deleteUerId(userId)
          this.$message.error('已删除')
          //重新刷新列表
          this.getUserLists()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
  },
}
</script>

    }
  },
}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 20px;
}
.el-pagination {
  margin-top: 15px;
}
</style>>
