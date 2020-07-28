<template>
  <div id="login" class="loginpage">
    <img class="logo-company" src="../assets/images/common/img_company_logo.png" alt="thorough images">
    <img class="img-2" src="../assets/images/login/img_2.png" alt="">
    <div class="center-container">
      <img class="img-1" src="../assets/images/login/img_1.png" alt="">
      <my-login></my-login>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import MyLogin from 'widget/MyLogin/index.vue'

@Component({
  components: {
    MyLogin
  }
})
export default class Login extends Vue {}
</script>

<style lang="less" scoped>
.loginpage {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url('../assets/images/login/bg_1.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  .logo-company{
    position: absolute;
    top: 0.58rem;
    left: 2.37rem;
    display: block;
    width: 1.75rem;
    height: 0.41rem;
  }
  .img-2{
    position: absolute;
    left: 0;
    bottom: 0;
    display: block;
    width: 100%;
  }
  .center-container{
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -4.3rem;
    margin-left: -8.2rem;
    width: 15.5rem;
    height: 8.91rem;

    .img-1{
      float: left;
      // position: absolute;
      // left: 1.36rem;
      // top: 1.57rem;
      display: block;
      width: 8.72rem;
      height: 8.91rem;
    }
  }
}
</style>
