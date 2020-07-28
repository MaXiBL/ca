<template>
  <div class="my-search-select">
    <input class="search-input" type="text"
      :placeholder="placeholder"
      v-model="searchText"
      @input="FilterList()">
    <div class="option-list">
      <div class="list-item"
        :class="{'active': current.indexOf(item.id) !== -1}"
        v-for="(item, index) in localList"
        :key="index"
        @click="CheckItem(item)">
        <span class="title" :title="item.value">{{item.value}}</span>
        <i class="icon-checked"></i>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

interface ListItem {
  name: string,
  id: string
}

@Component
export default class SearchSelect extends Vue {
  @Prop({ type: String, default: '输入搜索内容' })
  placeholder!: string

  @Prop({ type: Array, default: () => [] })
  list!: ListItem[]

  @Prop({ type: Array, default: () => [] })
  current!: ListItem[]

  @Prop({ type: Boolean, default: false })
  multiple!: boolean

  searchText: string = ''
  checkedList: string[] = []

  mounted () {
    this.$on('clear', () => {
      this.checkedList = []
    })
  }

  get localList () {
    let filterList = []
    if (this.searchText) {
      const exp = new RegExp(this.searchText)
      filterList = this.list.filter((item: ListItem) => {
        return exp.test(item.name)
      })
    } else {
      filterList = this.list
    }
    return filterList
  }

  CheckItem (item: ListItem) {
    const index = this.checkedList.indexOf(item.id)
    if (index === -1) {
      if (this.multiple) {
        this.checkedList.push(item.id)
      } else {
        this.checkedList = [item.id]
      }
    } else {
      this.checkedList.splice(index, 1)
    }
    this.$emit('update:current', this.checkedList)
    this.$emit('check', this.checkedList)
  }
}
</script>

<style lang="less" scoped>
.my-search-select{
  padding: 0.22rem;
  width: 3.1rem;
  height: 4.42rem;
  border: 0.02rem solid #e1e1e1;
  border-radius: 0.08rem;
  box-sizing: border-box;

  .search-input{
    display: block;
    padding: 0 0.1rem;
    width: 100%;
    height: 0.5rem;
    border: none;
    border-radius: 0.04rem;
    box-sizing: border-box;
    background-color: #F4F4F4;
    font-size: 0.2rem;
    font-weight: normal;
    line-height: 0.5rem;
    color: #999;
    &:focus{
      outline: none;
    }
  }
  .option-list{
    padding-right: 0.1rem;
    width: 100%;
    height: auto;
    max-height: calc(100% - 0.5rem);
    box-sizing: border-box;
    overflow-y: auto;
    overflow-x: hidden;

    .list-item{
      position: relative;
      height: 0.83rem;
      width: 100%;
      border-bottom: 0.02rem solid #F4F4F4;
      cursor: pointer;

      &.active{
        .title{
          padding-right: 0.46rem;
          color: #D57DA7;
        }
        .icon-checked{
          display: block;
        }
      }
      .title{
        display: block;
        padding: 0;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        font-size:0.24rem;
        font-weight: normal;
        line-height: 0.83rem;
        color: #666;
        text-align: left;
        text-indent: 0.1rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .icon-checked{
        display: none;
        position: absolute;
        right: 0;
        top: 0;
        width: 0.46rem;
        height: 0.83rem;
        background-repeat: no-repeat;
        background-size: 100% auto;
        background-position: center center;
        background-image: url('./img/icon_checked.png');
      }
    }
  }
}
</style>
