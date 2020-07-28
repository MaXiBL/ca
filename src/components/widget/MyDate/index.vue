<template>
  <div class="my-date panel-wrapper" ref="date-panel">
    <div class="input-wrapper" @click="TogglePanel($event)">
      <input type="text" class="date-input" readonly
      :placeholder="placeholder"
      v-model="date">
    </div>
    <div :class="displacement ? 'below-place' : 'above-place'" class="date-panel">
      <div class="date-panel-header">
        <div class="date-year-container">
          <i class="icon-prev" @click.stop="SelectYear(headYear-1)"></i>
          <span class="title">{{headYear}}年</span>
          <i class="icon-next" @click.stop="SelectYear(headYear+1)"></i>
        </div>
        <div class="date-month-container">
          <i class="icon-prev" @click.stop="SelectMonth(headMonth-1)"></i>
          <span class="title">{{headMonth}}月</span>
          <i class="icon-next" @click.stop="SelectMonth(headMonth+1)"></i>
        </div>
      </div>
      <div class="date-panel-main">
        <div class="date-week-container">
          <div class="date-week-item">日</div>
          <div class="date-week-item">一</div>
          <div class="date-week-item">二</div>
          <div class="date-week-item">三</div>
          <div class="date-week-item">四</div>
          <div class="date-week-item">五</div>
          <div class="date-week-item">六</div>
        </div>
        <div class="date-list">
          <div class="date-list-item"
          v-for="(item, index) in dateList"
          :key="index">
            <div class="item-content"
            :class="{
              'current-month':headMonth === item.month,
              'active': selectDate.year === item.year && selectDate.month === item.month && selectDate.day === item.day,
              'disabled': new Date(item.year, item.month-1, item.day) > new Date(endLimit) || new Date(item.year, item.month-1, item.day) < new Date(startLimit)
            }"
            @click.stop="SelectDay(item, new Date(item.year, item.month-1, item.day) > new Date(endLimit) || new Date(item.year, item.month-1, item.day) < new Date(startLimit))">
              {{item.day}}
            </div>
          </div>
        </div>
      </div>
      <div class="date-panel-footer">
        <div class="btn-cancel" @click.stop="TogglePanel()">取消</div>
        <div class="btn-clear" @click.stop="ClearDate()">重置</div>
        <div class="btn-today" @click.stop="SelectToday()">今天</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

interface DateItem {
  year: number,
  month: number,
  day: number
}

@Component
export default class MyDate extends Vue {
  @Prop({ type: String, default: '选择日期' })
  placeholder!: string

  @Prop({ type: String,
    default: () => {
      const date = new Date()
      return new Date(date.getFullYear() - 10, date.getMonth(), date.getDate()).toString()
    }
  })
  startLimit!: string
  // 定位距离
  displacement: boolean = true
  @Prop({ type: String,
    default: () => {
      const date = new Date()
      return new Date(date.getFullYear(), date.getMonth(), date.getDate()).toString()
    }
  })
  endLimit!: string

  @Prop({ type: String })
  date!: string

  $refs!: {
    vue: Vue,
    vues: Vue[],
    element: HTMLElement,
    elements: HTMLElement[],
    [prop: string]: any
  }
  headYear: number = new Date().getFullYear()
  headMonth: number = new Date().getMonth() + 1
  selectDate: DateItem = {
    year: 0,
    month: 0,
    day: 0
  }
  dateList: DateItem[] = []

  mounted () {
    this.InitDate()
  }

