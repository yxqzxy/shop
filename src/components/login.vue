<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 头像区域 -->
      <div class="avataar-box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登录表单区域 -->
      <el-form
        ref="loginFormRef"
        label-width="0px"
        class="login-form"
        :rules="loginFormRules"
        :model="loginForm"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-s-custom" v-model="loginForm.username">
          </el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            type="password"
            prefix-icon="el-icon-lock"
            v-model="loginForm.password"
          >
          </el-input>
        </el-form-item>
        <!--按钮区域  -->
        <el-form-item class="btns">
          <!-- 登录 -->
          <el-button type="primary" @click="login">登录</el-button>
          <!-- 重置 -->
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getHomeGoods } from '../network/home'
export default {
  data() {
    return {
      // 这是表单对应的数据绑定对象
      loginForm: {
        password: '123456',
        username: 'admin',
      },
      //这是表演的验证规则
      loginFormRules: {
        //验证用户名是否合法
        username: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
        ],
        //验证密码是否合法
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      this.$refs.loginFormRef.validate((vaild) => {
        if (!vaild) return
        getHomeGoods(this.loginForm)
          .then((res) => {
            if (res.meta.status !== 200) return this.$message.error('登陆失败')
            this.$message.success('登录成功')
            //登录之后的token保存到客服端的 sessionStorage中
            //项目中出现了登录之外的其他API接口，必须在登录之后才能访问
            //token只应在当前网站打开期间生效，所以将token保存在sessionStorage
            window.sessionStorage.setItem('token', res.data.token)
            //跳转到home主页
            this.$router.push('/home')
          })
          .catch((err) => {
            console.log(err)
          })
      })
    },
  },
}
</script>

<style lang="less" scoped>
.login-container {
  background-color: #2b4b6b;
  height: 100%;
}
.login-box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .avataar-box {
    height: 130px;
    width: 130px;
    border-radius: 50%;
    box-shadow: 0 0 10px #ddd;
    padding: 10px;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
  .btns {
    display: flex;
    justify-content: flex-end;
  }
  .login-form {
    position: absolute;
    bottom: 0px;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
}
</style>>

