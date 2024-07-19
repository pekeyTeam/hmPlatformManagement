<template>
  <div class="container">
    <div class="app-container">
      <el-button class="elBut" type="primary" size="mini" @click="addParentPer">添加权限</el-button>
      <el-table :data="list" row-key="id" :default-expand-all="true">
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="code" label="标识" />
        <el-table-column prop="description" label="描述" />
        <el-table-column label="操作">
          <template v-slot="{row}">
            <el-button v-if="row.pid === 0" type="text" size="mini" @click="addChildrenPer(row.id)">添加</el-button>
            <div v-else />
            <el-button type="text" size="mini" @click="updatePer(row.id)">编辑</el-button>
            <el-popconfirm
              title="确定删除吗？"
              @onConfirm="delConfirm(row.id)"
            >
              <el-button slot="reference" type="text" size="mini">删除</el-button>
            </el-popconfirm>

          </template>

        </el-table-column>
      </el-table>
    </div>

    <!-- 添加修改组件 -->
    <AddDetail ref="addDe" :formal="formal" :dialog-visible.sync="dialogVisible" @updateNewData="getPermission" />
  </div>
</template>
<script>

import { getPermissionListService, delPerService } from '@/api/permission'
import { transListToTreeData } from '@/utils/index'

import AddDetail from './components/AddDetail.vue'

export default {
  name: 'Permission',
  components: {
    AddDetail
  },
  data() {
    return {
      list: [],
      dialogVisible: false,
      formal: {
        fm: 0,
        fId: 0
      }

    }
  },
  created() {
    this.getPermission()
  },

  methods: {
    async getPermission() {
      this.list = transListToTreeData(await getPermissionListService(), 0)
    },
    addParentPer() {
      this.dialogVisible = true
    },
    addChildrenPer(id) {
      this.dialogVisible = true
      this.formal = {
        fm: 1,
        fId: id
      }
    },
    updatePer(id) {
      this.dialogVisible = true
      console.log(id)
      this.formal = {
        fm: 2,
        fId: id
      }
      console.log()
      this.$refs.addDe.getPerDetail(id)
    },

    async delConfirm(id) {
      await delPerService(id)
      this.$message.success('删除成功')
      // 删完重新获取数据
      this.getPermission()
    }
  }
}
</script>

<style scoped>
.elBut{
  margin:20px 10px;
}
</style>
