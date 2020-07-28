<template>
  <my-layer class="layer-wrapper" ref="layer" :title="'添加医生'" @ok="ClickOk" >
    <form>
      <div class="form-item">
        <div class="input-wrapper">
          <span class="title">所属医院</span>
          <my-select class="select-input"
            ref="select-hospital"
            :placeholder="'选择所属医院'"
            :list="hospitalList"
            :current.sync="selectedHospital">
          </my-select>
        </div>
      </div>
      <div class="form-item" :class="{'warning': loginNameWarning}">
        <div class="input-wrapper">
          <span class="title">登录名</span>
          <input type="text" class="input" placeholder="请输入登录名"
            v-model="loginName"
            @focus="loginNameWarning = false"
            @blur="TestLoginName()">
          <i class="icon-clear"
            v-show="loginName.length"
            @click="loginName = ''">
          </i>
        </div>
        <div class="warning-wrapper">
          <i class="warning-icon"></i>
          <span class="warning-info">{{loginNameWarningText}}</span>
        </div>
      </div>
      <div class="form-item" :class="{'warning': userNameWarning}">
        <div class="input-wrapper">
          <span class="title">用户姓名</span>
          <input type="text" class="input" placeholder="请输入登录名"
            v-model="userName"
            @focus="userNameWarning = false"
            @blur="TestUserName()">
          <i class="icon-clear"
            v-show="userName.length"
            @click="userName = ''">
          </i>
        </div>
        <div class="warning-wrapper">
          <i class="warning-icon"></i>
          <span class="warning-info">{{userNameWarningText}}</span>
        </div>
      </div>
      <div class="form-item">
        <div class="input-wrapper">
          <span class="title">用户角色</span>
          <my-select class="select-input"
            ref="select-role"
            :placeholder="'请选择用户角色'"
            :list="roleList"
            :current.sync="selectedRole">
          </my-select>
        </div>
      </div>
      <div class="form-item" :class="{'warning': userPwdWarning}">
        <div class="input-wrapper">
          <span class="title">初始密码</span>
          <input class="input"
            :type="showPwd ? 'text' : 'password'" placeholder="请输入初始密码"
            v-model="userPwd"
            @focus="userPwdWarning = false"
            @blur="TestUserPwd()">
          <!-- <i class="icon-clear"
            v-show="userPwd.length"
            @click="userPwd = ''">
          </i> -->
          <i class="icon-pwd-hide"
          :class="{'icon-pwd-show': showPwd}"
          @click="showPwd = !showPwd"/>
        </div>
        <div class="warning-wrapper">
          <i class="warning-icon"></i>
          <span class="warning-info">{{userPwdWarningText}}</span>
        </div>
      </div>
      <div class="form-item" :class="{'warning': remarkWarning}">
        <div class="input-wrapper">
          <span class="title">备注</span>
          <textarea class="textarea" placeholder="请输入备注" rows="40"
            v-model="remark">
          </textarea>
        </div>
        <div class="warning-wrapper">
          <i class="warning-icon"></i>
          <span class="warning-info">{{remarkWarningText}}</span>
        </div>
      </div>
    </form>
  </my-layer>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

import layer from 'layer'
import { ADD_NEW_USER } from 'service'

import MyLayer from 'widget/MyLayer/index.vue'
import MySelect from 'widget/MySelect/index.2.vue'

@Component({
  components: {
    MyLayer,
    MySelect
  }
})
export default class LayerAddNewUser extends Vue {
  $refs!: {
    vue: Vue,
    vues: Vue[],
    element: HTMLElement,
    elements: HTMLElement[],
    [prop: string]: any
  }
  selectedHospital: any = {}
  selectedRole: any = {}
  hospital: string = ''
  loginName: string = ''
  userName: string = ''
  userPwd: string = ''
  remark: string = ''
  showPwd: boolean = false
  loginNameWarning: boolean = false
  userNameWarning: boolean = false
  userPwdWarning: boolean = false
  remarkWarning: boolean = false
  loginNameWarningText: string = ''
  userNameWarningText: string = ''
  userPwdWarningText: string = ''
  remarkWarningText: string = ''

  get hospitalList () {
    return this.$store.getters['getHospitalList']
  }
  get roleList () {
    return this.$store.getters['getRoleList']
  }

  mounted () {
    this.$on('pop', () => {
      this.InitData()
      this.$refs['select-hospital'].$emit('clear')
      this.$refs['select-role'].$emit('clear')
      this.$refs.layer.$emit('showLayer', '6.2rem;', '10.3rem')
    })
  }

