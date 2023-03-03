<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.realName" placeholder="员工姓名" style="width: 200px; margin-right: 10px;"
        class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
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
          <el-button type="primary" size="mini" @click="handleRecover(row)">
            恢复
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
      @pagination="getList" />

  </div>
</template>

<script>
import { getUserDeletedListAPI, getSiteListAPI, removeUserDeletedAPI, recoverUserDeletedAPI } from '@/api/user'
import Pagination from '@/components/Pagination'


export default {
  name: 'UserRecycle',
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
    }
  },
  created() {
    this.getList(),
      this.getSiteList()
  },
  methods: {
    getList() {
      this.listLoading = true

      getUserDeletedListAPI(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total

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
    handleRecover(row) {
      this.temp = Object.assign({}, row) // copy obj
      let userId = this.temp.userId
      recoverUserDeletedAPI(userId).then(res => {
        this.$notify({
          title: 'Success',
          message: '恢复成功',
          type: 'success',
          duration: 2000
        })
        this.listQuery.realName = ''
        this.getList()
      })
    },
    handleDelete(row) {
      this.temp = Object.assign({}, row) // copy obj
      let userId = this.temp.userId

      removeUserDeletedAPI(userId).then(res => {
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
  }
}
</script>