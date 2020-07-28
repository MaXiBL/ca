<template>
  <div class="my-select panel-wrapper"
    ref="select-panel"
    :class="{'disable': list.length < 2}">
    <div class="current-select" @click="ToggleList()">
      <div class="title-wrapper">
        <slot name="current" :row="current">
          <span class="title single" v-if="!multiple && current.value">
            {{current.value}}
          </span>
          <span class="title" v-else
            v-for="(item, index) in checkedItems"
            :key="index">
            {{item.value}}
          </span>
        </slot>
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
        <slot :name="item.value" :row="item" :index="index">
          <span class="title">{{item.value}}</span>
        </slot>
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
export default class Select2 extends Vue {
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
        this.ToggleList()
      }
    } else {
      if (this.multiple) {
        this.checkedList.splice(index, 1)
      } else {
        this.ToggleList()
      }
    }
    if (this.multiple) {
      this.$emit('update:currentList', this.checkedList)
      this.$emit('select', this.checkedList)
    } else {
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
      margin:0 0 0 0.1rem;
      height: 100%;
      width: auto;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      .title{
        position: relative;
        // float: left;
        margin:0;
        padding:0 0.1rem 0 0;
        max-width: 1.2rem;
        font-size: 0.24rem;
        font-weight: normal;
        line-height: 0.7rem;
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
    left: -0.02rem;
    z-index: 99;
    width: 100%;
    max-height: 3rem;
    overflow-y: auto;
    overflow-x: hidden;
    background: #fff;
    // box-sizing: border-box;
    box-shadow: 0 0.07rem 0.07rem rgba(149,129,196,0.18);
    border-radius: 0 0 0.04rem 0.04rem;
    border: 0.02rem solid #efefef;
    border-top: none;

    .list-item{
      margin:0 0 0 0.1rem;
      position: relative;
      height: 0.7rem;
      // width: 100%;
      // border-bottom: 0.01rem solid #f4f4f4;
      cursor: pointer;
      .title{
        width: auto;
        font-size: 0.24rem;
        font-weight: normal;
        line-height: 0.7rem;
        color: #666;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      &:hover{
        .title{
          color: #b56a9b;
        }
      }
      &.active{
        .title{
          color: #b56a9b;
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
