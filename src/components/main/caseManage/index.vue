<template>
  <div id="case-manage" class="content">
    <!-- 搜索条件 -->
    <search-case-manage @search="Search"/>
    <!-- 搜索结果 -->
    <result-case-manage ref="result-case-manage"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import searchCaseManage from './search.vue'
import resultCaseManage from './result.vue'

@Component({
  components: {
    searchCaseManage,
    resultCaseManage
  }
})
export default class CaseManageIndex extends Vue {
  $refs!: {
    vue: Vue,
    vues: Vue[],
    element: HTMLElement,
    elements: HTMLElement[],
    [prop: string]: any
  }

  Search (type: string, obj: object) {
    this.$refs['result-case-manage'].$emit('search', obj)
  }
}
</script>

<style lang="less" scoped>
.content{
  padding: 0 0.3rem;
}
</style>