  InitDate () {
    const date = new Date()
    this.headYear = date.getFullYear()
    this.headMonth = date.getMonth() + 1
    this.selectDate.year = 0
    this.selectDate.month = 0
    this.selectDate.day = 0
    this.GetDateList()
  }
  TogglePanel (event ?: any) {
    // 判断是否存在 show-panel 类
    const classList = this.$refs['date-panel'].classList
    if (Array.prototype.indexOf.call(classList, 'show-panel') !== -1) {
      classList.remove('show-panel')
    } else {
      if (window.innerHeight - event.pageY < window.innerHeight / 2) {
        this.displacement = false
      } else {
        this.displacement = true
      }
      classList.add('show-panel')
    }
  }
  // 获取日期列表
  GetDateList () {
    let lastMonthDays
    let nextMonthDays
    let currentMonthDays
    // 判断月份是否为1月
    if (Number(this.headMonth) === 1) {
      lastMonthDays = this.getDays(`${this.headYear - 1}/12`)
      nextMonthDays = this.getDays(`${this.headYear}/${Number(this.headMonth) + 1}`)
    } else if (Number(this.headMonth) === 12) {
      lastMonthDays = this.getDays(`${this.headYear}/${Number(this.headMonth) - 1}`)
      nextMonthDays = this.getDays(`${this.headYear + 1}/1`)
    } else {
      lastMonthDays = this.getDays(`${this.headYear}/${Number(this.headMonth) - 1}`)
      nextMonthDays = this.getDays(`${this.headYear}/${Number(this.headMonth) + 1}`)
    }
    currentMonthDays = this.getDays(`${this.headYear}/${this.headMonth}`)

    const date = new Date(`${this.headYear}/${this.headMonth}`)
    const weekDay = date.getDay()

    // 判断当前选择日期是否是周日(起始)
    if (weekDay === 7) {
      this.dateList = currentMonthDays.concat(nextMonthDays.slice(0, 42 - currentMonthDays.length))
    } else {
      this.dateList = lastMonthDays.slice(lastMonthDays.length - weekDay).concat(currentMonthDays, nextMonthDays.slice(0, 42 - weekDay - currentMonthDays.length))
    }
  }
  // 获取指定月份的天数
  getDays (date: string) {
    const currentDate = new Date(date)
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth() + 1
    currentDate.setMonth(month)
    currentDate.setDate(0)
    const currentMonthDays = []
    for (let i = 1, len = currentDate.getDate(); i <= len; i++) {
      currentMonthDays.push({
        year,
        month,
        day: i
      })
    }
    return currentMonthDays
  }
  // 选择日期
  SelectDay (dayObj: DateItem, flag: boolean) {
    if (flag) {
      return false
    }
    if (this.headMonth !== dayObj.month) {
      this.headMonth = dayObj.month
      this.GetDateList()
    }
    this.selectDate = dayObj
    this.ChangeDate()
  }
  // 选择年份
  SelectYear (year: number) {
    this.headYear = year
    this.GetDateList()
  }
  // 选择月份
  SelectMonth (month: number) {
    if (month === 0) {
      this.headMonth = 12
      this.headYear -= 1
    } else if (month === 13) {
      this.headMonth = 1
      this.headYear += 1
    } else {
      this.headMonth = month
    }
    this.GetDateList()
  }
  // 清空日期
  ClearDate () {
    this.InitDate()
    this.$emit('update:date', '')
    this.$emit('select-date', '')
    this.TogglePanel()
  }
  // 选择今天
  SelectToday () {
    this.InitDate()
    this.selectDate.year = this.headYear
    this.selectDate.month = this.headMonth
    this.selectDate.day = new Date().getDate()
    const date = `${this.selectDate.year}-${this.selectDate.month}-${this.selectDate.day}`
    this.$emit('update:date', date)
    this.$emit('select-date', date)
    this.TogglePanel()
  }
  // 确定选择
  ChangeDate () {
    const date = `${this.selectDate.year}-${this.selectDate.month}-${this.selectDate.day}`
    if (new Date(date) > new Date(this.endLimit) || new Date(date) < new Date(this.startLimit)) {
      return false
    }
    this.$emit('update:date', date)
    this.$emit('select-date', date)
    this.TogglePanel()
  }
}
</script>

