<template>
  <my-layer class="layer-modify-pwd" ref="layer" :title="'修改密码'" @ok="ClickOk" >
    <form action="" class="form-pwd">
      <div class="edit-item"
        :class="{'warning':oldPwdWarning}">
        <div class="input-wrapper">
          <span class="title">原始密码</span>
          <input type="text" class="input" placeholder="请输入原始密码"
            v-model="oldPwd"
            @focus="oldPwdWarning = false"
            @blur="TestOldPwd('blur')">
          <i class="icon-clear"
            :class="{'show-clear': oldPwd.length}"
            @click="oldPwd = ''">
          </i>
        </div>
        <div class="warning-wrapper">
          <i class="icon"></i>
          <span class="info">{{oldPwdWarningText}}</span>
        </div>
      </div>
      <div class="edit-item"
        :class="{'warning': newPwdWarning}">
        <div class="input-wrapper">
          <span class="title">新密码</span>
          <input type="text" class="input" placeholder="请输入新密码" autocomplete
            v-model="newPwd"
            @focus="newPwdWarning = false"
            @blur="TestNewPwd('blur')">
          <i class="icon-clear"
            :class="{'show-clear': newPwd.length}"
            @click="newPwd = ''">
          </i>
        </div>
        <div class="warning-wrapper">
          <i class="icon"></i>
          <span class="info">{{newPwdWarningText}}</span>
        </div>
      </div>
      <div class="edit-item"
        :class="{'warning':confirmPwdWarning}">
        <div class="input-wrapper">
          <span class="title">确认密码</span>
          <input type="text" class="input" placeholder="请再次输入密码" autocomplete
            v-model="confirmPwd"
            @focus="confirmPwdWarning = false"
            @blur="TestConfirmPwd('blur')">
            <i class="icon-clear"
              :class="{'show-clear': confirmPwd.length}"
              @click="confirmPwd = ''">
            </i>
        </div>
        <div class="warning-wrapper">
          <i class="icon"></i>
          <span class="info">{{confirmPwdWarningText}}</span>
        </div>
      </div>
    </form>
  </my-layer>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

import layer from 'layer'
import { MODIFY_PASSWORD } from 'service'
import { tokenName } from 'common'

import MyLayer from 'widget/MyLayer/index.vue'

@Component({
  components: {
    MyLayer
  }
})
export default class LayerModifyPwd extends Vue {
  $refs!: {
    vue: Vue,
    vues: Vue[],
    element: HTMLElement,
    elements: HTMLElement[],
    [prop: string]: any
  }
  oldPwd: string = ''
  newPwd: string = ''
  confirmPwd: string = ''
  showOldPwd: boolean = false
  showNewPwd: boolean = false
  showConfirmPwd: boolean = false
  oldPwdWarning: boolean = false
  newPwdWarning: boolean = false
  confirmPwdWarning: boolean = false
  oldPwdWarningText: string = ''
  newPwdWarningText: string = ''
  confirmPwdWarningText: string = ''

  mounted () {
    this.$on('pop', () => {
      this.oldPwd = ''
      this.newPwd = ''
      this.confirmPwd = ''
      this.showOldPwd = false
      this.showNewPwd = false
      this.showConfirmPwd = false
      this.oldPwdWarning = false
      this.newPwdWarning = false
      this.confirmPwdWarning = false
      this.$refs.layer.$emit('showLayer', '6.2rem;', '5.8rem')
    })
  }

