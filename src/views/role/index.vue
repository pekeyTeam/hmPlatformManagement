<template>
  <div class="container">
    <div class="app-container">
      <!-- 点击按钮 -->
      <div class="role-operate">
        <el-button size="mini" type="primary" @click="showDialog = true">添加角色</el-button>
      </div>

      <!-- table -->
      <el-table :data="list">
        <el-table-column
          prop="name"
          align="center"
          width="200"
          label="角色"
        >
          <template v-slot="{row}">
            <el-input v-if="row.isEdit" v-model="row.editRow.name" size="mini" />
            <span v-else>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column

          align="center"
          width="200"
          label="启用"
        >
          <template v-slot="{row}">
            <el-switch
              v-if="row.isEdit"
              v-model="row.editRow.state"
              :active-value="1"
              :inactive-value="0"
            />
            <span v-else>{{ row.state === 1 ? '已启用' : row.state === 0 ? '未启用' : '无' }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="description"
          align="center"

          label="描述"
        >
          <template v-slot="{row}">
            <el-input v-if="row.isEdit" v-model="row.editRow.description" size="mini" type="textarea" />
            <span v-else>{{ row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"

          label="操作"
        >
          <template v-slot="{row}">

            <template v-if="row.isEdit">
              <el-button size="mini" type="primary" @click="btnEditOk(row)">确认</el-button>
              <el-button size="mini">取消</el-button>
            </template>
            <template v-else>

              <el-button type="text" size="mini" @click="perBut(row.id)">分配权限</el-button>
              <el-button type="text" size="mini" @click="updateRole(row)">编辑</el-button>
              <el-popconfirm
                title="确定删除吗？"
                @onConfirm="delRole(row)"
              >
                <el-button slot="reference" type="text" size="mini">删除</el-button>
              </el-popconfirm>
            </template>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页导航 -->
      <el-row type="flex" justify="end" align="middle" style="height:60px">
        <el-pagination
          layout="prev, pager, next"
          :page-size="pageParams.pagesize"
          :total="pageParams.total"
          :current-page="pageParams.page"
          @current-change="changPage"
        />
      </el-row>
    </div>

    <!-- 弹窗组件 -->
    <el-dialog
      title="添加角色"
      :visible.sync="showDialog"
      width="500px"
      :before-close="butCancel"
    >
      <el-form ref="roleElForm" :rules="rules" :model="roleForm" label-width="120px">
        <el-form-item prop="name" label="角色名称">
          <el-input v-model="roleForm.name" size="mini" style="width:300px" />
        </el-form-item>
        <el-form-item label="启用" prop="state">
          <el-switch
            v-model="roleForm.state"
            :active-value="1"
            :inactive-value="0"
            size="mini"
            style="width:300px"
          />
        </el-form-item>
        <el-form-item prop="description" label="角色描述">
          <el-input v-model="roleForm.description" type="textarea" :rows="3" size="mini" style="width:300px" />
        </el-form-item>
        <el-form-item>
          <el-row type="flex" justify="center">
            <el-col :span="12">
              <el-button size="mini" type="primary" @click="butIsOk">确定</el-button>
              <el-button size="mini" @click="butCancel">取消</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 分配权限 -->
    <el-dialog title="权限分配" :visible.sync="perVisible">
      <el-tree
        ref="elTree"
        node-key="id"
        :default-checked-keys="permIds"
        :data="perData"
        :props="{label:'name'}"
        :default-expand-all="true"
        :show-checkbox="true"
        check-strictly
      />

      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="mini" type="primary" @click="butPermOk">确定</el-button>
          <el-button size="mini" @click="perVisible = false">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { getRoleListService, addRoleService, updateRoleService, delRoleService, givePermService, getRoleDetailService } from '@/api/role'
import { getPermissionListService } from '@/api/permission'
import { transListToTreeData } from '@/utils/index'
export default {
  name: 'Role',
  data() {
    return {
      list: [],
      pageParams: {
        page: 1,
        pagesize: 5,
        total: 0
      },
      showDialog: false,

      roleForm: {
        name: '',
        description: '',
        state: 0
      },
      rules: {
        name: [
          { required: 'true', message: '不能为空', trigger: 'blur' }
        ],
        description: [
          { required: 'true', message: '不能为空', trigger: 'blur' }
        ]
      },

      perVisible: false,
      perData: [],
      currentRoleId: null,
      permIds: []
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { rows, total } = await getRoleListService(this.pageParams)
      this.list = rows
      this.pageParams.total = total
      // console.log(this.pageParams.pagesize)
      // 给List所有项添加isEdit属性，来判断编辑状态
      this.list.forEach(item => {
        this.$set(item, 'isEdit', false)

        this.$set(item, 'editRow', {
          name: item.name,
          description: item.description,
          state: item.state
        })
      })
      // console.log(this.list)
    },
    changPage(nowPage) {
      this.pageParams.page = nowPage
      this.getRoleList()
    },
    async butIsOk() {
      // 检查规范是否合格
      await this.$refs.roleElForm.validate()
      // 调用接口
      await addRoleService(this.roleForm)
      // 提示校验成功
      this.$message.success('添加成功')
      // 重新获取role角色数据
      this.getRoleList()
      // 清空表单并关闭组件
      this.butCancel()
    },
    butCancel() {
      this.$refs.roleElForm.resetFields()
      this.showDialog = false
    },
    updateRole(row) {
      row.isEdit = true
      row.editRow.name = row.name
      row.editRow.state = row.state
      row.editRow.description = row.description
    },
    async btnEditOk(row) {
      if (row.editRow.name && row.editRow.description) {
        // 输入不为空时
        // 进行接口验证
        // console.log({ ...row.editRow, id: row.id })
        await updateRoleService({ ...row.editRow, id: row.id })
        // 提示验证成功
        this.$message.success('修改成功')
        // 更新显示数据，退出编辑状态
        Object.assign(row, {
          ...row.editRow,
          isEdit: false
        })// 规避eslint的规范
      } else {
        // 输入为空时
        this.$message.error('输入区不能为空')
      }
    },

    async delRole(row) {
      // alert('aaa')
      // 调用删除接口
      await delRoleService(row.id)
      // 删除成功提示
      this.$message.success('删除成功')

      // 判断删除的当前页是否剩余数据量小于或等于一
      if (this.list.length <= 1) {
        this.pageParams.page--
      }

      // 重新获取角色数据
      this.getRoleList()
    },

    async perBut(id) {
      this.currentRoleId = id
      const { permIds } = await getRoleDetailService(id)
      this.permIds = permIds
      this.perData = transListToTreeData(await getPermissionListService(), 0)

      this.perVisible = true
    },

    async butPermOk() {
      await givePermService({
        id: this.currentRoleId,
        permIds: this.$refs.elTree.getCheckedKeys()
      })

      this.$message.success('修改成功')
      this.perVisible = false
    }

  }

}
</script>

<style scoped>
.role-operate{
  padding: 10px;
}
</style>
