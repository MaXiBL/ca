<template>
  <my-layer class="layer-wrapper" ref="layer" :showHead="false" @ok="ClickOk">
    <i class="icon-close" @click="Cancel()"></i>
    <img class="img" src="./img/img_warning_1.png" alt="warning">
    <p class="md-title">确认要删除截图吗</p>
  </my-layer>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

import layer from 'layer'
import { DEL_SCREENSHOT_ITEM } from 'service'
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
  deleteMessage: any = {}

  mounted () {
    this.$on('pop', (item: object) => {
      this.$refs.layer.$emit('showLayer', '7.1rem;', '4.3rem')
      this.deleteMessage = item
    })
  }

  Cancel () {
    this.$refs['layer'].$emit('close')
  }
  async ClickOk (layerIndex: number) {
    layer.close(layerIndex)

    const res = await DEL_SCREENSHOT_ITEM({
      medicalRecordNumber: this.deleteMessage.medicalRecordNumber,
      path: this.deleteMessage.path
    })
    if (res.data.success) {
      layer.msg('删除成功')
      this.$emit('deldeteSucceed')
    } else {
      layer.msg('删除失败')
    }
  }
}
</script>

<style lang="less" scoped>
.layer-wrapper{
  .icon-close{
    position: static;
    float: right;
    margin-top: 0.27rem;
    width: 0.22rem;
    height: 0.22rem;
    background-image: url('./img/icon_close.png');
    background-repeat: no-repeat;
    background-size: contain;
    cursor: pointer;
  }
  .img{
    margin: 0.4rem auto 0;
    padding-left: 0.4rem;
    width: auto;
    height: 1.26rem;
  }
  .md-title{
    margin: 0;
    padding: 0;
    font-size: 0.3rem;
    font-weight: normal;
    line-height: 0.4rem;
    text-align: center;
  }
  .sm-title{
    margin: 0;
    padding: 0;
    font-size: 0.22rem;
    font-weight: normal;
    line-height: 0.4rem;
    text-align: center;
    color: #666;
  }
}
</style>
