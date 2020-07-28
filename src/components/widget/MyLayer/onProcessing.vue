<template>
  <my-layer class="layer-wrapper" ref="layer" :showHead="false" :showButtons="false">
    <img class="processing" src="./img/img_processing.gif" alt="">
  </my-layer>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

import MyLayer from 'widget/MyLayer/index.vue'

@Component({
  components: {
    MyLayer
  }
})
export default class LayerOnProcessing extends Vue {
  $refs!: {
    vue: Vue,
    vues: Vue[],
    element: HTMLElement,
    elements: HTMLElement[],
    [prop: string]: any
  }
  userIds: any[] = []
  userPwd: string = ''
  showPwd: boolean = false
  userPwdWarning: boolean = false
  userPwdWarningText: string = ''

  mounted () {
    this.$on('pop', (userIds: string[]) => {
      this.InitData(userIds)
      this.$refs.layer.$emit('showLayer', '3rem;', '3rem')
    })
  }

  InitData (userIds: string[]) {
    this.userIds = userIds
    this.userPwd = ''
    this.showPwd = false
    this.userPwdWarning = false
    this.userPwdWarningText = ''
  }
  TestUserPwd () {
    /**
     * 验证新密码:长度为6~20的字母与数字的组合
     */
    if (/^[0-9a-zA-Z]{6,20}$/.test(this.userPwd)) {
      this.userPwdWarning = false
    } else {
      this.userPwdWarning = true
      this.userPwdWarningText = '密码是长度为6~20的字母与数字的组合'
      return false
    }
  }
  Cancel () {
    this.$refs['layer'].$emit('close')
  }
  ClickOk (layerIndex: number) {
    this.TestUserPwd()
    if (!this.userPwdWarning) {
      this.$emit('ok', {
        userIds: this.userIds,
        userPwd: this.userPwd
      })
    }
  }
}
</script>

<style lang="less" scoped>
.layer-wrapper{
  position: relative;
  .processing{
    position: absolute;
    top: 50%;
    left: 50%;
    display: block;
    margin-left: -1.1rem;
    margin-top: -1.1rem;
    height: 2.2rem;
    width: 2.2rem;
  }
}
</style>
