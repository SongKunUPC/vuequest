<template>
  <div class="login_container">
    <div class="login_box">
      <!--头像区-->
      <div class="avatar_box">
        <img src="../assets/login.png" alt="">
      </div>
      <!--登录表单区-->
      <!--ref:表示引用对象，方便方法引用-->
      <el-form class="login_form" ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
        <!--用户名-->
        <!--prop 指定验证规则-->
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-yonghu" v-model="loginForm.username"></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <el-input prefix-icon="iconfont icon-mima" v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <!--按钮区-->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Login",
    data() {
      return {
        // 登录表单的绑定对象
        loginForm: {
          username: 'songkun',
          password: '09022066'
        },
        loginFormRules: {
          // 验证用户名是否合法
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur'}
          ],
          // 验证密码是否合法
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 15, message: '密码长度在 6 到 15 个字符', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      // 点击重置登录表单数据
      resetLoginForm() {
        // this.$refs.loginFormRef获取表单的引用对象
        this.$refs.loginFormRef.resetFields()
      },
      login() {
        // async关键字放在函数前将其转换为异步函数,可以和await关键字结合
        // 异步函数会返回一个promise
        // await 暂停代码，直达promise完成，不会再到处使用then()代码块
        this.$refs.loginFormRef.validate(async valid => {
          // 当数据合法时，valid形参为true
          // 当为false时，直接返回不发请求
          if(!valid) return;
          // 默认发送的数据格式是application/json格式，只能通过@RequestBody进行接收
          // {data: res}:将数据结构，将其中的data命名为res
          const {data: res} = await this.$http.post('admin/login',this.loginForm);
          if(res.code!==200)  return this.$message.error('登录失败');
          this.$message.success('登录成功');
          console.log(res);
          // 在sessionStorage中存储token
          window.sessionStorage.setItem('token',res.data.token);
          // 编程式导航定向到/home
          this.$router.push('/home')
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .login_container {
    background-color: #2b4b6b;
    height: 100%;
  }

  .login_box {
    width: 400px;
    height: 300px;
    background-color: #FFF;
    /*原角边框*/
    border-radius: 3px;
    /*放置正中间*/
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    /*less语法嵌套*/

    .avatar_box {
      height: 120px;
      width: 120px;
      /*边框线*/
      border: 1px solid #eee;
      border-radius: 50%;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #FFF;
      /*内间距*/
      padding: 10px;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }

  .btns {
    /*居右对齐*/
    display: flex;
    justify-content: flex-end;
  }

  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 50px;
    box-sizing: border-box;
  }
</style>