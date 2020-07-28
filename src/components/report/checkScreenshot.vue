<template>
  <div class="drawer-outer-container" v-if="show">
    <span class="btn-close" @click="ShowFalse"></span>
    <div class="drawer-inner-container">
      <div class="drawer-header">
        <div class="title">{{slideIndex}}</div>
      </div>
      <div class="box-container">
        <div @contextmenu.prevent class="screenshotImg" style="overflow: hidden;">
          <img draggable="true"
            @dragstart="StartMove($event)"
            @drag="Move($event)"
            @dragend='End($event)'
              ref="img-location" class="screen-img" :style="{
              'width': '100%',
              'height': '100%',
              'transform': `scale(${displacement})`}" :src="lookScreenshot" alt="">
        </div>
        <div class="btn-operation">
          <div @click="Shrink"><img src="~assets/images/report/icon_zoom_in.png" alt=""></div>
          <div>{{percentage}}</div>
          <div @click="Magnify"><img src="~assets/images/report/icon_zoom_out.png" alt=""></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import API from 'api'

@Component
export default class SlideDrawer extends Vue {
  $refs!: {
    vue: Vue,
    vues: Vue[],
    element: HTMLElement,
    elements: HTMLElement[],
    [prop: string]: any
  }

  show: boolean = false
  slideIndex: string = '(1点-2点)'
  // 查看截图图片，用来判断是否显示放大缩小按钮
  lookScreenshot: string = ''
  // 查看截图百分比
  percentage: any = '100%'
  // 查看截图图片偏移量
  displacement: number = 1
  // 图片开始位移开关
  startLocation: any = {}
  startImgLocation: any = {}
  opening: boolean = false
  lastLocation: any = {}

  mounted () {
    this.$on('showScreenshotItem', (item: any) => {
      if (item === 'close') {
        this.ShowFalse()
        return
      }
      this.show = true
      this.slideIndex = item.message
      this.lookScreenshot = `${API.GET_SCREENSHOT_DETAILS}?path=${item.path}`
    })
  }
  // 右上角叉号
  ShowFalse () {
    this.show = false
    // 初始化某些配置项
    this.$emit('monitorRefresh')
    this.percentage = '100%'
    this.displacement = 1
    this.lookScreenshot = ''
    this.opening = false
    this.lastLocation = {}
  }
  // 查看截图放大
  Magnify () {
    const tmpStr = this.percentage.substring(0, this.percentage.length - 1)
    if (tmpStr === '500') {
      return
    }
    this.percentage = (tmpStr - 0 + 50) + '%'
    this.displacement = (tmpStr - 0 + 50) / 100
  }
  // 查看截图缩小
  Shrink () {
    const tmpStr = this.percentage.substring(0, this.percentage.length - 1)
    if (tmpStr === '100') {
      return
    }
    this.percentage = (tmpStr - 0 - 50) + '%'
    this.displacement = (tmpStr - 50) / 100
  }
  StartMove (e: any) {
    this.startLocation = {
      x: e.clientX,
      y: e.clientY
    }
    this.startImgLocation = {
      left: e.currentTarget.offsetLeft,
      top: e.currentTarget.offsetTop
    }
  }
  Move (e: any) {
    const newPoint = {
      x: e.clientX,
      y: e.clientY
    }
    const newOffset = {
      left: newPoint.x - (this.startLocation.x - this.startImgLocation.left),
      top: newPoint.y - (this.startLocation.y - this.startImgLocation.top)
    }
    const imageContainer = this.$refs['img-location']
    if (this.lastLocation.left) {
      if (this.lastLocation.left - newOffset.left > 100 || this.lastLocation.left - newOffset.left < -100) {
        return
      }
    }
    this.lastLocation = {
      left: newOffset.left
    }
    imageContainer.style.left = `${newOffset.left}px`
    imageContainer.style.top = `${newOffset.top}px`
  }
  End (e?: any) {
    this.Move(e)
  }
}
</script>

<style lang="less" scoped>
.drawer-outer-container{
  position: absolute;
  top: 0;
  left: 0;
  padding: 1.2rem 0.3rem 0.3rem;
  width: calc(100% - 0.3rem - 0.2rem - 6.64rem);
  height: 100%;
  box-sizing: border-box;
  background-color: rgba(46,46,53,0.6);
  z-index: 2;
  .btn-close{
    position: absolute;
    top: 0;
    right: 0;
    width: 0.57rem;
    height: 0.52rem;
    background-image: url('~assets/images/report/btn_close.png');
    background-size: 0.92rem 0.92rem;
    background-position: 0 -0.4rem;
    cursor: pointer;
    &:hover{
      background-image: url('~assets/images/report/btn_close_hover.png');
    }
    &:active{
      background-image: url('~assets/images/report/btn_close_active.png');
    }
  }
  .drawer-inner-container{
    width: 100%;
    height: 100%;
    border-radius: 0.1rem;
    overflow: hidden;
    background-color: #fff;
    .drawer-header{
      position: relative;
      padding-left: 0.3rem;
      width: 100%;
      height: 1rem;
      box-sizing: border-box;
      background-color: #F4F4F4;
      .title{
        padding-left: 0.36rem;
        float: left;
        position: relative;
        font-size:0.28rem;
        font-weight:500;
        color:rgba(213,125,167,1);
        line-height: 1rem;
        &::after{
          content: '';
          position: absolute;
          top: 0.45rem;
          left: 0;
          display: block;
          width: 0.1rem;
          height: 0.1rem;
          border-radius: 50%;
          background-color: rgba(213,125,167,1);
        }
      }
    }
    .box-container {
      position: relative;
      height: 85%;
      .screenshotImg {
        width: 100%;
        height: 100%;
        position: relative;
        img {
          cursor: move;
          position: absolute;
        }
      }
      .btn-operation {
        float: right;
        height: 8%;
        display: flex;
        margin-right: 0.2rem;
        margin-top: 0.05rem;
        align-items: center;
        font-size: 0.8rem;
        color: #999999;
        div {
          cursor: pointer;
          width: 0.55rem;
          height: 0.55rem;
          font-size: 0.32rem;
          margin-left: 0.14rem;
          img {
            width: 100%;
            height: 100%;
          }
        }
        div:nth-child(2) {
          width: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
}
</style>
