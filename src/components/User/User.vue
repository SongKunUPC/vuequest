<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区-->
    <el-card>
      <!--搜索与添加区-->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addaddDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!--用户列表区域-->
      <el-table :data="userList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="用户id" prop="id"></el-table-column>
        <el-table-column label="用户名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="手机号" prop="phone"></el-table-column>
        <el-table-column label="状态">
          <!--作用域插槽-->
          <!--作用插槽v-slot:default="table"：接收名为default的插槽的数据并命名为table-->
          <template v-slot:="table">
            <!--el-switch 接收一个boolean值-->
            <el-switch v-model="table.row.status" @change="UserStatusChange(table.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template v-slot:="table">
            <!--修改用户信息的按钮-->
            <el-button type="primary" icon="el-icon-edit" circle size="mini"
                       @click="showEditDialog(table.row.id)"></el-button>
            <!--删除用户信息的按钮-->
            <el-button type="danger" icon="el-icon-delete" circle size="mini"
                       @click="deleteUserById(table.row.id)"></el-button>
            <!--提示文字-->
            <el-tooltip effect="dark" content="用户权限" placement="top" :enterable="false">
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
    <!--添加用户的对话框-->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%"
               @close="addDialogClosed">
      <!--内容主题区-->
      <el-form ref="addUserform" :model="UserForm" label-width="70px" :rules="UserFormRole">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="UserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="UserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="UserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="UserForm.phone"></el-input>
        </el-form-item>
      </el-form>
      <!--底部区-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改用户的对话框-->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="eidtDialogClosed">
      <!--内容主题区-->
      <el-form ref="editUserformRef" :model="EditForm" label-width="70px" :rules="EditFormRole">
        <el-form-item label="用户名">
          <el-input v-model="EditForm.username" disable></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="EditForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="EditForm.phone"></el-input>
        </el-form-item>
      </el-form>
      <!--底部区-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "User",
    data() {
      // 验证邮箱的规则
      var checkEmail = (rule, value, callback) => {
        // 验证邮箱的正则表达式
        const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
        if (regEmail.test(value)) {
          return callback()
        }
        callback(new Error('请输入合法的邮箱'))
      }
      // 验证手机号的规则
      var checkPhone = (rule, value, callback) => {
        const regPhone = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
        if (regPhone.test(value))
          return callback()
        callback(new Error('请输入合法的手机号'))
      }
      return {
        // 获取用户列表的参数对象
        queryInfo: {
          query: '',
          pageNum: 1,
          pageSize: 5,
        },
        userList: [],
        total: 0,
        // 控制对话框的显示和隐藏
        addDialogVisible: false,
        //控制修改对话框的显示和隐藏
        editDialogVisible: false,
        // 表单数据
        UserForm: {
          username: '',
          password: '',
          email: '',
          phone: ''
        },
        EditForm: {},
        UserFormRole: {
          // 内容名称必须与表单的绑定名称相一致
          username: [{required: true, message: '请输入用户名称', trigger: 'blur'},
            {min: 3, max: 15, message: '用户名称在3~15个字符之间', trigger: 'blur'}],
          password: [{required: true, message: '请输入用户密码', trigger: 'blur'},
            {min: 3, max: 15, message: '用户密码在3~15个字符之间', trigger: 'blur'}],
          email: [{required: true, message: '请输入用户邮箱', trigger: 'blur'},
            {validator: checkEmail, trigger: 'blur'}],
          phone: [{required: true, message: '请输入用户手机号', trigger: 'blur'},
            {validator: checkPhone, trigger: 'blur'}]
        },
        // 修改表单的验证规则对象
        EditFormRole: {
          email: [{required: true, message: '请输入用户邮箱', trigger: 'blur'},
            {validator: checkEmail, trigger: 'blur'}],
          phone: [{required: true, message: '请输入用户手机号', trigger: 'blur'},
            {validator: checkPhone, trigger: 'blur'}]
        }
      }
    },
    created() {
      this.getUserList()
    },
    methods: {
      getUserList: async function () {
        const {data: res} = await this.$http.get("admin/listAll", {params: this.queryInfo})
        if (res.code !== 200) return this.$message.error('获取用户失败')
        for (let i = 0; i < res.data.list.length; i++) {
          if (res.data.list[i].active === 1) {
            res.data.list[i].status = true
          } else {
            res.data.list[i].status = false
          }
        }
        this.userList = res.data.list;
        this.total = res.data.total;
      },
      async UserStatusChange(userData) {
        const {data: res} = await this.$http.put(`admin/${userData.id}/active/${userData.status}`)
        if (res.code !== 200) {
          // 没有修改成功
          userData.status = !userData.status;
          return this.$message.error("更新用户状态失败")
        }
        this.$message.success("更新用户状态成功!")
      },
      handleSizeChange(newSize) {
        // 监听每页数量的改变的改变
        this.queryInfo.pageSize = newSize;
        // 重修调用数据发起请求
        this.getUserList();
      },
      handleCurrentChange(newPage) {
        // 监听页码值改变的事件
        console.log(newPage);
        this.queryInfo.pageNum = newPage;
        this.getUserList();
      },
      // 监听对话框关闭的事件
      addDialogClosed() {
        this.$refs.addUserform.resetFields()
      },
      // 点击按钮添加用户
      addUser() {
        this.$refs.addUserform.validate(async valid => {
          if (!valid) return
          // 可以发起添加用户的网络请求
          const {data: res} = await this.$http.post('admin/register', this.UserForm)
          if (res.code !== 200) {
            this.$message.error('添加用户失败')
          }
          this.$message.success('添加用户成功')
          // 成功后隐藏对话框
          this.addDialogVisible = false
          // 刷新用户列表
          this.getUserList();
        })
      },
      // 展示编辑用户的对话框
      async showEditDialog(id) {
        const {data: res} = await this.$http.get('admin/' + id)
        if (res.code !== 200) return this.$message.error('查询用户失败')
        this.EditForm = res.data
        this.editDialogVisible = true
      },
      eidtDialogClosed() {
        this.$refs.editUserformRef.resetFields()
      },
      editUser() {
        this.$refs.editUserformRef.validate(async valid => {
          if (!valid) return
          // 发起修改用户信息的数据请求
          const {data: res} = await this.$http.put('admin/' + this.EditForm.id, {
            email: this.EditForm.email,
            phone: this.EditForm.phone
          })
          if (res.code !== 200) return this.$message.error('更新用户失败!')
          // 关闭对话框
          this.editDialogVisible = false
          // 刷新列表
          this.getUserList()
          // 提示更新用户信息成功
          this.$message.success('更新用户数据成功!')
        })
      },
      // 根据id删除对应的用户id
      async deleteUserById(id) {
        // 弹出提示框
        const confirmResult =  await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(error => {return error})
        // console.log(confirmResult);
        // 如果用户点击确定，confirmResult为confirm
        // 如果用户点击取消，confirmResult为cancel
        if(confirmResult!=='confirm') return this.$message.info('取消删除')
        const{data:res} =  await this.$http.delete('admin/' + id)
        if(res.code!==200) return this.$message.error('删除用户失败')
        this.$message.success('删除用户成功')
        this.getUserList()
      }
    }
  }
</script>

<style scoped>

</style>