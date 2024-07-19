<template>
  <el-dialog
    :title="ifAdd"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="handleClose"
  >
    <!-- 弹窗内容 -->
    <el-form ref="addDept" :rules="rules" :model="fromData" label-width="120px">
      <el-form-item prop="name" label="部门名称">
        <el-input v-model="fromData.name" style="width:80%" placeholder="2-10个字符" size="mini" />
      </el-form-item>
      <el-form-item prop="code" label="部门编码">
        <el-input v-model="fromData.code" style="width:80%" placeholder="2-10个字符" size="mini" />
      </el-form-item>
      <el-form-item prop="managerId" label="部门负责人">
        <el-select v-model="fromData.managerId" style="width:80%" placeholder="请选择负责人" size="mini">
          <el-option
            v-for="item in managerList"
            :key="item.id"
            :label="item.username"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="introduce" label="部门介绍">
        <el-input v-model="fromData.introduce" type="textarea" style="width:80%" :rows="4" placeholder="1-100个字符" size="mini" />
      </el-form-item>
      <el-form-item>
        <el-row type="flex" justify="center">
          <el-col :span="12">
            <el-button size="mini" type="primary" @click="isOk">确认</el-button>
            <el-button size="mini" @click="clearDept">取消</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { getDepartmentService, getManagerList, addDepartmentService, getDepartmentDetailService, updateDepartmentService } from '@/api/department'

export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false

    },
    currentNodeId: {
      type: Number,
      default: null
    }
  },

  data() {
    return {
      managerList: [],
      fromData: {
        code: '', // 部门编码
        introduce: '', // 部门介绍
        managerId: '', // 部门负责人
        name: '', // 部门名称
        pid: ''
      },
      rules: {
        code: [
          { required: 'true', message: '输入不能为空', trigger: 'blur' },
          { min: 2, max: 10, message: '请输入2-10个字符', trigger: 'blur' },
          { trigger: 'blur', validator: async(rule, value, callback) => {
            let res = await getDepartmentService()
            if (this.fromData.id) {
              res = res.filter(item => item.id !== this.fromData.id)
            }

            if (res.some(item => item.code === value)) {
              callback(new Error('部门编号已存在'))
            } else {
              callback()
            }
          } }
        ],
        introduce: [
          { required: 'true', message: '输入不能为空', trigger: 'blur' },
          { min: 1, max: 100, message: '请输入1-100个字符', trigger: 'blur' }
        ],
        managerId: [{ required: 'true', message: '输入不能为空', trigger: 'blur' }],
        name: [
          { required: 'true', message: '输入不能为空', trigger: 'blur' },
          { min: 2, max: 10, message: '请输入2-10个字符', trigger: 'blur' },
          { trigger: 'blur', validator: async(rule, value, callback) => {
            let res = await getDepartmentService()
            if (this.fromData.id) {
              res = res.filter(item => item.id !== this.fromData.id)
            }
            if (res.some(item => item.name === value)) {
              callback(new Error('部门名称已存在'))
            } else {
              callback()
            }
          } }
        ]
      }
    }
  },

  computed: {
    ifAdd() {
      return this.fromData.id ? '更新' : '增加'
    }
  },

  created() {
    this.getManagerList()
  },

  methods: {
    handleClose() {
      this.$emit('update:dialogVisible', false)
    },
    async getManagerList() {
      const res = await getManagerList()
      this.managerList = res
      // console.log(this.managerList)
    },
    async isOk() {
      // 校验是否通过
      await this.$refs.addDept.validate()

      // 接口业务
      let tit = null
      if (this.fromData.id) {
        // 是更新业务
        tit = '更新'
        console.log(this.fromData)
        await updateDepartmentService(this.fromData)
      } else {
        // 是新增业务
        tit = '增加'
        await addDepartmentService({ ...this.fromData, pid: this.currentNodeId })
      }
      // 成功后通知父组件更新tree

      this.$emit('updateDepartment')

      // 提示更新成功
      this.$message.success(tit + '成功')

      // 清空表单，关闭组件
      this.clearDept()
    },
    clearDept() {
      // this.$refs.addDept.resetFields()
      this.fromData = {
        code: '', // 部门编码
        introduce: '', // 部门介绍
        managerId: '', // 部门负责人
        name: '', // 部门名称
        pid: ''
      }
      this.handleClose()
    },

    // 获取指定id 的信息
    async getDepartmentDetail() {
      const res = await getDepartmentDetailService(this.currentNodeId)
      this.fromData = res
    }
  }
}
</script>
