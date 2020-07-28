<template>
  <div class="my-select panel-wrapper" ref="mul-select-panel">
    <div class="select-current" @click="ToggleList()">
      <slot>
        <i class="icon"></i>
      </slot>
      <div class="title-wrapper">
        <span class="title"
        v-for="(item, index) in selectObj"
        :key="index">
        {{item.value}}
        </span>
        <span class="title grey-long" v-if="!selectObj[listHead[0].prop]">
          {{placeholder}}
        </span>
      </div>
      <i class="icon-arrow"></i>
    </div>
    <div class="select-list">
      <div class="list-head">
        <div class="head-item"
          v-for="(item, index) in listHead"
          :key="index"
          :class="{'active': item.prop === activeHead.prop}"
          @click="ChangeActiveHead(item, index)">
          {{item.label}}
        </div>
      </div>
      <div class="list-body">
        <div class="body-item">
              <div class="item-child-list"
                :class="{'active': bodyIndex === activeHead.prop}"
                v-for="(bodyItem, bodyIndex) in listData"
                :key="bodyIndex">
                <div class="child-list-item"
                  :class="{'active': selectObj[bodyIndex] && selectObj[bodyIndex].id === childItem.id}"
                  v-for="(childItem, childIndex) in bodyItem"
                  :key="childIndex"
                  @click="SelectItem(bodyIndex, childItem)">
                  {{childItem.value}}
                </div>
              </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

interface ListHeadItem {
  prop: string,
  label: string,
  width: string
}
interface ListData {
  [prop: string]: ListDataItemValue[]
}
interface ListDataItemValue {
  id: string,
  value: string
}

@Component
export default class MultiSelect extends Vue {
  @Prop(({ type: Array }))
  listHead!: ListHeadItem[]

  @Prop({ type: Object })
  listData!: ListDataItemValue

  @Prop({ type: Object })
  current!: ListDataItemValue

  @Prop({ type: String, default: '点击选择' })
  placeholder!: string

  $refs!: {
    vue: Vue,
    vues: Vue[],
    element: HTMLElement,
    elements: HTMLElement[],
    [prop: string]: any
  }
  activeHead: ListHeadItem = this.listHead[0]
  activeHeadIndex: number = 0
  selectObj: any = {}

  ToggleList () {
    // 判断是否存在 show-panel 类
    const classList = this.$refs['mul-select-panel'].classList
    if (Array.prototype.indexOf.call(classList, 'show-panel') !== -1) {
      classList.remove('show-panel')
    } else {
      classList.add('show-panel')
    }
    this.InitSelect()
  }
  InitSelect () {
    this.activeHead = this.listHead[0]
    this.activeHeadIndex = 0
  }
  ChangeActiveHead (obj: ListHeadItem, index: number) {
    this.activeHead = obj
    this.activeHeadIndex = index
  }
  SelectItem (key: string, value: ListDataItemValue) {
    if (this.selectObj[key] === value) {
      return false
    } else {
      this.selectObj[key] = value
      // 选择新的值,则其子选项的值应该清空, 使用for循环清空
      for (let i = this.activeHeadIndex + 1, len = this.listHead.length; i < len; i++) {
        const key = this.listHead[i].prop
        if (this.selectObj[key]) {
          delete this.selectObj[key]
        }
      }
      // 判断点击的是否是最后一项, 是: 则选择完成,收起下拉列表, 否: 切换
      if (key === this.listHead[this.listHead.length - 1].prop) {
        this.ToggleList()
      } else {
        this.ChangeActiveHead(this.listHead[this.activeHeadIndex + 1], this.activeHeadIndex + 1)
      }
      // 每次有效点击(值改变),返回选择值
      // this.$emit('update:current', item)
      this.$emit('select', key, this.selectObj[key])
    }
  }
}
</script>

<style lang="less" scoped>
.my-select{
  width: 100%;
  height:100%;

  .select-current{
    position: relative;
    height: 100%;
    background-color: #fff;
    border-radius: 0.4rem;
    cursor: pointer;

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
    }
    .title-wrapper{
      margin:0 0 0 0.8rem;
      height: 100%;
      width: auto;
      overflow: hidden;

      .title{
        position: relative;
        float: left;
        margin: 0;
        padding:0 0.2rem 0 0;
        max-width: 1.2rem;
        font-size: 0.24rem;
        font-weight: normal;
        line-height: 0.8rem;
        color:#333;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        &.grey-long{
          max-width: 5rem;
          color: #999;
        }
        &::after{
          content: '';
          position: absolute;
          top: 50%;
          right: 0.07rem;
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
  .select-list{
    display: none;
    position: relative;
    z-index: 99;
    padding: 0 0.3rem;
    width: 100%;
    height: auto;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 0.07rem 0.07rem rgba(149,129,196,0.18);
    border-radius: 0 0 0.4rem 0.4rem;
    box-sizing: border-box;

    .select-item{
      height: 100%;

      .title{
        margin:0 0 0 1rem;
        width: 1.5rem;
        border-top: 0.016rem solid #f4f4f4;
        font-size: 0.24rem;
        font-weight: normal;
        line-height: 0.8rem;
        color: #666;
        cursor: pointer;
      }
      &.active,
      &:hover{
        .title{
          color: #b56a9b;
        }
      }
    }

    .list-head{
      height: 0.4rem;
      width: auto;
      // background-color: #f1f1f1;
      border-bottom: 0.01rem solid #EEEEEE;

      .head-item{
        float: left;
        height: 100%;
        padding: 0 0.2rem;
        font-size: 0.22rem;
        font-weight: normal;
        line-height: 0.4rem;
        color: #333333;
        border-bottom: 0.01rem solid #EEEEEE;
        cursor: pointer;

        &.active{
          color: #D57DA7;
          border-color: #D57DA7;
        }
      }
    }
    .list-body{
      height: auto;
      width: auto;
      .body-item{
        height: auto;
        width: 100%;
        .item-child-list{
          display: none;
          z-index: 999999;
          padding:0.1rem 0.15rem;
          width: 100%;
          height: auto;
          min-height: 1rem;
          max-height: 3rem;
          box-sizing: border-box;
          overflow-y: auto;
          overflow-x: hidden;
          &.active{
            display: block;
          }

          .child-list-item{
            font-size: 0.22rem;
            font-weight: normal;
            line-height: 0.4rem;
            color: #666;
            cursor: pointer;

            &.active,
            &:hover{
              color: #D57DA7;
            }
          }
        }
      }
    }
  }
  &.show-panel{
    .select-current{
      border-radius: 0.4rem 0.4rem 0 0;
    }
    .icon-arrow{
      border-color: transparent transparent #D57DA7 transparent;
      border-width: 0 0.07rem 0.12rem 0.07rem;
    }
    .select-list{
      display: block;
    }
  }
}
</style>
