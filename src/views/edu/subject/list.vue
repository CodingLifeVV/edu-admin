<template>
  <div class="app-container">
    <el-input v-model="filterText" placeholder="Filter keyword" style="margin-bottom:30px;" />

    <el-tree
      ref="tree2"
      :data="data2"
      :props="defaultProps"
      draggable
      :filter-node-method="filterNode"
      class="filter-tree"
      default-expand-all
    />

  </div>
</template>

<script>

import subject from '@/api/edu/courseSubject'

export default {
  data() {
    return {
      filterText: '',
      data2: [], // 返回所有数据
      defaultProps: {
        children: 'children',
        label: 'title' // 该树型结构以什么形式显示
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },
  created() {
    this.getAllCourseSubject()
  },
  methods: {
    getAllCourseSubject() {
      subject.getAllNestedCourseSubject()
        .then(response => {
          this.data2 = response.data.courseSubjectList // courseSubjectList为后端定义
        })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
    }
  }

}

</script>
