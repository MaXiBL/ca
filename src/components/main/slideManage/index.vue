<template>
  <div id="slide-manage" class="content">
    <!-- 搜索条件 -->
    <search-slide-manage @search="Search"/>
    <!-- 搜索结果 -->
    <result-slide-manage ref="result-slide-manage"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import searchSlideManage from './search.vue'
import resultSlideManage from './result.vue'

@Component({
  components: {
    searchSlideManage,
    resultSlideManage
  }
})
export default class SlideManageIndex extends Vue {
  $refs!: {
    vue: Vue,
    vues: Vue[],
    element: HTMLElement,
    elements: HTMLElement[],
    [prop: string]: any
  }

  Search (type: string, obj: object) {
    this.$refs['result-slide-manage'].$emit('search', obj)
  }
}
</script>

<style lang="less" scoped>
.content{
  padding: 0 0.3rem;
}
</style>
