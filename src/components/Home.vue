<template>
  <el-container class="home-container">
    <!--头部区-->
    <el-header>
      <div>
        <img src="../assets/login.png" alt="">
        <span>问卷后台管理系统</span>
      </div>

      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!--页面主体区-->
    <el-container>
      <!--侧边栏-->
      <el-aside :width="isCollapse ? '64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!--侧边栏菜单-->
        <el-menu background-color="#3A3F4C" text-color="#fff" active-text-color="#4388EA"
                 unique-opened :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath">
          <!--一级菜单-->
          <el-submenu :index="item.id+ ''" v-for="item in menulist" :key="item.id">
            <!--一级菜单的模版-->
            <template slot="title">
              <!--图标-->
              <i :class="icosObject[item.id]"></i>
              <!--文本-->
              <span>{{item.authName}}</span>
            </template>
            <!--二级菜单-->
            <el-menu-item :index="'/' + subItem.subMenuPath" v-for="subItem in item.childrenMenu" :key="subItem.id"
                          @click="saveNavState('/' + subItem.subMenuPath)">
              <template slot="title">
                <!--图标-->
                <i class="el-icon-menu"></i>
                <!--文本-->
                <span>{{subItem.subMenuName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--右侧主题内容-->
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    name: "Home",
    created() {
      this.getMenuList()
      // home组件被创建时赋值
      this.activePath = window.sessionStorage.getItem('activePath')
    },
    data() {
      return {
        menulist: [],
        icosObject: {
          1:'iconfont icon-baobiao',
          2:'iconfont icon-wenjuantiaocha',
          3:'iconfont icon-wenti-',
          4:'iconfont icon-dibudaohanglan-',
          5:'iconfont icon-xueshengguanli'
        },
        // 是否折叠
        isCollapse: false,
        // 被激活的链接地址
        activePath: '',
      }
    },
    methods: {
      logout() {
        // 清空session
        window.sessionStorage.clear();
        // 重定向到登录页
        this.$router.push("/login")
      },
      // 获取所有的菜单
      async getMenuList() {
        const {data: res} = await this.$http.get('/menu/list')
        // console.log(res);
        if (res.code != 200) return this.$message.error(res.message);
        this.menulist = res.data.sort(this.compare("id"))
      },
      // 定义比较函数
      compare(p) {
        return function (m, n) {
          let a = m[p];
          let b = n[p];
          return a - b; // 升序
        }
      },
      toggleCollapse(){
          this.isCollapse = !this.isCollapse;
      },
      // 保存链接的激活状态
      saveNavState(activePath){
        window.sessionStorage.setItem('activePath',activePath)
        this.activePath = activePath
      },
    }
  }

</script>

<style lang="less" scoped>
  .home-container {
    height: 100%;
  }

  /*elementUi会自动将el-head写入head的class属性中*/
  .el-header {
    background-color: #3F4648;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #FFFFFF;
    font-size: 20px;

    > div {
      display: flex;
      align-items: center;

      span {
        margin-left: 15px;
      }

      img {
        width: 60px;
        height: 60px;
      }
    }
  }

  .el-aside {
    background-color: #3A3F4C;
    .el-menu{
      border-right: 0;
    }
  }

  .el-main {
    background-color: #ECF0F2;
  }
  .iconfont{
    margin-right: 10px;
  }

  .toggle-button{
    background-color: #535C6B;
    font-size: 10px;
    line-height: 24px;
    color: #FFFFFF;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }

</style>