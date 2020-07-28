<template>
  <div id="header">
    <div class="content-left">
      <img class="logo" src="../../assets/images/head/logo.png" alt="thoroughCore">
    </div>
    <div class="content-right">
      <div class="userinfo-container">
        <img src="../../assets/images/head/img_doctor.png" class="user-photo">
        <span class="user-name">{{ name }}</span>
        <i class="icon-arrow-down"></i>
        <div class="dropdown-menu-wrapper">
          <div class="menu" @click="ReadyModifyPwd()">
            <i class="icon icon-pwd"></i>
            <span class="title">修改密码</span>
          </div>
          <div class="menu" @click="ReadySignOut()">
            <i class="icon icon-exit"></i>
            <span class="title">退出登录</span>
          </div>
        </div>
      </div>
    </div>
    <!-- [退出登录]弹框 -->
    <layer-sign-out ref="sign-out"/>
    <!-- [修改密码]弹框 -->
    <layer-modify-pwd ref="modify-pwd"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import LayerSignOut from 'widget/MyLayer/signOut.vue'
import LayerModifyPwd from 'widget/MyLayer/modifyPwd.vue'

@Component({
  components: {
    LayerSignOut,
    LayerModifyPwd
  }
})
export default class Heading extends Vue {
  $refs!: {
    vue: Vue,
    vues: Vue[],
    element: HTMLElement,
    elements: HTMLElement[],
    [prop: string]: any
  }
  name: string = ''

  mounted () {
    const user = this.$store.getters.getUser
    if (user.name) {
      this.name = `${user.name}`
    } else {
      this.name = '用户未登录'
    }
  }
  // [退出登录]询问
  ReadySignOut () {
    this.$refs['sign-out'].$emit('pop')
  }
  // [修改密码]询问
  ReadyModifyPwd () {
    this.$refs['modify-pwd'].$emit('pop')
  }
}
</script>

<style lang="less" scoped>
#header{
  height: 1.3rem;
  width: 100%;

  &:after{
    clear: both;
  }
}
.content-left{
  float: left;
  height: 100%;

  .logo{
    display: block;
    margin-top: 0.43rem;
    margin-left: 0.3rem;
    height: 0.37rem;
    width: auto;
  }
}
.content-right{
  float: right;
  margin-right: 0.3rem;
  height: 100%;

  .userinfo-container{
    position: relative;
    float: left;
    height: 100%;

    .user-photo{
      float: left;
      margin-top: 0.26rem;
      width: 0.48rem;
      height: 0.48rem;
    }
    .user-name{
      float: left;
      padding:0 0.1rem;
      min-width: 0.5rem;
      max-width: 5rem;
      font-size: 0.24rem;
      line-height: 1rem;
      color:#333;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
    .icon-arrow-down{
      float: left;
        width: 0.2rem;
        height: 1rem;
        background-image: url('../../assets/images/head/icon_arrow_down.png');
        background-repeat: no-repeat;
        background-position: center center;
        background-size: 0.2rem 0.13rem;
    }
    .dropdown-menu-wrapper{
      display: none;
      position: absolute;
      z-index: 1000;
      top: 1rem;
      left: -0.7rem;
      width: 2.2rem;
      height: auto;
      background-color: #fff;
      box-shadow:0 0 0.24rem 0.02rem rgba(97,97,97,0.3);
      border-radius: 0.1rem;

      &::after{
        content: '';
        display: block;
        position: absolute;
        top: -0.12rem;
        left: 0.82rem;
        border-left: 0.12rem solid transparent;
        border-right: 0.12rem solid transparent;
        border-bottom: 0.12rem solid #fff;
      }

      .menu{
        box-sizing: border-box;
        height: 0.7rem;
        cursor: pointer;
        &:first-child{
          border-radius: 0.1rem 0.1rem 0 0;
        }
        &:last-child{
          border-radius: 0 0 0.1rem 0.1rem;
        }
        &:hover{
          background-color: #f5f5f5;
        }
        .title{
          float: left;
          margin-left: 0.16rem;
          font-size: 0.22rem;
          line-height: 0.7rem;
          color:#666;
        }
        .icon{
          float: left;
          margin-left: 0.2rem;
          margin-right: 0.06rem;
          height: 0.7rem;
          width: 0.3rem;
          background-repeat: no-repeat;
          background-position: center center;
        }
        .icon-pwd{
          background-size: 0.22rem 0.22rem;
          background-image: url('../../assets/images/head/icon_pwd.png');
        }
        .icon-exit{
          background-size: 0.28rem 0.28rem;
          background-image: url('../../assets/images/head/icon_exit.png');
        }
      }
    }
    &:hover{
      .icon-arrow-down{
        background-image: url('../../assets/images/head/icon_arrow_up.png');
      }
      .dropdown-menu-wrapper{
        display: block;
      }
    }
  }
}
</style>
