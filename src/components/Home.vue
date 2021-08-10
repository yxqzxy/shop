<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="" />
        <span>电商管理系统</span>
      </div>
      <el-button type="info" round @click="back">退出 </el-button>
    </el-header>
    <!-- 主题页面区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="widths">
        <!-- 侧边栏菜单区域 -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
      <el-menu
      :default-active="this.currentpath"
      background-color="#333744"
      text-color="#fff"
      active-text-color="skyblue"
      unique-opened
      :collapse="isCollpase"
      :collapse-transition='false'
      router
      >
      <!-- 这是一级菜单 -->
      <!-- index的值只接受字符串 -->
      <el-submenu :index=" ''+item.id"  v-for="item in menulist" :key="item.id">
        <!-- 一级菜单的模板 -->
        <template slot="title">
          <!-- 图标 -->
          <i :class="iconlist[item.id]"></i>
          <!-- 文本 -->
          <span>{{item.authName}}</span>
        </template>

        <!-- 二级菜单 -->
        <el-menu-item :index="'/'+subitem.path" v-for="subitem in item.children" :key="subitem.id" @click="savepath('/'+subitem.path)">
           <template slot="title">
          <!-- 图标 -->
          <i class="el-icon-menu"></i>
          <!-- 文本 -->
          <span>{{subitem.authName}}</span>
        </template>
        </el-menu-item>

      </el-submenu>

    </el-menu>
  </el-col>
</el-row></el-aside>
      <!-- 右侧内容主题 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getMenuitems } from '../network/home'
export default {
  created() {
    this.getMenusLists()
    this.currentpath = window.sessionStorage.getItem('activepath')
  },
  data() {
    return {
      menulist: [],
      iconlist: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian ',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao',
      },
      isCollpase: false,
      widths: '200px',
      currentpath: '',
    }
  },
  methods: {
    back() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    getMenusLists() {
      //获取左侧菜单的数据
      getMenuitems().then((res) => {
        if (res.meta.status != 200)
          return this.$Message.error('获取菜单数据失败')
        this.menulist = res.data
        return this.menulist
      })
    },
    toggleCollapse() {
      this.isCollpase = !this.isCollpase
      if (this.isCollpase) {
        this.widths = 60 + 'px'
      } else {
        this.widths = 200 + 'px'
      }
    },
    savepath(actincepath) {
      window.sessionStorage.setItem('activepath', actincepath)
      this.currentpath = actincepath
    },
  },
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
// 每一个组件的名称都是一个类名
.el-header {
  display: flex;
  justify-content: space-between;
  background-color: pink;
  padding-left: 0px;
  align-items: center;
  color: #fff;
  font-size: 20px;
}
.el-header img {
  width: 70px;
  height: 70px;
  vertical-align: middle;
}
.el-header span {
  line-height: 40px;
}
.el-aside {
  background-color: #333744;
  height: 100%;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #fff;
}
//i标签上有 iconfont的类
.iconfont {
  margin-right: 15px;
}
.toggle-button {
  background-color: #4a5064;
  font: size 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
}
</style>>
