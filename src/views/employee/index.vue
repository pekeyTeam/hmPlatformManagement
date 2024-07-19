<template>
  <div class="container">
    <div class="app-container">
      <div class="left">
        <el-input v-model="queryParams.keyword" style="margin-bottom:10px" type="text" prefix-icon="el-icon-search" size="small" placeholder="输入员工姓名全员搜索" @input="changeInput" />
        <!-- 树形组件 -->
        <el-tree
          ref="elTree"
          :data="dept"
          :props="defaultProps"
          :default-expand-all="true"
          :highlight-current="true"
          :expand-on-click-node="false"
          node-key="id"
          @current-change="selectNode"
        />
      </div>
      <div class="right">
        <el-row class="opeate-tools" type="flex" justify="end">
          <el-button v-permission="'add-employee'" size="mini" type="primary" @click="$router.push('/employee/detail')">添加员工</el-button>
          <el-button size="mini" @click="dialogVisible = true">excel导入</el-button>
          <el-button size="mini" @click="exportEmployee">excel导出</el-button>
        </el-row>
        <!-- 表格组件 -->
        <el-table :data="list">
          <el-table-column prop="staffPhoto" label="头像" width="80">
            <template v-slot="{row}">
              <el-avatar
                v-if="row.staffPhoto"
                :size="30"
                :src="row.staffPhoto"
              />
              <span v-else class="username">{{ row.username.charAt(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="username" label="姓名" />
          <el-table-column prop="mobile" label="手机号" sortable />
          <el-table-column prop="workNumber" label="工号" sortable />
          <el-table-column prop="formOfEmployment" label="聘用形式">
            <template v-slot="{row}">
              <span>{{ row.formOfEmployment === 1 ? '正式': row.formOfEmployment === 2 ? '非正式' : '其他' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="departmentName" label="部门" />
          <el-table-column prop="timeOfEntry" width="120" label="入职时间" sortable />
          <el-table-column label="操作" width="280">
            <template v-slot="{row}">
              <el-button type="text" size="mini" @click="$router.push(`/employee/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="mini" @click="butRole(row.id)">角色</el-button>
              <el-popconfirm
                title="确定删除吗？"
                @onConfirm="confirmDel(row.id)"
              >
                <el-button slot="reference" size="mini" type="text">删除</el-button>
              </el-popconfirm>

            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-row type="flex" justify="end" align="middle" style="height:60px">

          <el-pagination
            layout="total,prev, pager, next"
            :total="total"
            :current-page="queryParams.page"
            :page-size="queryParams.pagesize"
            @current-change="pageChange"
          />

        </el-row>

      </div>

      <!-- 文件上传 -->
      <InputExcel :show-excel-dialog.sync="dialogVisible" @uploadSuccess="getEmployeeList" />

      <!-- 员工角色弹窗 -->
      <el-dialog title="角色分配" :visible.sync="roleVisible">
        <el-checkbox-group v-model="roleIds">
          <el-checkbox v-for="item in roleList" :key="item.id" :label="item.id">{{ item.name }}</el-checkbox>

        </el-checkbox-group>
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button size="mini" type="primary" @click="butRoleOk">确认</el-button>
            <el-button size="mini" @click="roleVisible = false">取消</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>

  </div>
</template>

<script>

import { getDepartmentService } from '@/api/department'
import { transListToTreeData } from '@/utils/index'
import { getEmployeeListService, getExcelEmployee, delEmployeeService, updateRolePermissionService, getEnableRolePermissionService, getEmployeeDetailService } from '@/api/employee'

import InputExcel from '@/views/employee/components/ImportExcel.vue'

import fileSaver from 'file-saver'
export default {
  name: 'Employee',
  components: {
    InputExcel
  },
  data() {
    return {
      dept: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      // 存储查询参数
      queryParams: {
        departmentId: null,
        page: 1,
        pagesize: 10,
        keyword: ''
      },

      list: [],
      total: null,
      dialogVisible: false,

      roleVisible: false,
      roleList: [],
      roleIds: [],
      currentUserId: null
    }
  },

  created() {
    this.getDepartment()
  },
  methods: {
    async getDepartment() {
      this.dept = transListToTreeData(await getDepartmentService(), 0)
      this.queryParams.departmentId = this.dept[0].id

      // 树节点渲染是异步的，所以我们要等到渲染完毕再进行选中操作

      this.$nextTick(() => {
        this.$refs.elTree.setCurrentKey(this.queryParams.departmentId)
      })
      this.getEmployeeList()
    },
    selectNode(node) {
      this.queryParams.departmentId = node.id
      this.queryParams.page = 1
      this.getEmployeeList()
    },
    async getEmployeeList() {
      const { total, rows } = await getEmployeeListService(this.queryParams)
      this.list = rows
      this.total = total
    },
    pageChange(newPage) {
      this.queryParams.page = newPage
      this.getEmployeeList()
    },

    changeInput() {
      this.queryParams.page = 1
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.getEmployeeList()
      }, 300)
    },

    async exportEmployee() {
      const res = await getExcelEmployee()
      fileSaver.saveAs(res, '员工信息表.xlsx')
    },

    // 删除员工

    async confirmDel(id) {
      await delEmployeeService(id)
      // 判断是否为本页最后一个数据，确定是否前进一页
      if (this.list.length === 1 && this.queryParams.page > 1) this.queryParams.page--

      // 删除成功后，提示消息并重新获取员工信息
      this.$message.success('删除成功')
      this.getEmployeeList()
    },

    // 打开角色分配组件
    async butRole(id) {
      // 接口获取角色
      this.roleList = await getEnableRolePermissionService()
      // 计入当前用户id
      this.currentUserId = id
      // 获取用户角色信息
      const { roleIds } = await getEmployeeDetailService(id)
      this.roleIds = roleIds

      this.roleVisible = true
    },

    // 修改员工角色
    async butRoleOk() {
      await updateRolePermissionService({
        id: this.currentUserId,
        roleIds: this.roleIds
      })

      // 弹窗提示与组件关闭
      this.$message.success('角色修改成功')
      this.roleVisible = false
    }

  }
}
</script>

<style lang="scss" scoped>
.app-container {
  background: #fff;
  display: flex;
  .left {
    width: 280px;
    padding: 20px;
    border-right: 1px solid #eaeef4;
  }
  .right {
    flex: 1;
    padding: 20px;
    .opeate-tools {
      margin:10px ;
    }
    .username {
      height: 30px;
      width: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 50%;
      color: #fff;
      background: #04C9BE;
      font-size: 12px;
      display:inline-block;
    }
  }
}

</style>
