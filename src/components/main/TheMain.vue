<template>
  <div id="main">
    <div class="container-left">
      <div class="container-left-content">
          <the-navbar/>
      </div>
    </div>
    <div class="container-right">
        <div class="container-right-content">
            <the-heading/>
            <div class="main-content">
              <router-view></router-view>
            </div>
        </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import TheHeading from './TheHeading.vue'
import TheNavbar from './TheNavbar.vue'

@Component({
  components: {
    TheHeading,
    TheNavbar
  }
})
export default class Main extends Vue {}
</script>

<style lang="less" scoped>
@right-content-bgc:#ebeff3;
@left-content-bgc:#f3f5f6;

  #main{
    position: relative;
    height:100%;

    &::after{
      display: block;
      content: '';
      clear: both;
    }
  }

/* 两列右侧自适应布局 */
  .container-left{
    position: absolute;;
    height: 100%;
    width: 2.84rem;
    overflow: hidden;

    .container-left-content{
      /*多列等高,使用margin,padding 正负抵消*/
      margin-bottom: -9999px;
      padding-bottom: 9999px;
      padding-top: 0.01rem;
      height:100%;
      background:rgba(40,41,53,1);
    }
  }
  .container-right{
    float:right;
    width:100%;
    height:100%;

    .container-right-content{
      margin-left: 2.84rem;
      height: 100%;
      background:rgba(241,242,247,1);

      .main-content{
        height: auto;
      }
    }
  }
</style>
