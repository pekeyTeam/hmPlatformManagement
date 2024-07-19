<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img v-if="avatar" :src="avatar" class="user-avatar">
          <span v-else class="username">{{ name.charAt(0) }}</span>
          <span class="name">{{ name }}</span>
          <i class="el-icon-setting" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
            <el-dropdown-item>项目地址</el-dropdown-item>
          </a>
          <a target="_blank" @click.prevent="dialogVisible = true">
            <el-dropdown-item>修改密码</el-dropdown-item>
          </a>
          <!-- .native是为了el-dropdown-item 在h5页面调用click事件，
          因为前者没有click事件，所以需要调用native，在前者转换为h5结构后调用原生结构的click事件    -->
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog
      :before-close="handleClose"
      :visible.sync="dialogVisible"
      width="500px"
      title="修改密码"
      :append-to-body="true"
    >
      <el-form ref="elForm" label-width="100px" :model="passForm" :rules="rules" @close="butCancel">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="passForm.oldPassword" show-password size="small" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passForm.newPassword" show-password size="small" />
        </el-form-item>
        <el-form-item label="重复新密码" prop="confirmPassword">
          <el-input v-model="passForm.confirmPassword" show-password size="small" />
        </el-form-item>
        <el-form-item>
          <el-button @click="butCancel">取消</el-button>
          <el-button type="primary" @click="updatePassword">确认修改</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { changePasswordService } from '@/api/user'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      dialogVisible: false,
      passForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      rules: {
        oldPassword: [
          { required: true, message: '输入不能为空', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '输入不能为空', trigger: 'blur' },
          { min: 6, max: 10, message: '密码为六到十位', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '输入不能为空', trigger: 'blur' },
          { validator: (rule, value, callback) => {
            if (this.passForm.newPassword === value) {
              callback()
            } else {
              callback(new Error('两次输入不一致'))
            }
          }, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
    // 调用退出登陆的方法
      await this.$store.dispatch('user/logout')
      this.$router.push('/login')
    },
    updatePassword() {
      // console.log('aaaa')
      this.$refs.elForm.validate(async isOk => {
        if (isOk) {
          // 表单校验，进行axios校验
          await changePasswordService(this.passForm)
          // 消息提示
          this.$message.success('修改成功')
          // // 清空表单
          // this.$refs.elForm.resetFields()
          // // 关闭弹窗
          // this.dialogVisible = false
          // 这边代码一样，直接调用关闭按钮的代码
          this.butCancel()
        }
      })
    },

    butCancel() {
      // console.log('asas')
      // 清空表单
      this.$refs.elForm.resetFields()
      // 关闭弹窗
      this.dialogVisible = false
    },
    handleClose() {
      this.butCancel()
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        display: flex;
        align-items: center;

        .username{
          width: 30px;
          height: 30px;
          border-radius: 50%;
          line-height: 30px;
          background-color: #04c9be;
          text-align: center;
          color: white;
          margin-right: 4px;
        }
        .name{
          margin-right: 10px;
          font-size: 16px;
        }
        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }

        .el-icon-setting {
          font-size: 20px;
        }
      }
    }
  }
}
</style>
