<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.realName" placeholder="员工姓名" style="width: 200px; margin-right: 10px;"
        class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row
      style="width: 100%; margin-top: 20px;">
      <el-table-column label="用户ID" prop="id" align="center" min-width="150">
        <template slot-scope="{row}">
          <span>{{ row.userId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.realName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="密码" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.password }}</span>
        </template>
      </el-table-column>
      <el-table-column label="权限" min-width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.permission == 1 ? "管理员" : "员工" }}</span>
        </template>
      </el-table-column>

      <el-table-column label="站点" min-width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.siteInf.siteName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" min-width="130" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
      @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px"
        style="width: 400px; margin-left:50px;">
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="temp.userId" />
        </el-form-item>
        <el-form-item label="姓名" prop="realName">
          <el-input v-model="temp.realName" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="temp.password" />
        </el-form-item>
        <el-form-item label="权限" prop="permission">
          <el-select v-model="temp.permission" placeholder="请选择用户权限">
            <el-option v-for="(item, index) in statusOptions" :key="index" :label="item.name" :value="item.level" />
          </el-select>
        </el-form-item>
        <el-form-item label="站点ID">
          <el-select v-model="temp.siteId" placeholder="请选择站点">
            <el-option v-for="(item, index) in siteOptions" :key="index" :label="item.siteName" :value="item.siteId" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus == 'create' ? addUser() : updateUser()">
          确定
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getUserListAPI, addUserInfAPI, getSiteListAPI, updateUserInfAPI, deleteUserInfAPI } from '@/api/user'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination



export default {
  name: 'UserList',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        realName: ''
      },
      statusOptions: [{ name: "管理员", level: 1 }, { name: "员工", level: 2 }],
      siteOptions: [],
      temp: {
        userId: undefined,
        realName: '',
        password: '',
        permission: undefined,
        siteId: undefined,
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      rules: {
        userId: [{ required: true, message: '请输入用户ID', trigger: 'blur' }],
        realName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        permission: [{ required: true, message: '请选择用户权限', trigger: 'blur' }]
      },
    }
  },
  created() {
    this.getList(),
      this.getSiteList()
  },
  methods: {
    getList() {
      this.listLoading = true

      getUserListAPI(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 100)
      })
    },
    getSiteList() {
      getSiteListAPI().then(res => {
        this.siteOptions = res.data.siteList
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
        userId: undefined,
        realName: '',
        password: '',
        permission: undefined,
        siteId: undefined,
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateUser() {
      let userInf = {
        userId: this.temp.userId,
        realName: this.temp.realName,
        password: this.temp.password,
        permission: this.temp.permission,
        siteId: this.temp.siteId
      }

      updateUserInfAPI(userInf).then(res => {
        this.$notify({
          title: 'Success',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
        this.dialogFormVisible = false
        this.listQuery.realName = ''
        this.getList()
      })
    },
    handleDelete(row, index) {
      this.temp = Object.assign({}, row) // copy obj
      let userId = this.temp.userId
      
      deleteUserInfAPI(userId).then(res => {
        this.$notify({
          title: 'Success',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.listQuery.realName = ''
        this.getList()
      })
    },
    addUser() {
      let userInf = {
        userId: this.temp.userId,
        realName: this.temp.realName,
        password: this.temp.password,
        permission: this.temp.permission,
        siteId: this.temp.siteId
      }
      addUserInfAPI(userInf).then(res => {
        this.$notify({
          title: 'Success',
          message: '添加成功',
          type: 'success',
          duration: 2000
        })
        this.dialogFormVisible = false
        this.listQuery.realName = ''
        this.getList()
      })

    }

  }
}
</script>