<template>
  <div class="login-content">
    <img class="logo-product" src="./img/img_product_logo.png">
    <form method="post" id="login-form" class="login-form" >
      <!-- 输入用户名 -->
      <div class="form-item" :class="{'warning': nameWarning}">
          <div class="input-wrapper">
            <i class="icon icon-user"></i>
            <input id="username" name="username" required="required" type="text" placeholder="请输入用户名" autocomplete="off"
              v-model="username"
              @focus="nameWarning = false"
              @blur="TestName('blur')">
          </div>
          <div class="warning-wrapper">
            <i class="icon-warning"></i>
            <span class="info">{{nameWarningText}}</span>
          </div>
      </div>
      <!-- 输入密码 -->
      <div class="form-item" :class="{'warning': pwdWarning}">
        <div class="input-wrapper">
          <i class="icon icon-pwd"></i>
          <input id="password" name="password" required="required" placeholder="请输入密码" autocomplete="off"
            :type="showpwd ? 'text' : 'password'"
            v-model="password"
            @focus="pwdWarning = false"
            @blur="TestPwd('blur')">
          <i class="icon-pwd-hide" :class="{'icon-pwd-show': showpwd}" @click="showpwd = !showpwd"></i>
        </div>
        <div class="warning-wrapper">
          <i class="icon-warning"></i>
          <span class="info">{{pwdWarningText}}</span>
        </div>
      </div>
      <!-- 输入验证码 -->
      <div class="form-item" :class="{'warning': verificationWarning}">
        <div class="input-wrapper">
          <i class="icon icon-verification"></i>
          <input class="input-verification" name="verification" required="required" type="text" placeholder="请输入验证码" autocomplete="off"
          v-model="verificationValue"
          @focus="verificationWarning = false"
          @blur="TestVerification('blur')">
          <img class="img-verification"  alt="点击刷新" title="点击刷新验证码"
          :src="`data:image/jpeg;base64,${verificationString}`"
          @click="GetVerification()">
        </div>
        <div class="warning-wrapper">
          <i class="icon-warning"></i>
          <span class="info">{{verificationText}}</span>
        </div>
      </div>
      <!-- 登陆按钮 -->
      <div class="form-item item-submit">
        <button type="submit" class="btn-submit" @click.prevent.enter="Login()">登录</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import layer from 'layer'
import { ErrorHandler, createGuid, tokenName } from 'common'
import { LOGIN, GET_VERIFICATION, GET_USER_INFO } from 'service'

@Component
export default class LoginBox extends Vue {
  username: string = ''
  password: string = ''
  verificationString: string = ''
  verificationValue: string = ''
  verificationKey: string = ''
  guid: string = ''
  showpwd: boolean = false
  nameWarning: boolean = false
  pwdWarning: boolean = false
  verificationWarning: boolean = false
  nameWarningText: string = ''
  pwdWarningText: string = ''
  verificationText: string = ''

  mounted () {
    this.GetVerification()
  }

  // 获取验证码
  GetVerification () {
    const guid = createGuid()
    this.guid = guid
    GET_VERIFICATION({
      captchaKey: guid
    }).then((res: AxiosRes) => {
      if (res && res.data.success) {
        this.verificationString = res.data.data.value
        this.verificationKey = res.data.data.key
      } else {
        ErrorHandler(res)
      }
    })
  }
  // 验证用户名
  TestName (type?: string) {
    /**
     * 验证用户名: 字母和数字的组合
     */
    if (type === 'blur' && this.username === '') {
      return false
    }
    if (/^[0-9a-zA-Z]{1,}$/.test(this.username)) {
      this.nameWarning = false
    } else {
      this.nameWarning = true
      this.nameWarningText = '用户名为字母与数字的组合,且不能为空'
    }
  }
  // 验证用户密码
  TestPwd (type?: string) {
    /**
     * 验证密码:长度为6~12的字母与数字的组合,且不能旧密码相同
     */
    if (type === 'blur' && this.password === '') {
      return false
    }
    if (/^[0-9a-zA-Z]{6,12}$/.test(this.password)) {
      this.pwdWarning = false
    } else {
      this.pwdWarning = true
      this.pwdWarningText = '用户密码是长度为6~12的字母与数字的组合'
      return false
    }
  }
  // 验证码
  TestVerification (type?: string) {
    if (type === 'blur' && this.verificationValue === '') {
      return false
    }
    if (/^[0-9a-zA-Z]{4}$/.test(this.verificationValue)) {
      this.verificationWarning = false
    } else {
      this.verificationWarning = true
      this.verificationText = '验证码长度为4'
      return false
    }
  }
  // 登录
  Login () {
    this.TestName()
    this.TestPwd()
    this.TestVerification()
    if (this.nameWarning || this.pwdWarning || this.verificationWarning) {
      return false
    }
    // 设置登录 token, 值固定
    window.localStorage.setItem(tokenName, 'Basic YnJvd3NlcjoxMjM=')
    LOGIN({
      scope: 'ui',
      grant_type: 'password',
      username: this.username,
      password: this.password,
      captchaKey: this.guid,
      captcha: this.verificationValue,
      deviceType: 2,
      deviceName: '未知'
    }).then((res: AxiosRes) => {
      if (res.data.success) {
        window.localStorage.setItem(tokenName, `bearer ${res.data.data.access_token}`)
        this.GetUserInfo()
      } else {
        this.GetVerification()
        this.verificationValue = ''
        ErrorHandler(res)
      }
    })
  }
  // 获取用户信息
  GetUserInfo () {
    GET_USER_INFO()
      .then((res: AxiosRes) => {
        if (res.data.success) {
          this.$store.commit('setUser', {
            name: res.data.data.name,
            userId: res.data.data.id,
            userType: res.data.data.userType,
            userTypeName: res.data.data.userTypeName
          })
          this.$router.push({ path: '/home' })
        } else {
          ErrorHandler(res)
        }
      })
  }
}
</script>

