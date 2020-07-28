<template>
  <div class="my-db-date">
    <my-date class="date-start"
      :placeholder="placeholder1"
      :endLimit="endLimit"
      :date.sync="localDate.start.split(' ')[0]"
      @select-date="SelectStartDate">
    </my-date>
    <i class="icon-arrow"></i>
    <my-date class="date-end"
      :placeholder="placeholder2"
      :startLimit="startLimit"
      :date.sync="localDate.end.split(' ')[0]"
      @select-date="SelectEndDate">
    </my-date>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

import MyDate from 'widget/MyDate/index.vue'

interface Date {
  start: string,
  end: string
}

@Component({
  components: {
    MyDate
  }
})
export default class DoubleDate extends Vue {
  @Prop({ type: String, default: '选择开始日期' })
  placeholder1!: string

  @Prop({ type: String, default: '选择结束日期' })
  placeholder2!: string

  @Prop({ type: String })
  dateStart!: string

  @Prop({ type: String })
  dateEnd!: string

  localDate: Date = {
    start: '',
    end: ''
  }

  get startLimit () {
    if (this.dateStart) {
      return this.dateStart.split(' ')[0]
    } else {
      const date = new Date()
      return new Date(date.getFullYear() - 10, date.getMonth(), date.getDate()).toString()
    }
  }
  get endLimit () {
    if (this.dateEnd) {
      return this.dateEnd.split(' ')[0]
    } else {
      const date = new Date()
      return new Date(date.getFullYear(), date.getMonth(), date.getDate()).toString()
    }
  }

  SelectStartDate (date: string) {
    let fullDate = ''
    if (date !== '') {
      fullDate = `${date} 00:00:00`
    }
    this.$emit('update:dateStart', fullDate)
    this.localDate.start = fullDate
    this.$emit('selectDate', this.localDate)
  }
  SelectEndDate (date: string) {
    let fullDate = ''
    if (date !== '') {
      fullDate = `${date} 23:59:59`
    }
    this.$emit('update:dateEnd', fullDate)
    this.localDate.end = fullDate
    this.$emit('selectDate', this.localDate)
  }
}
</script>

<style lang="less" scoped>
.my-db-date{
  width: 100%;
  min-width: 6.8rem;
  height: 100%;

  .icon-arrow{
    float: left;
    display: block;
    width: 0.8rem;
    height: 100%;
    background-image: url('./img/img_arrow.png');
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 0.32rem 0.21rem;
  }
  .date-start{
    float: left;
    width: calc(50% - 0.4rem);
    height: 100%;
  }
  .date-end{
    float: right;
    width: calc(50% - 0.4rem);
    height: 100%;
  }
}
</style>