  InitData () {
    this.selectedHospital = {}
    this.selectedRole = {}
    this.loginName = ''
    this.userName = ''
    this.userPwd = ''
    this.remark = ''
    this.loginNameWarning = false
    this.userNameWarning = false
    this.userPwdWarning = false
    this.remarkWarning = false
    this.loginNameWarningText = ''
    this.userNameWarningText = ''
    this.userPwdWarningText = ''
    this.remarkWarningText = ''
  }
  TestLoginName () {
    /**
     * 验证用户名
     */
    if (/^[0-9a-zA-Z]{4,20}$/.test(this.loginName)) {
      this.loginNameWarning = false
    } else {
      this.loginNameWarning = true
      this.loginNameWarningText = '用户名为长度4~20的字母与数字的组合'
      return false
    }
  }
  TestUserName () {
    /**
     * 验证姓名
     */
    if (this.userName) {
      this.userNameWarning = false
    } else {
      this.userNameWarning = true
      this.userNameWarningText = '用户姓名不能为空'
      return false
    }
  }
  TestUserPwd () {
    /**
     * 验证新密码:长度为6~20的字母与数字的组合
     */
    if (/^[0-9a-zA-Z]{6,20}$/.test(this.userPwd)) {
      this.userPwdWarning = false
    } else {
      this.userPwdWarning = true
      this.userPwdWarningText = '密码是长度为6~20的字母与数字的组合'
      return false
    }
  }
  TestRemak () {
    /**
     * 验证备注: 长度为0~40
     */
    if (this.remark.length <= 40) {
      this.remarkWarning = false
    } else {
      this.remarkWarning = true
      this.remarkWarningText = '备注长度不能超过40个字符'
      return false
    }
  }
  ClickOk (layerIndex: number) {
    this.TestLoginName()
    this.TestUserName()
    this.TestUserPwd()
    this.TestRemak()
    if (!this.loginNameWarning && !this.userNameWarning && !this.userPwdWarning && !this.remarkWarning) {
      ADD_NEW_USER({
        companyId: this.selectedHospital.id,
        userType: this.selectedRole.id,
        loginName: this.loginName,
        name: this.userName,
        password: this.userPwd,
        remarks: this.remark
      }).then((res: AxiosRes) => {
        if (res.data.success) {
          layer.close(layerIndex)
          layer.msg(res.data.message)
          this.$emit('ok')
        } else {
          this.loginNameWarning = true
          this.loginNameWarningText = res.data.message
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.layer-wrapper{
  .form-item{
    height: 1.2rem;
    width: 100%;

    .input-wrapper{
      position: relative;
      width: 100%;
      height: 0.7rem;
      .title{
        float: left;
        height: 100%;
        width: 1.5rem;
        font-size: 0.24rem;
        font-weight: normal;
        line-height: 0.7rem;
        text-align: left;
        color: #666;
      }
      .input{
        float: left;
        padding: 0 0.5rem 0 0.1rem;
        height: 100%;
        width: calc(100% - 1.5rem);
        border: 0.02rem solid #efefef;
        border-radius: 0.04rem;
        box-sizing: border-box;
        font-size: 0.24rem;
        font-weight: normal;
        line-height: 0.7rem;
        text-align: left;
        color: #666;
        &::-webkit-input-placeholder{
          color: #999;
        }
        &:focus{
          border-color: #D57DA7;
          outline: none;
        }
      }
      .select-input{
        float: left;
        padding: 0;
        height: 100%;
        width: calc(100% - 1.5rem);
        border: 0.02rem solid #efefef;
        border-radius: 0.04rem;
        box-sizing: border-box;
        font-size: 0.24rem;
        font-weight: normal;
        line-height: 0.7rem;
        text-align: left;
        color: #666;
      }
      .textarea{
        float: left;
        padding: 0 0.1rem 0 0.1rem;
        height: 200%;
        width: calc(100% - 1.5rem);
        border: 0.02rem solid #efefef;
        border-radius: 0.04rem;
        box-sizing: border-box;
        font-size: 0.24rem;
        font-weight: normal;
        line-height: 0.4rem;
        text-align: left;
        color: #666;
        resize:none;
        &::-webkit-input-placeholder{
          color: #999;
        }
        &:focus{
          border-color: #D57DA7;
          outline: none;
        }
      }
      .icon-clear{
        display: block;
        position: absolute;
        top: 0.15rem;
        right: 0.1rem;
        width: 0.4rem;
        height: 0.4rem;
        background-image: url('./img/icon_clear.png');
        background-repeat: no-repeat;
        background-position: center center;
        background-size: 0.25rem 0.25rem;
        cursor: pointer;
      }
      .icon-pwd-hide{
        display: block;
        position:absolute;
        top: 0.15rem;
        right: 0.1rem;
        width: 0.4rem;
        height: 0.4rem;
        background-image: url('../../../assets/images/common/icon_eye_close.png');
        background-repeat: no-repeat;
        background-size: contain;
        cursor: pointer;
        &.icon-pwd-show{
          background-image: url('../../../assets/images/common/icon_eye_open.png');
        }
      }
    }
    .warning-wrapper{
      display: none;
      padding-left: 1.5rem;
      height: 0.4rem;
      width: 100%;
      box-sizing: border-box;
      .warning-icon{
        float: left;
        width: 0.4rem;
        height: 0.4rem;
        background-image: url('./img/icon_warning.png');
        background-repeat: no-repeat;
        background-position: center center;
        background-size: 0.2rem 0.2rem;
      }
      .warning-info{
        float: left;
        font-size: 0.2rem;
        font-weight: normal;
        line-height: 0.4rem;
        color: red;
      }
    }
    &.warning{
      .input-wrapper{
        input{
          border-color: red;
        }
      }
      .warning-wrapper{
        display: block
      }
    }
  }
}
</style>
