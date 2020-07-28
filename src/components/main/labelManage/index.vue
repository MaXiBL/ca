<template>
  <div id="label-manage" class="content">
    <!-- 搜索条件 -->
    <search-label-manage @search="Search"/>
    <!-- 搜索结果 -->
    <result-label-manage ref="result-label-manage"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import searchLabelManage from './search.vue'
import resultLabelManage from './result.vue'

@Component({
  components: {
    searchLabelManage,
    resultLabelManage
  }
})
export default class LabelManageIndex extends Vue {
  $refs!: {
    vue: Vue,
    vues: Vue[],
    element: HTMLElement,
    elements: HTMLElement[],
    [prop: string]: any
  }

  Search (type: string, obj: object) {
    this.$refs['result-label-manage'].$emit('search', obj)
  }
}
</script>

<style lang="less" scoped>
.content{
  padding: 0 0.3rem;
}
</style>
