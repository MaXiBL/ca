<template>
  <my-layer class="layer-wrapper" ref="layer" :showHead="false" :showButtons="false" @ok="ClickOk">
    <i class="icon-close" @click="Cancel()"></i>
    <div class="head-title">Cervix 结构化病理报告</div>
    <div class="case-info">
      <div class="info-item"
      v-for="(item, index) in report.info"
      :key="index">
        {{`${item.title}：${item.content}`}}
      </div>
    </div>
    <div class="case-image">
      <div class="title">肉眼及光镜所见：</div>
      <div class="image-container">
        <img :src="imgSrc1" alt="">
        <img :src="imgSrc2" alt="">
      </div>
    </div>
    <div class="case-result">
      <div class="title">病理诊断：</div>
      <div class="result-lit">
        <div class="list-item"
        v-for="(item, index) in reportResult"
        :key="index">
          {{item}}
        </div>
      </div>
    </div>
  </my-layer>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

import layer from 'layer'
import api from 'api'
import { LOGOUT } from 'service'
import { tokenName } from 'common'

import MyLayer from 'widget/MyLayer/index.vue'

@Component({
  components: {
    MyLayer
  }
})
export default class LayerSignOut extends Vue {
  $refs!: {
    vue: Vue,
    vues: Vue[],
    element: HTMLElement,
    elements: HTMLElement[],
    [prop: string]: any
  }

  report: any = {}
  reportResult: any[] = []
  imgSrc1: string = ''
  imgSrc2: string = ''

  mounted () {
    this.$on('pop', (report: any) => {
      if (report) {
        this.report = report
        this.reportResult = report.diagnose.split('\n')
        this.imgSrc1 = `${api.CASE_REPORT_IMAGE}?path=${report.picPath}`
        this.imgSrc2 = `${api.CASE_REPORT_IMAGE}?path=${report.slidePath}`
      }
      this.$refs.layer.$emit('showLayer', '13.4rem;', '9.7rem')
    })
  }

  Cancel () {
    this.$refs['layer'].$emit('close')
  }
  ClickOk (layerIndex: number) {
    layer.close(layerIndex)
    LOGOUT()
      .then((res: AxiosRes) => {
        window.localStorage.removeItem(tokenName)
      }).catch((err: AxiosErr) => {
        return err
      })
    this.$store.commit('clearAll')
    this.$router.push('/login')
  }
}
</script>

<style lang="less" scoped>
.layer-wrapper{
  position: relative;
  padding: 0 1rem;
  .icon-close{
    position: absolute;
    top: 0.2rem;
    right: 0.2rem;
    width: 0.22rem;
    height: 0.22rem;
    background-image: url('./img/icon_close.png');
    background-repeat: no-repeat;
    background-size: contain;
    cursor: pointer;
  }
  .head-title{
    font-size: 0.3rem;
    font-weight: normal;
    line-height: 1.1rem;
    text-align: center;
    color: #333;
  }
  .case-info{
    display: flex;
    justify-content: space-between;
    width: auto;
    height: 0.94rem;
    border-top: 0.02rem solid #E8E8E8;
    border-bottom: 0.02rem dashed #E8E8E8;
    .info-item{
      width: auto;
      height: 100%;
      font-size: 0.2rem;
      font-weight: normal;
      line-height: 0.94rem;
      // text-align: left;
      color: #333;
    }
  }
  .case-image{
    position: relative;
    width: auto;
    height: 3.96rem;
    border-bottom: 0.02rem dashed #E8E8E8;
    .title{
      position: absolute;
      top: 0.37rem;
      left: 0;
      font-size: 0.2rem;
      font-weight: normal;
      line-height: 0.2rem;
      color: #333;
    }
    .image-container{
      position: absolute;
      top: 0.37rem;
      left: 50%;
      margin-left: -3.4rem;
      width: 6.8rem;
      height: 3.2rem;
      img{
        float: left;
        width: 3.2rem;
        height: 3.2rem;
        border-radius: 0.1rem;
        background-color: #f1f1f1;
        &:first-child{
          margin-right: 0.4rem;
        }
      }
    }
  }
  .case-result{
    position: relative;
    width: auto;
    height: 3.6rem;
    .title{
      position: absolute;
      top: 0.37rem;
      left: 0;
      font-size: 0.2rem;
      font-weight: normal;
      line-height: 0.2rem;
      color: #333;
    }
    .result-lit{
      position: absolute;
      top: 0.37rem;
      left: 50%;
      margin-left: -3.4rem;
      width: 6.8rem;
      height: 3.2rem;
      .list-item{
        position: relative;
        padding-left: 0.2rem;
        font-size: 0.2rem;
        font-weight: normal;
        line-height: 0.38rem;
        text-align: left;
        color: #333;
        &::before{
          position: absolute;
          top: -0.04rem;
          left: 0;
          content: '·';
          font-size: 0.5rem;
          line-height: 0.38rem;
          color: #D57DA7;
        }
      }
    }
  }
}
</style>