<style lang="less" scoped>
.login-content {
  float: left;
  width: 6.78rem;
  height: 7.5rem;
  border-radius: 0.1rem;
  background-color:#fff;

  .logo-product {
    display: block;
    margin: 0.55rem auto 0.52rem;
    width: 4.57rem;
    height: 1.21rem;
  }
  .login-form {
    margin: 0 auto;
    width: 5.6rem;
    height: auto;

    .form-item {
      height: 1.3rem;
      &.warning{
        .input-wrapper{
          border-color: red
        }
        .warning-wrapper{
          display: block;
        }
      }
      .input-wrapper{
        position: relative;
        height: 0.8rem;
        width: 100%;
        border:0.02rem solid rgba(220,220,220,1);
        border-radius: 0.4rem;
        overflow: hidden;

        &:hover{
          border-color:#d57da7;
        }
        .icon{
          position: relative;
          float: left;
          margin-top: 0.15rem;
          margin-left: 0.3rem;
          width: 0.5rem;
          height: 0.5rem;
          background-repeat: no-repeat;
          background-size: 0.5rem auto;
          background-position: center center;
          &::after{
            content: '';
            position: absolute;
            top: 0.05rem;
            right: -0.14rem;
            display: block;
            width:0.02rem;
            height:0.4rem;
            background:rgba(199,199,199,1);
            opacity:0.4;
          }
        }
        .icon-user {
          background-image: url('./img/icon_user.png');
        }
        .icon-pwd {
          background-image: url('./img/icon_pwd.png');
        }
        .icon-verification {
          background-image: url('./img/icon_verification.png');
        }
        .icon-pwd-hide{
          position:absolute;
          top: 0.18rem;
          right: 0.44rem;
          width: 0.46rem;
          height: 0.46rem;
          background-image: url('./img/icon_eye_close.png');
          background-repeat: no-repeat;
          background-size: contain;
          cursor: pointer;
          &.icon-pwd-show{
            background-image: url('./img/icon_eye_open.png');
          }
        }
        input {
          float: left;
          margin-left: 0.3rem;
          padding: 0;
          width: 3rem;
          outline: none;
          border: none;
          background:none;
          font-size: 0.26rem;
          font-weight: normal;
          color:#333;
          line-height: 0.8rem;

          &::-webkit-input-placeholder{
            color: #dcdcdc;
          }
        }
        .input-verification{
          width: 2rem;
        }
        .img-verification{
          float: right;
          margin: 0.1rem 0.4rem;
          width: 1.3rem;
          height: 0.6rem;
          background:rgba(238,238,238,1);
          font-size: 0.24rem;
          font-weight: normal;
          line-height: 0.6rem;
          text-align: center;
          cursor: pointer;
        }
      }
      .warning-wrapper{
        display: none;
        padding-left: 0.5rem;
        height: 0.4rem;
        width: auto;

        .icon-warning{
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
      .btn-submit[type="submit"] {
        display: block;
        padding: 0;
        width: 100%;
        line-height: 0.8rem;
        border-radius: 0.4rem;
        border:none;
        text-align: center;
        color: #fff;
        font-size: 0.26rem;
        cursor: pointer;
        background: linear-gradient( to right, #d57da7, #b56a9b);
        &:hover {
          box-shadow: 0 0.05rem 0.24rem #f1c8e2;
        }
        &:focus{
          outline:none;
        }
      }
    }
    .item-submit{
      border:none;
    }
  }
}
</style>
