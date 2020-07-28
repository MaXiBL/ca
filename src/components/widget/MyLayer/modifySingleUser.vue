<template>
  <my-layer class="layer-wrapper" ref="layer" :title="'修改医生信息'" @ok="ClickOk" >
    <form>
      <div class="form-item">
        <div class="input-wrapper">
          <span class="title">所属医院</span>
          <my-select class="select-input"
            :placeholder="'请选择所属医院'"
            :list="hospitalList"
            :current.sync="selectedHospital">
          </my-select>
        </div>
      </div>
      <div class="form-item">
        <div class="input-wrapper">
          <span class="title">用户角色</span>
          <my-select class="select-input"
            :placeholder="'请选择用户角色'"
            :list="roleList"
            :current.sync="selectedRole">
            <i class="icon-none"></i>
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
          <input type="text" class="input" placeholder="请输入用户姓名"
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
    </form>
  </my-layer>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

import layer from 'layer'
import { UPDATE_USER_INFO } from 'service'

import MyLayer from 'widget/MyLayer/index.vue'
import MySelect from 'widget/MySelect/index.2.vue'

@Component({
  components: {
    MyLayer,
    MySelect
  }
})
export default class LayerModifySingleUser extends Vue {
  $refs!: {
    vue: Vue,
    vues: Vue[],
    element: HTMLElement,
    elements: HTMLElement[],
    [prop: string]: any
  }
  userInfo: any = {}
  selectedHospital: any = {}
  selectedRole: any = {}
  loginName: string = ''
  userName: string = ''
  loginNameWarning: boolean = false
  userNameWarning: boolean = false
  loginNameWarningText: string = ''
  userNameWarningText: string = ''

  get hospitalList () {
    return this.$store.getters['getHospitalList']
  }
  get roleList () {
    return this.$store.getters['getRoleList']
  }

  mounted () {
    this.$on('pop', (user: object) => {
      this.InitData(user)
      this.$refs.layer.$emit('showLayer', '6.2rem;', '8.3rem')
    })
  }

  InitData (user: any) {
    this.userInfo = user
    this.loginName = user.loginName
    this.userName = user.userName
    this.loginNameWarning = false
    this.userNameWarning = false
    this.loginNameWarningText = ''
    this.userNameWarningText = ''

    this.roleList.forEach((item: any) => {
      if (item.id === user.userType) {
        this.selectedRole = item
      }
    })
    this.hospitalList.forEach((item: any) => {
      if (item.name === user.hospital) {
        this.selectedHospital = item
      } else {
        this.selectedHospital = this.hospitalList[0]
      }
    })
  }
  TestLoginName () {
    /**
     * 验证用户名
     */
    if (/^[0-9a-zA-Z]{4,20}$/.test(this.loginName)) {
      this.loginNameWarning = false
    } else {
      this.loginNameWarning = true
      this.loginNameWarningText = '登录名为长度4~20的字母与数字的组合'
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
  ClickOk (layerIndex: number) {
    this.TestLoginName()
    this.TestUserName()
    if (!this.loginNameWarning && !this.userNameWarning) {
      UPDATE_USER_INFO({
        id: this.userInfo.id,
        loginName: this.loginName,
        name: this.userName,
        userType: this.selectedRole.id,
        companyId: this.selectedHospital.id
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
    height: 1.4rem;
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
