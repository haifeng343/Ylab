<template>
  <div>
    <div class="bottom">
      <div class="content">
        <div style="width: 100%;">
          <div style="font-size:34px;color:#303133;text-align:center">现在开通YLab</div>
          <div style="font-size:34px;color:#303133;text-align:center;margin-bottom: 20px;">免费试用30天</div>
          <el-form ref="registerForm" :rules="rules" :model="registerForm" class="registerForm">
            <el-form-item prop="comName">
              <el-input v-model="registerForm.comName" class="login" placeholder="公司或组织名称" />
            </el-form-item>
            <el-form-item prop="peopleCount">
              <el-select v-model="registerForm.peopleCount" class="login" placeholder="企业人数">
                <el-option
                  v-for="item in companyNumList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="loginClickBtn" @click="dredgeYlab('registerForm')">开通YLab</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { openYLab } from '@/api/login'
export default {
  name: 'Dredge',
  data() {
    var checkComName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('公司名称不能为空'))
      }
      if (value.trim() === '') {
        return callback(new Error('公司名称不能为空'))
      } else {
        callback()
      }
    }
    var checkPeopleCount = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('企业人数不能为空'))
      } else {
        callback()
      }
    }
    return {
      rules: {
        comName: [{ validator: checkComName, trigger: 'blur' }],
        peopleCount: [{ validator: checkPeopleCount, trigger: 'change' }]
      },
      companyNumList: [{ value: '0-10人', label: '0-10人' }, { value: '10-20人', label: '10-20人' }, { value: '20-50人', label: '20-50人' }, { value: '50-100人', label: '50-100人' }, { value: '100-500人', label: '100-500人' }, { value: '500人以上', label: '500人以上' }],
      registerForm: {
        comName: '',
        peopleCount: ''
      }
    }
  },
  methods: {
    dredgeYlab(registerForm) {
      this.$refs[registerForm].validate((valid) => {
        if (!valid) {
          return
        } else {
          openYLab(this.registerForm).then(res => {
            if (res.code === 200) {
              this.$message.success('您已开通YLab系统，即将跳转进入系统…')
              const index = window.location.href.search('/html')
              const href = window.location.href.substr(0, index)
              setTimeout(() => {
                if (document.body.clientWidth >= 768) {
                  this.$router.push('/product')
                  window.open(`${href}/html/standard.html#/dashboard`, '_blank')
                } else {
                  window.open(`${href}/m/html/standard.html#/dashboard`, '_blank')
                }
              }, 2000)
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-button {
    width: 100%;
    height: 44px;
  }
</style>
<style lang="scss">
  .login {
    .el-input__inner {
      height: 44px !important;
      line-height: 44px;
    }
  }
  .registerForm .el-select {
    width: 100%;
  }
  .registerForm .el-input__suffix-inner {
    height: 100%;
  }
  .loginClickBtn.el-button span {
    font-size: 14px;
  }
</style>
