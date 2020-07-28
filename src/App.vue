<template>
  <div id="app" @click="GlobalClick($event)">
    <my-reminder></my-reminder>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'

import layer from 'layer'
import { version } from 'common'
// import initMock from 'mock'

import MyReminder from 'widget/MyReminder/index.vue'

@Component({
  components: {
    MyReminder
  }
})
export default class App extends Vue {
  showReminder: boolean = false
  reminderMessage: string = ''

  @Watch('$route')
  onRouteChange () {
    layer.closeAll()
  }

  created () {
    // initMock()
  }
  mounted () {
    this.PrintVersion()
  }

  // 打印版本信息
  PrintVersion () {
    console.log(`%c Cervix Admin当前版本为 ${version.number}, 更新日期为 ${version.date}`, 'color: #b56a9b; font-size: 20px')
  }

  // 最外层点击事件
  GlobalClick (event: any) {
    /**
     * 1.先看看点击DOM的元素本身或父类元素是否包含 panel-wrapper
     * 2.存在: .panel-wrapper 自生之外的所有 show-panel 都去掉
     * 3.不存在: 去掉所有 .show-panel
     */
    let panel
    if ($(event.target).hasClass('panel-wrapper')) {
      panel = event.target
    } else if ($(event.target).parents().hasClass('panel-wrapper')) {
      panel = $(event.target).parents('.panel-wrapper')
    }

    if (panel) {
      $('.show-panel').not(panel).removeClass('show-panel')
    } else {
      $('.show-panel').removeClass('show-panel')
    }
  }
}
</script>

<style lang="css">
@import url('~normalize.css');
@import url('~public/plugins/layer/theme/default/layer.css');
</style>

<style lang="less">
@import url('~assets/styles/common.less');
</style>
