<template>
  <div class="app-container">
    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row
      style="width: 100%; margin-top: 20px;">
      <el-table-column label="站点ID" prop="id" align="center" min-width="150">
        <template slot-scope="{row}">
          <span>{{ row.siteId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.siteName }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getSiteListAPI } from '@/api/user'

export default {
  name: 'UserList',
  data() {
    return {
      tableKey: 0,
      list: null,
      listLoading: true,
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true

      getSiteListAPI().then(response => {
        this.list = response.data.siteList

        setTimeout(() => {
          this.listLoading = false
        }, 100)
      })
    }
  }
}
</script>