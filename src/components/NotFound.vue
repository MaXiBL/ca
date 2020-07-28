<template>
  <div id="notFound">
    <div class="content">
      <img src="../assets/images/notFound/404.jpg" alt="404" class="img-404">
      <p class="message">抱歉,出现错误啦~</p>
      <router-link to="/home"><p class="tip">返回首页</p></router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class NotFound extends Vue {}
</script>

<style lang="less" scoped>
#notFound{
  .content{
    position: relative;
    height: 5rem;
    width: 7rem;
    top: 50%;
    left: 50%;
    transform: translate(-50%, 50%);

    .img-404{
      display: block;
      margin: 0 auto;
      width: 5rem;
    }
    .message{
      margin: 0.5rem 0 0.3rem;
      font-size: 0.3rem;
      font-weight: normal;
      text-align: center;
      color:#999;
    }
    a{
      text-decoration:none;
    }
    .tip{
      margin: 0.3rem 0;
      font-size: 0.28rem;
      font-weight: normal;
      text-align: center;
      color:#b56a9b;
      line-height: 0.4rem;
    }
  }
}
</style>
