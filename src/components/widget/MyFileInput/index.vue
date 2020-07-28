<template>
  <div class="my-file-input" @click="SelectFile()">
    <span class="file-text" :class="{'grey': !fileName}">{{ !fileName ? placeholder : fileName}}</span>
    <input class="file-input" type="file" :accept="accept" ref="file-input" @change="InputChange()">
    <i class="icon-file"></i>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class FileInput extends Vue {
  @Prop({ type: String, default: '选择文件' })
  placeholder!: string

  @Prop({ type: String, default: '.xlsx' })
  accept!: string

  @Prop({ type: FileList })
  current!: object

  $refs!: {
    vue: Vue,
    vues: Vue[],
    element: HTMLElement,
    elements: HTMLElement[],
    [prop: string]: any
  }
  fileName: string = ''

  SelectFile () {
    this.$refs['file-input'].click()
  }
  InputChange () {
    const inputElement = this.$refs['file-input']
    if (inputElement.files.length) {
      const inputFile = inputElement.files[0]
      this.fileName = inputFile.name
      // 选择文件后,返回文件对象,等待上传
      this.$emit('update:current', inputElement.files)
    } else {
      this.fileName = ''
    }
  }
}
</script>

<style lang="less" scoped>
  .my-file-input{
    position: relative;
    padding: 0 0.3rem;
    width: 3rem;
    border-radius: 0.4rem;
    background-color: #fff;
    box-sizing: border-box;
    cursor: pointer;

    .file-text{
      display: block;
      position: absolute;
      top: 50%;
      margin-top: -0.2rem;
      height: 0.4rem;
      width: 80%;
      border: none;
      font-size: 0.24rem;
      font-weight: normal;
      line-height: 0.4rem;
      background: transparent;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      &.grey{
        color: #999;
      }
    }
    .file-input{
      display: none;
    }
    .icon-file{
      display: block;
      position: absolute;
      top: 50%;
      right: 0.26rem;
      margin-top: -0.16rem;
      height: 0.32rem;
      width: 0.32rem;
      background-image: url('./img/icon_file.png');
      background-repeat: no-repeat;
      background-size: contain;
    }
  }
</style>
