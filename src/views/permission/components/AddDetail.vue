<template>
  <el-dialog
    :title="isUpdate === true ? '更新权限' : '新增权限'"
    :visible="dialogVisible"
    width="30%"
    :before-close="handleClose"
  >
    <el-form ref="permissionDetail" :model="detData" :rules="rules" label-width="90px">
      <el-form-item prop="name" label="权限名称">
        <el-input v-model="detData.name" width="80%" size="mini" />
      </el-form-item>
      <el-form-item prop="code" label="权限标识">
        <el-input v-model="detData.code" width="80%" size="mini" />
      </el-form-item>
      <el-form-item prop="description" label="权限描述">
        <el-input v-model="detData.description" type="textarea" width="80%" size="mini" />
      </el-form-item>
      <el-form-item label="开启" prop="enVisible">
        <el-switch
          v-model="detData.enVisible"
          active-value="1"
          inactive-value="0"
          @change="switchStatus"
        />
      </el-form-item>
      <el-form-item>
        <el-row type="flex" justify="center">
          <el-col :span="14">
            <el-button size="mini" type="primary" @click="addPermission">确定</el-button>
            <el-button size="mini" @click="handleClose">取消</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>

import { addPermissionService, getPerDetailService } from '@/api/permission'

export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false

    },
    formal: {
      type: Object,
      default: null

    }
  },
  data() {
    return {
      detData: {
        name: '', // 权限点名字
        code: '', // 权限点标识
        description: '', // 权限点描述
        type: 2, // 权限点类型
        pid: null, // 权限点父级id
        enVisible: 0// 权限点开启状态
      },
      rules: {
        name: [
          { required: 'true', message: '输入不能为空', trigger: 'blur' },
          { min: 2, max: 10, message: '输入范围是2-10个字符', trigger: 'blur' }
        ],
        code: [
          { required: 'true', message: '输入不能为空', trigger: 'blur' },
          { min: 2, max: 20, message: '输入范围是2-20个字符', trigger: 'blur' }
        ],
        description: [
          { required: 'true', message: '输入不能为空', trigger: 'blur' },
          { min: 1, max: 100, message: '输入范围是1-100个字符', trigger: 'blur' }
        ]

      }
    }
  },
  computed: {
    isUpdate() {
      return this.formal.fm === 2
    }
  },

  methods: {
    handleClose() {
      // 清空信息,关闭组件
      this.$refs.permissionDetail.resetFields()
      this.$emit('update:dialogVisible', false)
    },

    // 添加新权限
    async addPermission() {
      // 校验输入是否规范
      await this.$refs.permissionDetail.validate()
      let nowMal = ''
      this.detData.pid = this.formal.fId
      // 判断是否为修改命令还是添加命令
      if (this.formal.fm === 0) {
        // 接口新增
        nowMal = '新增'
        await addPermissionService(this.detData)
      } else if (this.formal.fm === 1) {
        // 子集新增
        nowMal = '新增'

        await addPermissionService(this.detData)
      } else if (this.formal.fm === 2) {
        // 更新
        nowMal = '更新'

        await addPermissionService(this.detData)
      }

      // 提示消息,刷新数据并关闭组件
      this.$emit('updateNewData')
      this.$message.success(nowMal + '成功')
      this.handleClose()
    },

    switchStatus(now) {
      console.log(now)
      this.detData.enVisible = now
    },

    async getPerDetail(id) {
      // console.log(this.formal.fId)
      const res = await getPerDetailService(id)
      this.detData = res
      // console.log(res)
    }
  }
}
</script>

<style>

</style>
