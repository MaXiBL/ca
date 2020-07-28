<template>
  <my-layer class="layer-wrapper" ref="layer" :showHead="false" :showButtons="false">
    <i class="icon-close" @click="Cancel()"></i>
    <img class="img" src="./img/img_warning_2.png" alt="warning">
    <p class="md-title">确认要删除该账户吗?</p>
    <div class="form">
      <div class="form-item" :class="{'warning': userPwdWarning}">
        <div class="input-wrapper">
          <input class="input" placeholder="请输入当前账号的登录密码"
            :type="showPwd ? 'text' : 'password'"
            v-model="userPwd"
            @focus="userPwdWarning = false"
            @blur="TestUserPwd()">
          <i class="icon-pwd-hide"
            :class="{'icon-pwd-show': showPwd}"
            @click="showPwd = !showPwd"/>
        </div>
        <div class="warning-wrapper">
          <i class="warning-icon"></i>
          <span class="warning-info">{{userPwdWarningText}}</span>
        </div>
      </div>
    </div>
    <div class="btn-wrapper">
      <span class="btn btn-ok" :class="{'disable': !userPwd.length}" @click="ClickOk()">确认</span>
      <span class="btn btn-cancel" @click="Cancel()">取消</span>
    </div>
  </my-layer>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

import MyLayer from 'widget/MyLayer/index.vue'

@Component({
  components: {
    MyLayer
  }
})
export default class LayerDelUser extends Vue {
  $refs!: {
    vue: Vue,
    vues: Vue[],
    element: HTMLElement,
    elements: HTMLElement[],
    [prop: string]: any
  }
  userIds: string[] = []
  userPwd: string = ''
  showPwd: boolean = false
  userPwdWarning: boolean = false
  userPwdWarningText: string = ''

  mounted () {
    this.$on('pop', (userIds: string[]) => {
      this.InitData(userIds)
      this.$refs.layer.$emit('showLayer', '7.1rem;', '5rem')
    })
  }

  InitData (userIds: string[]) {
    this.userIds = userIds
    this.userPwd = ''
    this.showPwd = false
    this.userPwdWarning = false
    this.userPwdWarningText = ''
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
  Cancel () {
    this.$refs['layer'].$emit('close')
  }
  ClickOk (layerIndex: number) {
    this.TestUserPwd()
    if (!this.userPwdWarning) {
      this.$emit('ok', {
        userIds: this.userIds,
        userPwd: this.userPwd
      })
    }
  }
}
</script>

<style lang="less" scoped>
.layer-wrapper{
  .icon-close{
    position: static;
    float: right;
    margin-top: 0.27rem;
    width: 0.22rem;
    height: 0.22rem;
    background-image: url('./img/icon_close.png');
    background-repeat: no-repeat;
    background-size: contain;
    cursor: pointer;
  }
  .img{
    margin: 0.4rem auto;
    width: auto;
    height: 1.06rem;
  }
  .md-title{
    margin: 0;
    padding: 0;
    font-size: 0.3rem;
    font-weight: normal;
    line-height: 0.4rem;
    text-align: center;
  }
  .sm-title{
    margin: 0;
    padding: 0;
    font-size: 0.22rem;
    font-weight: normal;
    line-height: 0.4rem;
    text-align: center;
    color: #666;
  }
  .form{
    .form-item{
      margin: 0.2rem auto;
      height: 1.2rem;
      width: 4rem;
      .input-wrapper{
        position: relative;
        width: 100%;
        height: 0.7rem;

        .input{
          float: left;
          padding: 0 0.5rem 0 0.1rem;
          height: 100%;
          width: 100%;
          border: 0.02rem solid #efefef;
          border-radius: 0.04rem;
          box-sizing: border-box;
          font-size: 0.24rem;
          font-weight: normal;
          line-height: 0.7rem;
          text-align: left;
          color: #666;
          &:focus{
            border-color: #D57DA7;
            outline: none;
          }
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
  .btn-wrapper{
    position: absolute;
    left: 50%;
    bottom: 0;
    margin-left: -2.3rem;
    padding: 0.4rem 0;
    width: 4.6rem;
    height: auto;
    &::after{
      display: block;
      content: '';
      clear: both;
    }

    .btn{
      display: block;
      width:1.8rem;
      height:0.66rem;
      border-radius: 0.33rem;
      font-size:0.26rem;
      font-weight: normal;
      line-height: 0.66rem;
      text-align: center;
      cursor: pointer;
    }
    .btn-ok{
      float: left;
      color: #fff;
      background-color:#FF5961;
      &.disable{
        background-color: #C9C9C9 !important;
        box-shadow: none !important;
        cursor: not-allowed;
      }
      &:hover{
        background-color: #FF7279;
        box-shadow: 0 0.02rem 0.2rem rgba(229,72,79,0.53);
      }
      &:active{
        background-color: #E5484F;
      }
    }
    .btn-cancel{
      float: right;
      color:#666666;
      background:#fff;
      border:0.02rem solid #E5E5E5;
      box-sizing: border-box;
      &:hover{
        background-color: #E5E5E5;
        box-shadow: 0 0.02rem 0.2rem  rgba(194, 194, 194, 0.35);
      }
      &.active{
        background-color: #D0CFCF;
      }
    }
  }
}
</style>
