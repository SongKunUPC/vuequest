<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>学校管理</el-breadcrumb-item>
      <el-breadcrumb-item>学校列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区-->
    <el-card>
      <!--搜索与添加区-->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getSchoolList">
            <el-button slot="append" icon="el-icon-search" @click="getSchoolList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true">添加学校</el-button>
        </el-col>
      </el-row>
      <!--学校列表区域-->
      <el-table :data="schoolList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="学校id" prop="id"></el-table-column>
        <el-table-column label="学校名称" prop="schoolName"></el-table-column>
        <el-table-column label="区域" prop="district"></el-table-column>
        <el-table-column label="性质" prop="propertyDef"></el-table-column>
        <el-table-column label="状态">
          <!--作用域插槽-->
          <!--作用插槽v-slot:default="table"：接收名为default的插槽的数据并命名为table-->
          <template v-slot:="table">
            <!--el-switch 接收一个boolean值-->
            <el-switch v-model="table.row.state" @change="SchoolStateChange(table.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template v-slot:="table">
            <el-button type="primary" icon="el-icon-edit" circle size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" circle size="mini"></el-button>
            <!--提示文字-->
            <el-tooltip effect="dark" content="学校权限" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" circle size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页区域-->
      <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pageNum"
              :page-sizes="[2, 5, 10, 15]"
              :page-size="queryInfo.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
      </el-pagination>
    </el-card>
    <!--添加学校的对话框-->
    <el-dialog title="添加学校" :visible.sync="dialogVisible" width="50%">
      <!--内容主题区-->
      <!--学校名称-->
      <el-form ref="form" :model="addForm" label-width="80px" :rules="addFormRules">
        <!--学校名称-->
        <el-form-item label="学校名称" prop="schoolName">
          <el-input v-model="addForm.schoolName"></el-input>
        </el-form-item>
        <!--所在区域-->
        <el-form-item label="所在区域" prop="district">
          <el-input v-model="addForm.district"></el-input>
        </el-form-item>
        <!--从属-->
        <el-form-item label="从属市区教育局">
          <el-input v-model="addForm.belongTo"></el-input>
        </el-form-item>
        <!--包含学段-->
        <el-form-item label="包含学段">
          <el-input v-model="addForm.learnSection"></el-input>
        </el-form-item>
        <!--公立私立-->
        <el-form-item label="城市农村">
          <el-input v-model="addForm.propertyDef"></el-input>
        </el-form-item>
        <!--城市农村-->
        <el-form-item label="学校地址">
          <el-input v-model="addForm.detailAddress"></el-input>
        </el-form-item>
        <!--状态-->
        <el-form-item label="学校状态">
          <el-input v-model="addForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <!--底部区-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "School",
    data() {
      // 验证邮箱的规则
      var chechEmail = (rule,value,collback) => {
        const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      }

      // 验证手机号的过着
      var checkMobile = (rule,value,collback) => {}
      return {
        // 获取学校列表的参数对象
        queryInfo: {
          query: '',
          pageNum: 1,
          pageSize: 5,
        },
        schoolList: [],
        total: 0,
        // 控制对话框的显示和隐藏
        dialogVisible: false,
        // 表单数据
        addForm: {
          schoolName: '',
          district: '',
          belongTo: '',
          learnSection: '',
          propertyDef: '',
          detailAddress: '',
          remark: ''
        },
        // 表单验证规则
        addFormRules: {
          //trigger:'blur' 失去焦点时触发验证
          schoolName: [{required: true, message: '请输入学校名称', trigger: 'blur'},
            {min: 3, max: 15, message: '学校名称的长度在3-15个字符', trigger: 'blur'}],
          district: [{required: true, message: '请输入所在区域', trigger: 'blur'}],
        },
      }
    },
    created() {
      this.getSchoolList()
    },
    methods: {
      async getSchoolList() {
        const {data: res} = await this.$http.get("school/list", {params: this.queryInfo})
        // console.log(res);
        if (res.code != 200) return this.$message.error('获取学校失败')
        // 根据remark动态赋值state
        for (let i = 0; i < res.data.list.length; i++) {
          if (res.data.list[i].remark === '1') res.data.list[i].state = true;
          else res.data.list[i].state = false;
        }
        this.schoolList = res.data.list;
        console.log(this.schoolList);
        this.total = res.data.total;
      },
      getSchoolStage(str) {
        if (str === '1') return true
        return false
      },
      handleSizeChange(newSize) {
        // 监听pageSize改变的事件
        // console.log(newSize);
        this.queryInfo.pageSize = newSize;
        // 重修调用数据发起请求
        this.getSchoolList();
      },
      handleCurrentChange(newPage) {
        // 监听页码值改变的事件
        console.log(newPage);
        this.queryInfo.pageNum = newPage;
        this.getSchoolList();
      },
      async SchoolStateChange(schoolData) {
        // 监听switch开关状态的改变
        console.log(schoolData);
        // 发送put请求
        const {data: res} = await this.$http.put(`school/${schoolData.id}/state/${schoolData.state}`)
        if (res.code != 200) {
          // 没有成功取消修改
          schoolData.state = !schoolData.state
          return this.$message.error("更新学校状态失败！")
        }
        this.$message.success("更新学校状态成功!")
      }
    }
  }
</script>

<style lang="less" scoped>

</style>