<style lang="less" scoped>
.my-date{
  position: relative;
  width: 2rem;
  border-radius: 0.4rem;
  background-color: #fff;
  cursor: pointer;

  .input-wrapper{
    position: relative;
    padding: 0 0.3rem;
    height: 100%;
    width: 100%;
    border-radius: 0.4rem;
    box-sizing: border-box;

    .date-input{
      float: left;
      height: 100%;
      border: none;
      outline: none;
      font-size: 0.24rem;
      font-weight: normal;
      background: transparent;
      cursor: pointer;
      &::-webkit-input-placeholder {
        color: #999;
      }
    }
    &::after{
      position: absolute;
      top: 50%;
      right: 0.3rem;
      display: block;
      content:'';
      margin-top: -0.16rem;
      width: 0.32rem;
      height: 0.32rem;
      background-image: url('./img/icon_date.png');
      background-repeat: no-repeat;
      background-size: contain;
    }
  }
  .date-panel{
    display: none;
    position: absolute;
    z-index: 999;
    top: 1rem;
    left: 50%;
    margin-left: -2.1rem;
    padding: 0.2rem;
    height: 5.2rem;
    width: 4.2rem;
    box-sizing:border-box;
    border-radius: 0.16rem;
    box-shadow: 0 0 0.24rem 0.02rem rgba(97,97,97,0.2);
    background: #F4F4F4;

    .date-panel-header{
      margin: 0 auto 0.22rem;
      width: 3.02rem;
      height: 0.44rem;

      .date-year-container,
      .date-month-container{
        position: relative;
        height: 100%;
        width: 1.39rem;
        border-radius: 0.22rem;
        border: 0.02rem solid #D57DA7;
        box-sizing: border-box;

        .title{
          display: block;
          margin: 0 auto;
          width: 0.71rem;
          height: 100%;
          font-size: 0.2rem;
          font-weight: normal;
          line-height: 0.4rem;
          text-align: center;
          text-indent: 0;
          color:#D57DA7;
          white-space: nowrap;
        }
        .icon-prev,
        .icon-next{
          position: absolute;
          top: 0.1rem;
          display: block;
          width: 0;
          height: 0;
          cursor: pointer;
        }
        .icon-prev{
          left: 0.1rem;
          border-width: 0.1rem 0.15rem 0.1rem 0;
          border-style: solid;
          border-color: transparent #D57DA7 transparent transparent;
          &::after{
            display: block;
            position: absolute;
            top: -0.1rem;
            left: 0.05rem;
            width: 0;
            height: 0;
            border-width: 0.1rem 0.15rem 0.1rem 0;
            border-style: solid;
            border-color: transparent #F4F4F4 transparent transparent;
            content: '';
          }
        }
        .icon-next{
          right: 0.1rem;
          border-width: 0.1rem 0 0.1rem 0.15rem;
          border-style: solid;
          border-color: transparent transparent transparent #D57DA7;
          &::after{
            display: block;
            position: absolute;
            top: -0.1rem;
            right: 0.05rem;
            width: 0;
            height: 0;
            border-width: 0.1rem 0 0.1rem 0.15rem;
            border-style: solid;
            border-color: transparent transparent transparent #F4F4F4;
            content: '';
          }
        }
      }
      .date-year-container{
        float: left;
      }
      .date-month-container{
        float: right;
      }
    }
    .date-panel-main{
      margin-bottom: 0.1rem;
      .date-week-container{
        margin-bottom: 0.15rem;
        height: 0.35rem;
        .date-week-item{
          float: left;
          width: 14.28%;
          height: 100%;
          font-size: 0.17rem;
          font-weight: normal;
          line-height: 0.35rem;
          text-align: center;
          text-indent: 0;
          color:#999;
        }
      }
      .date-list{
        &::after{
          display: block;
          content:'';
          clear: both;
        }
        .date-list-item{
          float: left;
          width: 14.28%;
          height: 0.5rem;

          .item-content{
            margin: 0.07rem auto;
            height: 0.36rem;
            width: 0.36rem;
            font-size: 0.19rem;
            font-weight: normal;
            line-height: 0.36rem;
            text-align: center;
            text-indent: 0;
            color:#999;
            cursor: pointer;

            &.current-month{
            color:#333;
            }
            &.active, &:hover{
              border-radius: 50%;
              background-color: #d57da7;
              color:#fff;
            }
            &.disabled{
              color: #999;
              cursor: not-allowed;
            }
          }
        }
      }
    }
    .date-panel-footer{
      height: 0.5rem;
      border-radius: 0.1rem;
      background: linear-gradient(90deg,rgba(194,194,194,1),rgba(213,125,167,1));
      .btn-cancel,
      .btn-clear,
      .btn-today{
        float: left;
        height: 100%;
        width: 33%;
        font-size: 0.2rem;
        font-weight: normal;
        line-height: 0.5rem;
        text-align: center;
        text-indent: 0;
        color:#fff;
        cursor: pointer;
      }
      .btn-cancel{
        width: 33%;
        &:hover {
          border-radius: 0.1rem 0 0 0.1rem;
          background:rgba(161,161,161,1);
        }
      }
      .btn-clear{
        width: 34%;
        border-right:0.02rem solid #fff;
        border-left: 0.02rem solid #fff;
        box-sizing:border-box;
        &:hover {
          background:rgba(223,146,183,1);
        }
      }
      .btn-today{
        width: 33%;
        &:hover {
          background:rgba(213,125,167,1);
          border-radius: 0 0.1rem 0.1rem 0;
        }
      }
    }
  }
  .below-place {
    top: 1rem;
  }
  .above-place {
    top: -5.4rem;
  }
  &.show-panel{
    .date-panel{
      display: block;
    }
  }
}
</style>
