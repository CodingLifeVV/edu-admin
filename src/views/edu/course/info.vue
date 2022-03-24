<template>
  <div class="app-container">
    <!-- 1.发布新课程—填写课程基本信息 -->
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

      <!-- 3.所属课程分类 级联下拉列表 -->
      <el-form-item label="课程分类">
        <el-select
          v-model="courseInfo.subjectParentId"
          placeholder="一级分类"
          @change="courseSubjectLevelOneChanged"
        >
          <el-option
            v-for="subject in oneLevelCourseSubjectList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
        <!-- 二级分类 -->
        <el-select v-model="courseInfo.subjectId" placeholder="二级分类">
          <el-option
            v-for="subject in twoLevelCourseSubjectList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
      </el-form-item>

      <!-- 4.课程讲师 TODO -->
      <el-form-item label="授课教师">
        <el-select v-model="courseInfo.teacherId" placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"
          />
        </el-select>
      </el-form-item>

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
import courseSubject from '@/api/edu/courseSubject'
import teacher from '@/api/edu/teacher'

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
      },
      courseId: '',
      teacherList: [], // 封装所有授课教师
      oneLevelCourseSubjectList: [], // 封装一级课程分类
      twoLevelCourseSubjectList: [] // 封装二级课程分类
    }
  },
  created() {
    console.log('info created')
    // 获取路由id值
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id
      // 调用根据id查询课程的方法
      this.getCourseInfoById()
    } else {
      // 初始化所有讲师,获得所有教师列表
      this.getListTeacher()
      // 初始化一级分类,获得所有一级课程分类列表
      this.getOneLevelCourseSubject()
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
    },
    // 修改课程信息
    updateCourse() {
      course.updateCourseInfo(this.courseInfo).then(response => {
        // 提示
        this.$message({
          type: 'success',
          message: '修改课程信息成功!'
        })
        // 跳转到第二步
        this.$router.push({ path: '/edu/course/chapter/' + this.courseId })
      })
    },
    // 获得所有的一级课程分类列表
    getOneLevelCourseSubject() {
      courseSubject.getAllNestedCourseSubject().then(response => {
        this.oneLevelCourseSubjectList = response.data.courseSubjectList // courseSubjectList 为后端定义
      })
    },
    // 点击某个一级分类,触发change,显示对应二级分类
    // value 一级课程分类 id 值
    courseSubjectLevelOneChanged(oneLevelId) {
      // 遍历所有的分类，包含一级和二级
      for (var i = 0; i < this.oneLevelCourseSubjectList.length; i++) {
        // 每个一级课程分类
        var oneLevelCourseSubject = this.oneLevelCourseSubjectList[i]
        // 判断:所有一级课程分类id和点击的一级课程分类id是否一样
        if (oneLevelId === oneLevelCourseSubject.id) {
          // 从一级课程分类获取里面所有的二级课程分类
          this.twoLevelCourseSubjectList = oneLevelCourseSubject.children
          // 把二级课程分类id值清空
          this.courseInfo.subjectId = ''
        }
      }
    },
    // 获得所有教师列表
    getListTeacher() {
      teacher.getListTeacher().then(response => {
        this.teacherList = response.data.teacherList // response.data.teacherList 的 teacherList 在后端定义
      })
    },
    // 获取课程信息
    getCourseInfoById() {
      course.getCourseInfoId(this.courseId).then(response => {
        // 拿到courseInfo课程基本信息,包含 一级分类id 和 二级分类id
        this.courseInfo = response.data.courseInfo // response.data.courseInfo 的 courseInfo 定义在后端
        // 获取课程分类
        courseSubject.getAllNestedCourseSubject().then(response => {
          // 获取所有一级课程分类
          this.oneLevelCourseSubjectList = response.data.courseSubjectList
          // 3 遍历所有的一级课程分类
          for (var i = 0; i < this.oneLevelCourseSubjectList.length; i++) {
            // 获取每个一级分类
            var courseSubject = this.oneLevelCourseSubjectList[i]
            // 比较当前courseInfo里面一级课程分类id和所有的一级课程分类id
            if (this.courseInfo.subjectParentId === courseSubject.id) {
              // 获取一级课程分类所有的二级课程分类
              this.twoLevelCourseSubjectList = courseSubject.children
            }
          }
        })
        // 查询到所有授课教师
        this.getListTeacher()
      })
    }
  }
}
</script>
