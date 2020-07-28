<template>
  <div class="my-progressbar" :style="{'width': width, 'height':height, 'border-radius': height}">
    <div class="progressbar-outer">
      <div class="progressbar-inner" :style="{'width': percent, 'background-color': innerColor, 'border-radius': height}"></div>
    </div>
    <div class="progress-status">
      {{status}}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Progressbar extends Vue {
  @Prop({ type: String })
  width!: string

  @Prop({ type: String })
  height!: string

  @Prop({ type: String, default: '0%' })
  percent!: string

  @Prop({ type: String })
  status!: string

  @Prop({ type: String, default: '#D57DA7' })
  innerColor!: string
}
</script>

<style lang="less" scoped>
.my-progressbar{
  width: 1rem;
  height: 0.17rem;
  .progressbar-outer{
    width: 100%;
    height: 100%;
    background-color: #dedede;
    border-radius: 0.17rem;
    overflow: hidden;
    .progressbar-inner{
      height: 100%;
      background-color: #D57DA7;
      border-radius: 0.17rem;
    }
  }
  .progress-status{
    font-size: 0.2rem;
    font-weight: normal;
    line-height: 0.3rem;
    text-indent: 0.1rem;
    text-align: left;
    color: #D57DA7;
  }
}
</style>
