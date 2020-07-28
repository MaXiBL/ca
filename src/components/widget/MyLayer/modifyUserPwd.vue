<template>
  <my-layer class="layer-wrapper" ref="layer" :title="'修改密码'" @ok="ClickOk" >
    <form>
      <div class="form-item" :class="{'warning': newPwdWarning}">
        <div class="input-wrapper">
          <span class="title">新密码</span>
          <input type="password" class="input" placeholder="请输入新密码"
            v-model="newPwd"
            @focus="newPwdWarning = false"
            @blur="TestNewPwd()">
          <i class="icon-clear"
            v-show="newPwd.length"
            @click="newPwd = ''">
          </i>
        </div>
        <div class="warning-wrapper">
          <i class="warning-icon"></i>
          <span class="warning-info">{{newPwdWarningText}}</span>
        </div>
      </div>
      <div class="form-item" :class="{'warning': confirmPwdWarning}">
        <div class="input-wrapper">
          <span class="title">确认密码</span>
          <input type="password" class="input" placeholder="请确认新密码"
            v-model="confirmPwd"
            @focus="confirmPwdWarning = false"
            @blur="TestConfirmPwd()">
          <i class="icon-clear"
            v-show="confirmPwd.length"
            @click="confirmPwd = ''">
          </i>
        </div>
        <div class="warning-wrapper">
          <i class="warning-icon"></i>
          <span class="warning-info">{{confirmPwdWarningText}}</span>
        </div>
      </div>
    </form>
  </my-layer>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

import layer from 'layer'

import MyLayer from 'widget/MyLayer/index.vue'

@Component({
  components: {
    MyLayer
  }
})
export default class LayerModifyUserPwd extends Vue {
  $refs!: {
    vue: Vue,
    vues: Vue[],
    element: HTMLElement,
    elements: HTMLElement[],
    [prop: string]: any
  }
  userId: string = ''
  newPwd: string = ''
  confirmPwd: string = ''
  newPwdWarning: boolean = false
  confirmPwdWarning: boolean = false
  newPwdWarningText: string = ''
  confirmPwdWarningText: string = ''

  mounted () {
    this.$on('pop', (userId: string) => {
      this.userId = userId
      this.InitData()
      this.$refs.layer.$emit('showLayer', '6.2rem;', '5rem')
    })
  }

  InitData () {
    this.newPwd = ''
    this.confirmPwd = ''
    this.newPwdWarning = false
    this.confirmPwdWarning = false
    this.newPwdWarningText = ''
    this.confirmPwdWarningText = ''
  }
  TestNewPwd () {
    /**
     * 验证新密码:长度为6~20的字母与数字的组合
     */
    if (/^[0-9a-zA-Z]{6,20}$/.test(this.newPwd)) {
      this.newPwdWarning = false
    } else {
      this.newPwdWarning = true
      this.newPwdWarningText = '密码是长度为6~20的字母与数字的组合'
      return false
    }
  }
  TestConfirmPwd () {
    /**
     * 验证再次输入新密码:必须与新密码相同
     */
    if (this.confirmPwd === this.newPwd) {
      this.confirmPwdWarning = false
    } else {
      this.confirmPwdWarning = true
      this.confirmPwdWarningText = '两次输入不一致'
      return false
    }
  }
  ClickOk (layerIndex: number) {
    this.TestNewPwd()
    this.TestConfirmPwd()
    if (!this.newPwdWarning && !this.confirmPwdWarning) {
      layer.close(layerIndex)
      this.$emit('ok', {
        userId: this.userId,
        newPwd: this.newPwd
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
        color: #666;
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
