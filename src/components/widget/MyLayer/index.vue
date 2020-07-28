<template>
  <div class="my-layer" :id="layerId">
    <div class="head" v-if="showHead">
      <span class="title">{{title}}</span>
      <i class="icon-close" @click="Cancel()"></i>
    </div>
    <div class="content">
      <slot>
        <span class="title">填充内容</span>
      </slot>
    </div>
    <div class="btn-wrapper" v-if="showButtons">
      <span class="btn btn-ok" :class="`btn-type-${buttonType}`" @click="Affirm()">确认</span>
      <span class="btn btn-cancel" @click="Cancel()">取消</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

import $ from 'jquery'
import layer from 'layer'

@Component
export default class Layer extends Vue {
  @Prop({ type: String, default: '' })
  title!: string

  @Prop({ type: Boolean, default: true })
  showHead!: boolean

  @Prop({ type: Boolean, default: true })
  showButtons!: boolean

  @Prop({ type: Number, default: 1 })
  buttonType!: number

  layerId: string = `layer_${Math.random().toString().replace('.', '')}`
  layerIndex: string = ''

  mounted () {
    this.$on('showLayer', (width: string, height: string) => {
      this.ShowLayer(width, height)
    })
    this.$on('close', () => {
      layer.close(this.layerIndex)
    })
  }

  ShowLayer (width: string, height: string) {
    this.layerIndex = layer.open({
      type: 1,
      title: false,
      shadeClose: true,
      closeBtn: 0,
      area: [width, height],
      content: $(`#${this.layerId}`)
    })
  }
  Affirm () {
    // layer.close(this.layerIndex)
    this.$emit('ok', this.layerIndex)
  }
  Cancel () {
    layer.close(this.layerIndex)
    this.$emit('Cancel')
  }
}
</script>

<style lang="less" scoped>
.my-layer{
  position: relative;
  display: none;
  padding-left: 0.42rem;
  padding-right: 0.42rem;
  padding-top: 0.01rem;
  width: 100%;
  height: 100%;
  border-radius: 0.1rem;
  box-sizing: border-box;
  background: #fff;
  box-shadow: 0 0.02rem 0.24rem rgba(97,97,97,0.21);
  .head{
    margin-bottom: 0.4rem;
    height: 0.76rem;
    width: auto;
    border-bottom: 0.01rem solid #F4F4F4;

    .title{
      float: left;
      display: block;
      font-size: 0.28rem;
      font-weight: normal;
      line-height: 0.76rem;
      color: #666;
      text-align: left;
    }
    .icon-close{
      float: right;
      margin-top: 0.27rem;
      width: 0.22rem;
      height: 0.22rem;
      cursor: pointer;
      background-image: url('./img/icon_close.png');
      background-repeat: no-repeat;
      background-size: contain;
    }
  }
  .content{
    // font-size: 0.3rem;
    text-align: center;
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
      &.btn-type-1{
        background-color:#D57DA7;
        &:hover{
          background-color: #DF92B7;
          box-shadow: 0 0.02rem 0.2rem rgba(223,146,183,0.53);
        }
        &:active{
          background-color: #D6709D;
        }
      }
      &.btn-type-2{
        background-color: #FF5961;
        &:hover{
          background-color: #FF7279;
          box-shadow: 0 0.02rem 0.2rem rgba(229,72,79,0.53);
        }
        &:active{
          background-color: #E5484F;
        }
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