  TestOldPwd (type?: string) {
    /**
     * 验证旧密码:长度为6~12的字母与数字的组合
     */
    if (type === 'blur' && this.oldPwd === '') {
      return false
    }
    if (/^[0-9a-zA-Z]{6,12}$/.test(this.oldPwd)) {
      this.oldPwdWarning = false
    } else {
      this.oldPwdWarning = true
      this.oldPwdWarningText = '密码为6~12的字母与数字的组合'
      return false
    }
  }
  TestNewPwd (type?: string) {
    /**
     * 验证新密码:长度为6~12的字母与数字的组合,且不能旧密码相同
     */
    if (type === 'blur' && this.newPwd === '') {
      return false
    }
    if (/^[0-9a-zA-Z]{6,12}$/.test(this.newPwd)) {
      if (this.newPwd === this.oldPwd) {
        this.newPwdWarning = true
        this.newPwdWarningText = '新密码不能与旧密码相同'
        return false
      } else {
        this.newPwdWarning = false
      }
    } else {
      this.newPwdWarning = true
      this.newPwdWarningText = '密码为6~12的字母与数字的组合'
      return false
    }
  }
  TestConfirmPwd (type?: string) {
    /**
     * 验证再次输入新密码:必须与新密码相同
     */
    if (type === 'blur' && this.newPwd === '' && this.confirmPwd === '') {
      return false
    }
    if (this.confirmPwd === this.newPwd) {
      this.confirmPwdWarning = false
    } else {
      this.confirmPwdWarning = true
      this.confirmPwdWarningText = '两次输入不一致'
      return false
    }
  }
  ClickOk (layerIndex: number) {
    this.TestOldPwd()
    this.TestNewPwd()
    this.TestConfirmPwd()
    if (!this.oldPwdWarning && !this.newPwdWarning && !this.confirmPwdWarning) {
      MODIFY_PASSWORD({
        oldPassword: this.oldPwd,
        newPassword: this.newPwd
      }).then((res: AxiosRes) => {
        if (res.data.success) {
          layer.close(layerIndex)
          layer.msg(res.data.message)
          window.localStorage.removeItem(tokenName)
          this.$store.commit('clearAll')
          this.$router.push('/login')
        } else {
          this.oldPwdWarning = true
          this.oldPwdWarningText = res.data.message
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.layer-modify-pwd{

  .form-pwd{
    .edit-item{
      height: 1.2rem;
      width: auto;
      &.warning{
        .input{
          border-color: red !important;
        }
        .warning-wrapper{
          display: block;
        }
      }
      .input-wrapper{
        position: relative;
        height: 0.7rem;
        width: auto;
        .title{
          float: left;
          height: 100%;
          width: calc(100% -  4.18rem);
          font-size: 0.24rem;
          font-weight: normal;
          line-height: 0.7rem;
          color: #666;
          text-align: left;
        }
        .input{
          float: left;
          padding-left: 0.22rem;
          padding-right: 0.8rem;
          height: 100%;
          width: 4.18rem;
          border: 0.02rem solid #EFEFEF;
          border-radius: 0.04rem;
          box-sizing: border-box;
          font-size: 0.24rem;
          font-weight: normal;
          line-height: 0.7rem;
          color: #333;
          &::-webkit-input-placeholder{
            color: #999;
          }
          &:focus{
            outline: none;
          }
          &:hover{
            border-color: #D57DA7;
          }
        }
        .icon-clear{
          display: none;
          position:absolute;
          top: 0;
          right: 0.18rem;
          width: 0.25rem;
          height: 100%;
          background-image: url('./img/icon_cancel.png');
          background-repeat: no-repeat;
          background-position: center center;
          background-size: 100% auto;
          cursor: pointer;
        }
        &:hover{
          .show-clear{
            display: block;
          }
        }
      }

      .warning-wrapper{
        display: none;
        padding-left: calc(100% -  4.18rem);
        height: 0.4rem;
        width: auto;
        .icon{
          float: left;
          width: 0.4rem;
          height: 0.4rem;
          background-image: url('./img/icon_warning.png');
          background-repeat: no-repeat;
          background-position: center center;
          background-size: 0.2rem 0.2rem;
        }
        .info{
          float: left;
          font-size: 0.2rem;
          font-weight: normal;
          line-height: 0.4rem;
          color: red;
        }
      }
    }
  }
  .btn-ok{
    background: linear-gradient(-90deg,rgba(181,106,155,1),rgba(228,137,131,1)) !important;
  }
}
</style>
