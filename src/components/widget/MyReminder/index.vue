<template>
  <div class="browser-reminder" v-if="showReminder">
    <div class="reminder-container">
      <div class="reminder-content">
        <span class="reminder-message">{{reminderMessage}}</span>
        <span class="download-link" @click="DownloadChrome()">chrome浏览器</span>
      </div>
      <i class="icon-close" @click="showReminder = false"></i>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Reminder extends Vue {
  showReminder: boolean = false
  reminderMessage: string = ''

  mounted () {
    this.DetectBrowser()
  }

  // 检测浏览器
  DetectBrowser () {
    const userAgent = window.navigator.userAgent
    const isChrome = userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Edge') === -1 && userAgent.indexOf('MetaSr') === -1
    if (!isChrome) {
      this.showReminder = true
      this.reminderMessage = '您正在使用 非Chrome 浏览器, 有些功能暂不支持,可能会影响您的体验,请下载'
    } else {
      const list = userAgent.split(' ')
      list.forEach((item: any) => {
        if (item.indexOf('Chrome') !== -1) {
          const chromeVersion = item.split('/')[1]
          if (Number(chromeVersion) < 47) {
            this.showReminder = true
            this.reminderMessage = '您正在使用 低版本Chrome 浏览器, 有些功能暂不支持,可能会影响您的体验,请下载'
          }
        }
      })
    }
  }

  // 下载浏览器
  DownloadChrome () {
    window.open('https://www.google.cn/chrome/')
  }
}
</script>

<style lang="less" scoped>
.browser-reminder{
  position: absolute;
  z-index: 999;
  top:0;
  width: 100%;
  height: 30px;
  background-color: #e94e44;
  font-size:16px;
  font-weight: normal;
  color:#fff;
  line-height: 30px;
  text-align: center;

  .reminder-container{
    position: absolute;
    left: 50%;
    float: left;
    margin-left: -350px;
    // transform: translateX(-50%);
    .reminder-content{
      float: left;
      .reminder-message{
        font-size: 0.24rem;
      }
      .download-link {
        color:#fff;
        text-decoration:underline;
        cursor: pointer;
      }
    }
    .icon-close{
      float: left;
      margin-top: 5px;
      margin-left: 20px;
      width: 20px;
      height: 20px;
      background-image: url('./img/icon_delate.png');
      background-repeat: no-repeat;
      background-size: contain;
      cursor: pointer;
    }
  }
}
</style>
