<template>
  <div class="app-container">

    <!-- 教师表单 -->
    <el-form label-width="120px">
      <el-form-item label="教师名称">
        <el-input v-model="teacher.name" />
      </el-form-item>
      <el-form-item label="教师排序">
        <el-input-number v-model="teacher.sort" controls-position="right" min="0" />
      </el-form-item>
      <el-form-item label="教师职称">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="教授" />
          <el-option :value="2" label="副教授" />
          <el-option :value="3" label="讲师" />
          <el-option :value="4" label="助教" />
        </el-select>
      </el-form-item>
      <el-form-item label="教师资历">
        <el-input v-model="teacher.career" />
      </el-form-item>
      <el-form-item label="教师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea" />
      </el-form-item>

      <!-- 教师头像：TODO -->
      <el-form-item label="教师头像">
        <!-- 头衔缩略图 -->
        <pan-thumb :image="teacher.avatar" />
        <!-- 文件上传按钮 -->
        <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像</el-button>

        <!--
            v-show：是否显示上传组件
            :key：类似于id，如果一个页面多个图片上传控件，可以做区分
            :url：后台上传的url地址
            @close：关闭上传组件
            @crop-upload-success：上传成功后的回调-->
        <image-cropper
          v-show="imagecropperShow"
          :key="imagecropperKey"
          :width="300"
          :height="300"
          :url="VUE_APP_BASE_API+'/oss/file/upload'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"
        />

      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import teacherApi from '@/api/edu/teacher'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

export default {
  components: { ImageCropper, PanThumb },
  data() {
    return {
      teacher: {
        name: '',
        sort: 0,
        level: 1,
        career: '',
        intro: '',
        avatar: ''
      },
      saveBtnDisabled: false, // 保存按钮点击之后是否禁用, 防止多次提交
      VUE_APP_BASE_API: `${process.env.VUE_APP_BASE_API}`, // 接口API地址
      imagecropperShow: false, // 是否显示上传组件
      imagecropperKey: 0 // 上传组件id

    }
  },
  created() {
    console.log('created')
    if (this.$route.params && this.$route.params.id) {
      // 得到路由中的参数值, 如果有参数id, 则调用 fetchDataById(id) 方法
      const id = this.$route.params.id
      this.fetchDataById(id)
    }
  },
  methods: {
    // 上传头像关闭方法
    close() {
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
    },
    // 上传头像成功回调方法
    cropSuccess(data) {
      this.imagecropperShow = false
      // 上传成功之后，关闭弹窗
      this.teacher.avatar = data.url
      this.imagecropperKey = this.imagecropperKey + 1
    },
    // 判断是添加还是修改
    // 根据teacher判断是否有id
    saveOrUpdate() {
      if (!this.teacher.id) {
        // 没有id, 添加
        this.saveTeacher()
      } else {
        this.updateTeacherById()
      }
    },
    // 添加讲师的方法
    saveTeacher() {
      teacherApi.addTeacher(this.teacher).then(response => {
        // 添加成功
        // 提示信息
        this.$message({
          type: 'success',
          message: '添加成功!'
        })
        // 回到列表页面, 路由跳转
        this.$router.push({ path: '/edu/teacher/list' })
      })
    },
    // 根据教师id查询教师信息
    // 添加教师和修改教师使用的同一页面, 添加教师的时候该方法不需要调用, 修改的时候需要调用
    // 根据地址是否有id值确定是否调用fetchDataById()方法, 修改教师地址会传入id号
    fetchDataById(id) {
      teacherApi.getTeacherById(id).then(response => {
        this.teacher = response.data.teacher
      }).catch((response) => {
        this.$message({
          type: 'error',
          message: '获取数据失败'
        })
      })
    },
    // 根据教师id更新教师信息
    updateTeacherById() {
      this.saveBtnDisabled = true
      teacherApi.updateTeacherById(this.teacher).then(response => {
        this.$message({
          type: 'success',
          message: '修改成功'
        })
        this.$router.push({ path: '/edu/teacher/list' })
      }).catch((response) => {
        this.$message({
          type: 'error',
          message: '修改失败'
        })
      })
    }
  }
}

</script>

