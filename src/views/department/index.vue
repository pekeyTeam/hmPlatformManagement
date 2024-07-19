<template>
  <div class="container">
    <div class="app-container">
      <!-- 组织展示 -->
      <el-tree :expand-on-click-node="false" :data="dept" :props="defaultProps" default-expand-all>

        <template v-slot="{data}">
          <el-row style="width:100%;height:40px" type="flex" justify="space-between" align="middle">
            <el-col>{{ data.name }}</el-col>
            <el-col :span="4">
              <span class="tree-manager">{{ data.managerName }}</span>
              <el-dropdown @command="handleCommand($event,data.id)">
                <span class="el-dropdown-link">
                  操作<i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="add">添加子部门</el-dropdown-item>
                  <el-dropdown-item command="update">编辑部门</el-dropdown-item>
                  <el-dropdown-item command="delete">删除</el-dropdown-item>

                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
        </template>
      </el-tree>
    </div>

    <!-- 弹窗组件 -->
    <AddDept ref="addDeptSub" :current-node-id="currentNodeId" :dialog-visible.sync="dialogVisible" @updateDepartment="getDepartment" />
  </div>
</template>
<script>
import { getDepartmentService, delDepartment } from '@/api/department'
import { transListToTreeData } from '@/utils/index'
import AddDept from './components/AddDept.vue'

export default {
  name: 'Department',
  components: {
    AddDept
  },
  data() {
    return {
      currentNodeId: null,
      dept: [],
      dialogVisible: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  created() {
    this.getDepartment()
  },

  methods: {
    async getDepartment() {
      const res = await getDepartmentService()
      this.dept = transListToTreeData(res, 0)
    },
    handleCommand(command, id) {
      if (command === 'add') {
        // console.log('Aaa')
        this.dialogVisible = true
        this.currentNodeId = id
      } else if (command === 'update') {
        this.dialogVisible = true
        this.currentNodeId = id

        this.$nextTick(() => {
          this.$refs.addDeptSub.getDepartmentDetail()
        })
      } else {
        this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          // 调用删除接口
          await delDepartment(id)
          this.getDepartment()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }
    }
  }
}
</script>
<style scoped>
.app-container{
  padding: 30px 140px;
  font-size: 14px;
}
.tree-manager{
  width: 50px;
  display: inline-block;
  margin: 10px;
  margin-right: 30px;
}

</style>
