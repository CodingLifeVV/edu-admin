<template>
  <div class="app-container">
    <!-- 1.发布新课程 -->
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="提交审核" />
    </el-steps>

    <!-- 2.课程信息表单 -->
    <el-form label-width="120px">
      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例: 机器学习项目课: 从基础到搭建项目视频课程。专业名称注意大小写" />
      </el-form-item>

      <!-- 所属分类 TODO -->

      <!-- 课程讲师 TODO -->

      <!-- 2.总课时 -->
      <el-form-item label="总课时">
        <el-input-number
          v-model="courseInfo.lessonNum"
          :min="0"
          controls-position="right"
          placeholder="请填写课程的总课时数"
        />
      </el-form-item>

      <!-- 课程简介 TODO -->

      <!-- 课程封面 TODO -->

      <!-- 2.课程价格 -->
      <el-form-item label="课程价格">
        <el-input-number
          v-model="courseInfo.price"
          :min="0"
          controls-position="right"
          placeholder="免费课程请设置为0元"
        />元
      </el-form-item>
    </el-form>
    <el-form label-width="120px">
      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存并下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>

import course from '@/api/edu/course'

export default {
  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      courseInfo: {
        title: '',
        subjectId: '', // 二级分类id
        subjectParentId: '', // 一级分类id
        teacherId: '',
        lessonNum: 0,
        description: '',
        cover: '',
        price: 0
      }
    }
  },
  created() {
    console.log('info created')
    // 获取路由id值
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id
      // 调用根据id查询课程的方法
      // this.getInfo()
    } else {
      // 初始化所有讲师
      // this.getListTeacher()
      // 初始化一级分类
      // this.getOneSubject()
    }
  },
  methods: {
    // 判断添加还是修改
    saveOrUpdate() {
      if (!this.courseInfo.id) {
        // 添加
        this.addCourse()
      } else {
        this.updateCourse()
      }

      // console.log('next')
      // this.$router.push({ path: '/edu/course/chapter/1' })
    },
    // 添加课程
    addCourse() {
      course.addCourseInfo(this.courseInfo).then(response => {
        // 添加成功,提示
        this.$message({
          type: 'success',
          message: '添加课程信息成功!'
        })
        // 跳转到第二步
        this.$router.push({
          path: '/edu/course/chapter/' + response.data.courseId
        })
      })
    }
  }
}
</script>
