<template>
  <el-dialog
    width="500px"
    title="员工导入"
    :visible="showExcelDialog"
    @close="$emit('update:showExcelDialog', false)"
  >
    <el-row type="flex" justify="center">
      <div class="upload-excel">
        <input
          ref="excel-upload-input"
          class="excel-upload-input"
          type="file"
          accept=".xlsx, .xls"
          @change="nowUpload"
        >
        <div class="drop">
          <i class="el-icon-upload" />
          <el-button type="text" @click="getTemplate">下载导入模板</el-button>
          <span>将文件拖到此处或
            <el-button type="text" @click="handleUpload">点击上传</el-button>
          </span>
        </div>
      </div>
    </el-row>
    <el-row type="flex" justify="end">
      <!-- update:props属性名，值 直接修改 .sync修饰符的属性值 -->
      <el-button size="mini" type="primary" @click="$emit('update:showExcelDialog', false)">取消</el-button>
    </el-row>
  </el-dialog>
</template>
<script>

import { getTemplateService, upLoadTemplateService } from '@/api/employee'

import fileSaver from 'file-saver'

export default {
  props: {
    showExcelDialog: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    async getTemplate() {
      const res = await getTemplateService()
      fileSaver.saveAs(res, '员工信息模板.xlsx')
    },

    handleUpload() {
      this.$refs['excel-upload-input'].click()
    },
    async nowUpload(event) {
      console.log(event.target.files)
      const file = event.target.files
      if (file.length > 0) {
        // 大于零，有文件要上传
        const data = new FormData()
        data.append('file', file[0])
        try {
          await upLoadTemplateService(data)

          // 上传成功
          // 关闭弹层
          this.$emit('update:showExcelDialog', false)
          // 重新加载员工信息
          this.$emit('uploadSuccess')
        } catch (error) {
          // 捕获失败
        } finally {
          // 不论成功或者失败，都执行这一步（不能不用tryCatchFinally，await如果执行失败，不会向下执行，所以写下边没用）
          // 清空input
          this.$refs['excel-upload-input'].value = ''
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
    .upload-excel {
      display: flex;
      justify-content: center;
      margin: 20px;
      width: 360px;
      height: 180px;
      align-items: center;
      color: #697086;
      .excel-upload-input {
        display: none;
        z-index: -9999;
      }
      .btn-upload,
      .drop {
        border: 1px dashed #dcdfe6;
        width: 100%;
        height: 100%;
        text-align: center;
        line-height: 160px;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      .drop {
        line-height: 40px;
        color: #bbb;
        i {
          font-size: 60px;
          display: block;
          color: #c0c4cc;
        }
      }
    }
</style>
