<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 添加角色区域 -->
      <el-row>
        <el-col
          ><el-button type="primary" @click="addrolesDialog = true"
            >添加角色</el-button
          ></el-col
        >
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="roleslist">
        <el-table-column type="expand">
        <template v-slot="scope">
          <!-- 栅格系统布局 分为24行-->
        <el-row v-for="(item1,index) in scope.row.children" :class="['vcen','bdbottom',index===0?'bdtop':'']"> 

          <!-- 一级权限 -->
         <el-col :span="5" >
           <el-tag  @close="removeRight(scope.row,item1.id)" closable>{{item1.authName}}</el-tag>
           <i class="el-icon-caret-right"></i>
         </el-col>
           <!-- 一级权限 -->
         <!-- 渲染二级权限和三级权限start -->
        <el-col :span="19">
          <!-- 渲染二级start -->
          <el-row v-for="(item2,index2) in item1.children" :class="['vcen',index2===0? '':'bdtop']" >
            <el-col :span="6">
                <el-tag type="success" @close="removeRight(scope.row,item2.id)" closable>{{item2.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
            </el-col>
            <el-col :span="18">
              <!-- 渲染三级s-->
                <el-tag   v-for="(item3,index3) in item2.children" type="warning" @close="removeRight(scope.row,item3.id)" closable>{{item3.authName}}</el-tag>
                <!-- 渲染三级e-->
            </el-col>
          </el-row>
           <!-- 渲染二级end -->
        </el-col>
         <!-- 渲染二级权限和三级权限end -->       
        </el-row>
        </template>
       </el-table-column>
        <!-- 索引值 -->
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-search" size="mini" @click="getRolesIDs(scope.row.id)">
              编辑
            </el-button>
            <el-button type="danger" size="mini" icon="el-icon-delece" @click="deleteRoles(scope.row.id)">
              删除
            </el-button>
            <el-button type="warning" size="mini" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">
              分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加 -->
      <el-dialog title="添加角色" @close="restAddFrom" :visible.sync="addrolesDialog" width="50%">
        <el-form
          :model="addroles"
          :rules="addrolesrules"
          ref="addrolesruless"
          label-width="100px"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addroles.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addroles.roleDesc"></el-input>
          </el-form-item>
           </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="addrolesDialog=false">取 消</el-button>
          <el-button type="primary" @click="getaddroles">确 定</el-button>
        </span>
        </el-form>
      </el-dialog>
      <!-- 修改角色-->
       <el-dialog title="添加角色" :visible.sync="eidtrolesDialog" width="50%" @close="restEditFrom">
        <el-form
          :model="editroles"
          :rules="editrolesrules"
          ref="editrolesrules"
          label-width="100px"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editroles.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editroles.roleDesc"></el-input>
          </el-form-item>
           </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="editrolesDialog=false">取 消</el-button>
          <el-button type="primary" @click="putRolesInfo">确 定</el-button>
        </span>
        </el-form>
      </el-dialog>
       <!-- 修改角色-->
      
      <!-- 分配权限 -->
        <el-dialog title="分配权限"
         :visible.sync="showSetdialogVisible"
         width="50%">
         <!-- 树形控件-->
          <el-tree :data="rightList"
           :props="treeProps"
           show-checkbox 
           node-key="id"
           :default-expand-all=true
           :default-checked-keys="keyID"
           ref="treeRef"
          ></el-tree>

          <span slot="footer" class="dialog-footer">
         <el-button @click="showSetdialogVisible = false">取 消</el-button>
         <el-button type="primary" @click="allotRights">确 定</el-button>
         </span>
        </el-dialog>
      
    </el-card>
  </div>
</template>

<script>
import {
  getRoles,
  addroless,
  getRolesID,
  putRoles,
  deleteRolesList,
  deleteRolesRight,
  showSetRightVisiable,
  pushRolesRight,
} from '../../network/home'
export default {
  data() {
    return {
      roleslist: [],
      addroles: {
        Id: '',
        roleName: '',
        roleDesc: '',
      },
      editroles: {
        Id: '',
        roleName: '',
        roleDesc: '',
      },
      // 树形控件显示
      showSetdialogVisible: false,
      // 添加角色规则
      addrolesrules: {
        roleName: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur' },
        ],
        roleDesc: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6到 15个字符', trigger: 'blur' },
        ],
      },
      //修改角色信息
      editrolesrules: {
        roleName: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur' },
        ],
        roleDesc: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6到 15个字符', trigger: 'blur' },
        ],
      },
      //显示dialog
      addrolesDialog: false,
      eidtrolesDialog: false,
      // 所有权限的数据
      rightList: [],
      // 树形控件数据
      treeProps: {
        label: 'authName',
        children: 'children',
      },
      //默认节点选中ID
      keyID: [105, 116],

      // 点击角色匹配时保存用户ID
      rolesRightID: '',
    }
  },
  created() {
    this.getroleslist()
  },
  methods: {
    getroleslist() {
      getRoles().then((res) => {
        if (res.meta.status == 200) {
          this.roleslist = res.data
        }
      })
    },
    // 添加用户
    getaddroles() {
      this.$refs.addrolesruless.validate((vaild) => {
        if (!vaild) return this.$message.error('表单初步验证修改失败')
        //若通过就发送请求
        addroless(this.addroles.roleName, this.addroles.roleDesc).then(
          (res) => {
            this.addrolesDialog = false
            if (res.meta.status != 200) {
              this.$message.error('修改失败 ')
            }
            this.$message.success('修改成功')
            this.addroles.roleName = null
            //重新加载
            this.getroleslist()
            return
          }
        )
      })
    },
    //根据角色ID查询角色
    getRolesIDs(id) {
      getRolesID(id).then((res) => {
        if (res.meta.status == 200) {
          this.editroles.Id = id
          this.editroles.roleName = res.data.roleName
          this.editroles.roleDesc = res.data.roleDesc
          this.eidtrolesDialog = true
        } else {
          this.$message.error('用户查询失败')
        }
      })
    },
    // 重置表单结果
    restAddFrom() {
      this.$refs.addrolesruless.resetFields()
    },
    restEditFrom() {
      this.$refs.editrolesrules.resetFields()
    },
    // 修改用户信息
    putRolesInfo() {
      putRoles(
        this.editroles.Id,
        this.editroles.roleName,
        this.editroles.roleDesc
      ).then((res) => {
        if (res.meta.status == 200) {
          this.$message.success('信息修改成功')
        } else {
          this.$message.error('信息修改失败')
        }
        this.eidtrolesDialog = false
        //重新加载
        this.getroleslist()
        return
      })
    },
    // 删除用户
    deleteRoles(Id) {
      deleteRolesList(Id).then((res) => {
        if (res.meta.status == 200) {
          this.$message.success('信息删除成功')
        } else {
          this.$message.error('信息删除失败')
        }
        //重新加载
        this.getroleslist()
        return
      })
    },
    removeRight(roles, rightID) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deleteRolesRight(roles.id, rightID).then((res) => {
            if (res.meta.status == 200) {
              this.$message.success('删除成功')
              // this.getroleslist()
              // 相当于刷新了一下
              roles.children = res.data
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    // 获取所有的权限
    showSetRightDialog(roles) {
      showSetRightVisiable().then((res) => {
        if (res.meta.status != 200) {
          this.$message.error('获取权限失败')
        }
        // 每次打开始都清空这个数组
        this.keyID = []
        this.getRolesThree(roles, this.keyID)
        this.rightList = res.data
      })
      this.rolesRightID = roles.id
      this.showSetdialogVisible = true
    },

    // 定义一个递归来获取所有本条拥有的所有id

    getRolesThree(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach((element) => {
        this.getRolesThree(element, arr)
      })
    },

    //  获取我们要选中的权限并添加
    allotRights() {
      let keys = [
        ...this.$refs.treeRef.getHalfCheckedKeys(),
        ...this.$refs.treeRef.getCheckedKeys(),
      ]
      let keyid = keys.join(',')
      pushRolesRight(this.rolesRightID, keyid).then((res) => {
        if (res.meta.status != 200) {
          this.$message.error('角色权限添加失败')
        }
        this.$message.success('角色权限添加成功')
      })
      this.showSetdialogVisible = false
      this.getroleslist()
    },
  },
}
</script>

<style lang="less" scoped>
.el-tag {
  margin-top: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcen {
  display: flex;
  align-items: center;
}
</style>>
