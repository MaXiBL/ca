<template>
  <my-layer class="layer-wrapper" ref="layer" :title="'选择颜色'" :showButtons="false">
    <div class="color-picker" id="color-picker">
      <div class="body">
        <div class="color-panel" ref="color-panel" :style="{'background-color': panelColor}" @click="SelectColorRange2($event)">
          <div class="color-panel-whilte"></div>
          <div class="color-panel-black"></div>
        </div>
        <div class="color-bar" @click="SelectColorRange1($event)"></div>
      </div>
      <div class="footer">
        <input type="text" class="color-input" readonly v-model="editColor">
        <div class="color-shower" :style="{'background-color': editColor}"></div>
      </div>
    </div>
  </my-layer>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'

import layer from 'layer'
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
  panelColor: string = '#ff0000'
  editColor: string = '#ff0000'
  error: string = ''

  @Watch('editColor')
  onEditColorChange (val: string, oldVal: string) {
    this.$emit('pickColor', val)
  }

  mounted () {
    this.$on('pop', () => {
      this.panelColor = '#ff0000'
      this.editColor = '#ff0000'
      this.$refs.layer.$emit('showLayer', '5.4rem;', '6.4rem')
    })
  }

  SelectColorRange1 (event: any) {
    const percent = Math.round(event.offsetY / 240 * 100)
    let color
    if (percent < 17) {
      const colorNum = Math.round(255 * percent / 100)
      color = colorNum < 16 ? `#ff0${colorNum.toString(16)}00` : `#ff${colorNum.toString(16)}00`
    } else if (percent < 33) {
      const colorNum = Math.round(255 * (100 - percent) / 100)
      color = colorNum < 16 ? `#0${colorNum.toString(16)}ff00` : `#${colorNum.toString(16)}ff00`
    } else if (percent < 50) {
      const colorNum = Math.round(255 * percent / 100)
      color = colorNum < 16 ? `#00ff0${colorNum.toString(16)}` : `#00ff${colorNum.toString(16)}`
    } else if (percent < 67) {
      const colorNum = Math.round(255 * (100 - percent) / 100)
      color = colorNum < 16 ? `#000${colorNum.toString(16)}ff` : `#00${colorNum.toString(16)}ff`
    } else if (percent < 83) {
      const colorNum = Math.round(255 * percent / 100)
      color = colorNum < 16 ? `#0${colorNum.toString(16)}00ff` : `#${colorNum.toString(16)}00ff`
    } else {
      const colorNum = Math.round(255 * (100 - percent) / 100)
      color = colorNum < 16 ? `#ff000${colorNum.toString(16)}` : `#ff00${colorNum.toString(16)}`
    }
    this.panelColor = color
  }

  SelectColorRange2 (event: any) {
    const panelWidth = this.$refs['color-panel'].clientWidth
    const panelHeight = this.$refs['color-panel'].clientHeight
    // x 改变其中两个较小的值, y 改变其中两个较大的值
    const percentX = Math.round(event.offsetX / panelWidth * 100)
    const percentY = Math.round(event.offsetY / panelWidth * 100)

    let colorR = parseInt(this.panelColor.slice(1, 3), 16)
    let colorG = parseInt(this.panelColor.slice(3, 5), 16)
    let colorB = parseInt(this.panelColor.slice(5), 16)

    colorR = Math.round((255 - colorR) * (100 - percentX) / 100 + colorR)
    colorR = Math.round(colorR - percentY * colorR / 100)

    colorG = Math.round((255 - colorG) * (100 - percentX) / 100 + colorG)
    colorG = Math.round(colorG - percentY * colorG / 100)

    colorB = Math.round((255 - colorB) * (100 - percentX) / 100 + colorB)
    colorB = Math.round(colorB - percentY * colorB / 100)

    const colorRstr = colorR < 16 ? `0${colorR.toString(16)}` : colorR.toString(16)
    const colorGstr = colorG < 16 ? `0${colorG.toString(16)}` : colorG.toString(16)
    const colorBstr = colorB < 16 ? `0${colorB.toString(16)}` : colorB.toString(16)
    this.editColor = `#${colorRstr}${colorGstr}${colorBstr}`
  }
}
</script>

<style lang="less" scoped>
.layer-wrapper{
  .color-picker{
    background: #fff;
    padding: 0.01rem;
    box-sizing: border-box;
    .body{
      &::after{
        display: block;
        content: '';
        clear: both;
      }
      .color-panel{
        position: relative;
        float: left;
        width: 4rem;
        height: 4rem;
        background-color: red;
        cursor: pointer;
        .color-panel-whilte,
        .color-panel-black{
          position: absolute;
          top:0;
          left: 0;
          width: 4rem;
          height: 4rem;
        }
        .color-panel-whilte{
          background: linear-gradient(90deg,#fff, rgba(255, 255, 255, 0));
        }
        .color-panel-black{
          background: linear-gradient(0deg,#000,rgba(0, 0, 0, 0));
        }
      }
      .color-bar{
        float: left;
        margin-left: 0.1rem;
        width: 0.4rem;
        height: 4rem;
        cursor: pointer;
        background: linear-gradient(180deg,#f00 0,#ff0 17%,#0f0 33%,#0ff 50%,#00f 67%,#f0f 83%,#f00);
        // background: linear-gradient(180deg,#f00 0,#000);
      }
    }
    .footer{
      margin-top: 0.1rem;
      height: 0.8rem;
      .color-input{
        box-sizing: border-box;
        float: left;
        height: 0.8rem;
        width: 2rem;
        font-size: 0.3rem;
        font-weight: normal;
        line-height: 0.8rem;
        color: #333;
        &:focus{
          outline: none;
        }
      }
      .color-shower{
        float: left;
        margin-left: 0.1rem;
        height: 0.8rem;
        width: 2.4rem;
        font-size: 0.24rem;
        font-weight: normal;
        line-height: 0.8rem;
      }
    }
  }
}
</style>
