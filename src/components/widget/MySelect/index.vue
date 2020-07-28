<template>
  <div class="my-select panel-wrapper"
    ref="select-panel"
    :class="{'disable': list.length < 2}">
    <div class="current-select" @click="ToggleList()">
      <slot>
        <i class="icon"></i>
      </slot>
      <div class="title-wrapper">
        <span class="title single" v-if="!multiple && current.value">
          {{current.value}}
        </span>
        <span class="title" v-else
          v-for="(item, index) in checkedItems"
          :key="index">
          {{item.value}}
        </span>
        <span class="title grey" v-if="(!multiple && !current.value) || (multiple && !currentList.length)">
          {{placeholder}}
        </span>
      </div>
      <i class="icon-arrow" :class="{'disable': list.length < 2}"></i>
    </div>
    <div class="option-list">
      <div class="list-item"
      v-for="(item, index) in list"
      :key="index"
      :class="{'active': checkedList.indexOf(item.id) !== -1}"
      @click="CheckedItem(item)">
        <i class="icon-checked" v-if="multiple"></i>
        <span class="title">{{item.value}}</span>
        <span class="count" v-if="item.count && item.count !== -1 || item.count === 0">{{item.count}}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

interface Option {
  id: string,
  value: string
}

@Component
export default class Select1 extends Vue {
  @Prop({ type: Array, default: () => [{ id: '', value: '暂无数据' }] })
  list!: Option[]

  @Prop({ type: Object })
  current!: Option

  @Prop({ type: Array })
  currentList!: string[]

  @Prop({ type: String, default: '点击选择' })
  placeholder!: string

  @Prop({ type: Boolean, default: false })
  multiple!: boolean

  $refs!: {
    vue: Vue,
    vues: Vue[],
    element: HTMLElement,
    elements: HTMLElement[],
    [prop: string]: any
  }
  checkedList: string[] = this.multiple ? this.currentList : [this.current.id]

  get checkedItems () {
    const items: Option[] = []
    const list = JSON.parse(JSON.stringify(this.list))
    list.forEach((item: Option) => {
      if (this.checkedList.indexOf(item.id) !== -1) {
        items.push(item)
      }
    })
    return items
  }

  mounted () {
    this.$on('clear', () => {
      this.checkedList = []
    })
  }

  ToggleList () {
    // 判断列表长度
    // if (this.list.length < 2) {
    //   return false
    // }
    // 判断是否存在 show-panel 类
    const classList = this.$refs['select-panel'].classList
    if (Array.prototype.indexOf.call(classList, 'show-panel') !== -1) {
      classList.remove('show-panel')
    } else {
      classList.add('show-panel')
      this.$emit('showList')
    }
  }
  CheckedItem (item: Option) {
    const index = this.checkedList.indexOf(item.id)
    if (index === -1) {
      if (this.multiple) {
        if (item.id === 'all') {
          this.checkedList = ['all']
        } else {
          this.checkedList.push(item.id)
          // 去掉[全部**]选项
          const allIndex = this.checkedList.indexOf('all')
          if (allIndex !== -1) {
            this.checkedList.splice(allIndex, 1)
          }
        }
      } else {
        this.checkedList = [item.id]
      }
    } else {
      if (this.multiple) {
        this.checkedList.splice(index, 1)
      }
    }
    if (this.multiple) {
      this.$emit('update:currentList', this.checkedList)
      this.$emit('select', this.checkedList)
    } else {
      this.ToggleList()
      this.$emit('update:current', this.checkedItems[0])
      this.$emit('select', this.checkedItems[0])
    }
  }
}
</script>

<style lang="less" scoped>
.my-select{
  width: 100%;
  height:100%;
  cursor: pointer;

  &.disable{
    cursor: default;
  }
  .current-select{
    position: relative;
    height: 100%;
    background-color: #fff;
    border-radius: 0.4rem;

    .icon{
      position: absolute;
      top: 0.24rem;
      left: 0.26rem;
      display: block;
      height: 0.32rem;
      width: 0.32rem;
      // background-image: url('./img/icon_select.png');
      background-repeat: no-repeat;
      background-size: contain;
    }
    .icon-arrow{
      position: absolute;
      top: 50%;
      right: 0.3rem;
      transform: translateY(-50%);
      border-style: solid;
      border-color: #D57DA7 transparent transparent transparent;
      border-width: 0.12rem 0.07rem 0 0.07rem;
      &.disable{
        border-color: #e5e5e5 transparent transparent transparent;
      }
    }
    .title-wrapper{
      margin:0 0 0 0.8rem;
      height: 100%;
      width: auto;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      .title{
        position: relative;
        float: left;
        margin:0;
        padding:0 0.1rem 0 0;
        max-width: 1.2rem;
        font-size: 0.24rem;
        font-weight: normal;
        line-height: 0.8rem;
        color:#333;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        &.single{
          max-width: calc(100% - 0.8rem);
        }
        &.grey{
          max-width: 5rem;
          color: #999;
        }
        &::after{
          content: '';
          position: absolute;
          top: 50%;
          right: 0.05rem;
          display: block;
          width: 0.05rem;
          height: 0.05rem;
          background-color: #D57DA7;
          border-radius: 50%;
        }
        &:last-child::after{
          display: none;
        }
      }
    }
  }
  .option-list{
    display: none;
    position: relative;
    z-index: 99;
    padding-right: 0.1rem;
    width: 100%;
    max-height: 5rem;
    overflow-y: auto;
    overflow-x: hidden;
    background: #fff;
    box-sizing: border-box;
    box-shadow: 0 0.07rem 0.07rem rgba(149,129,196,0.18);
    border-radius: 0 0 0.4rem 0.4rem;

    .list-item{
      position: relative;
      height: 0.8rem;
      width: 100%;
      cursor: pointer;

      .icon-checked{
        display: none;
        position: absolute;
        left: 0.1rem;
        top: 0;
        width: 0.46rem;
        height: 0.8rem;
        background-repeat: no-repeat;
        background-size: 100% auto;
        background-position: center center;
        background-image: url('./img/icon_checked.png');
      }
      .title{
        float: left;
        margin:0 0 0 0.8rem;
        width: calc(100% - 1rem);
        height: 0.8rem;
        border-bottom: 0.01rem solid #EEEEEE;
        box-sizing: border-box;
        font-size: 0.24rem;
        font-weight: normal;
        line-height: 0.8rem;
        color: #666;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .count{
        position: absolute;
        right: 0.2rem;
        top: 0.27rem;
        padding: 0 0.1rem;
        height: 0.32rem;
        width: auto;
        min-width: 0.32rem;
        border-radius: 0.16rem;
        box-sizing: border-box;
        background-color: #D57DA7;
        font-size: 0.2rem;
        font-weight: normal;
        line-height: 0.32rem;
        color: #fff;

      }
      &:hover{
        .title{
          color: #D57DA7;
        }
      }
      &.active{
        .title{
          color: #D57DA7;
        }
        .icon-checked{
          display: block;
        }
      }
    }
  }
  &.show-panel{
    .current-select{
      border-radius: 0.4rem 0.4rem 0 0;
    }
    .icon-arrow{
      border-color: transparent transparent #D57DA7 transparent;
      border-width: 0 0.07rem 0.12rem 0.07rem;
    }
    .option-list{
      display: block;
    }
  }
}
</style>
