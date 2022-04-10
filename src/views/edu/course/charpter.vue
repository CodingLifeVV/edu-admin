
<template>
  <div class="app-container">
    <!-- 发布新课程—创建课程大纲 -->
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="提交审核" />
    </el-steps>

    <el-button type="text" @click="openChapterDialog()">添加章节</el-button>

    <!-- 1. 章节 -->
    <ul class="chapterList">
      <li v-for="chapter in chapterVideoList" :key="chapter.id">
        <p>
          {{ chapter.title }}
          <span class="acts">
            <el-button style type="text" @click="openVideo(chapter.id)">添加小节</el-button>
            <el-button style type="text" @click="openEditChatper(chapter.id)">编辑</el-button>
            <el-button type="text" @click="removeChapter(chapter.id)">删除</el-button>
          </span>
        </p>

        <!-- 小节-视频 -->
        <ul class="chanpterList videoList">
          <li v-for="video in chapter.children" :key="video.id">
            <p>
              {{ video.title }}
              <span class="acts">
                <el-button style type="text" @click="openEditVideo(video.id)">编辑</el-button>
                <el-button type="text" @click="removeVideo(video.id)">删除</el-button>
              </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>

    <div>
      <el-button @click="previous">上一步</el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
    </div>

    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title" />
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number v-model="chapter.sort" :min="0" controls-position="right" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加和修改小节表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title" />
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right" />
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.free">
            <el-radio :label="true">免费</el-radio>
            <el-radio :label="false">默认</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 上传视频 -->
        <el-form-item label="上传视频">
          <el-upload
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-remove="beforeVodRemove"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            :url="VUE_APP_BASE_API+'/eduvod/video/uploadVideo'"
            :action="VUE_APP_BASE_API+'/eduvod/video/uploadVideo'"
            :limit="1"
            class="upload-demo"
          >
            <el-button size="small" type="primary">上传视频</el-button>
            <el-tooltip placement="right-end">
              <div slot="content">
                最大支持1G，
                <br>支持3GP、ASF、AVI、DAT、DV、FLV、F4V、
                <br>GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、
                <br>MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、
                <br>SWF、TS、VOB、WMV、WEBM 等视频格式上传
              </div>
              <i class="el-icon-question" />
            </el-tooltip>
          </el-upload>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="saveOrUpdateVideo">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>

import chapterApi from '@/api/edu/chapter'
import videoApi from '@/api/edu/video'
import vodApi from '@/api/edu/vod'

export default {
  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      courseId: '', // 课程id
      chapterVideoList: [],
      chapter: {
        // 封装章节数据
        title: '',
        sort: 0
      },
      video: {
        title: '',
        sort: 0,
        free: 0,
        videoSourceId: ''
      },
      fileList: [], // 上传文件列表
      VUE_APP_BASE_API: `${process.env.VUE_APP_BASE_API}`, // 接口API地址
      dialogChapterFormVisible: false, // 添加章节弹框
      dialogVideoFormVisible: false // 添加小节弹窗
    }
  },
  created() {
    console.log('chapter created')
    // 获取路由的id值
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id
      // 根据课程id查询章节和小节
      this.getChapterVideo()
    }
  },
  methods: {
    // 上一步
    previous() {
      console.log('previous')
      this.$router.push({ path: '/edu/course/info/' + this.courseId })
      // this.$router.push({ path: '/edu/course/info/1' })
    },
    // 下一步
    next() {
      console.log('next')
      this.$router.push({ path: '/edu/course/publish/' + this.courseId })
    },
    // ==============================章节操作====================================
    // 根据课程id查询所有章节和小节信息
    getChapterVideo() {
      chapterApi.getAllChapterVideo(this.courseId).then(response => {
        this.chapterVideoList = response.data.allChapterVideo
      })
    },
    // 保存还是修改章节
    saveOrUpdate() {
      if (!this.chapter.id) {
        this.addChapter()
      } else {
        this.updateChapter()
      }
    },
    // 增加章节
    addChapter() {
      // 设置课程id到chapter对象里面
      this.chapter.courseId = this.courseId
      chapterApi.addChapter(this.chapter).then(response => {
        // 关闭弹框
        this.dialogChapterFormVisible = false
        // 提示
        this.$message({
          type: 'success',
          message: '添加章节成功!'
        })
        // 刷新页面
        this.getChapterVideo()
      })
    },
    // 更新章节信息
    updateChapter() {
      chapterApi.updateChapter(this.chapter).then(response => {
        // 关闭弹框
        this.dialogChapterFormVisible = false
        // 提示
        this.$message({
          type: 'success',
          message: '修改章节成功!'
        })
        // 刷新页面
        this.getChapterVideo()
      })
    },
    // 弹出添加章节页面
    openChapterDialog() {
      // 弹框
      this.dialogChapterFormVisible = true
      // 表单数据清空
      this.chapter.title = ''
      this.chapter.sort = 0
    },
    // 修改章节信息,弹框数据回显
    openEditChatper(chapterId) {
      // 显示弹框
      this.dialogChapterFormVisible = true
      // 调用接口
      chapterApi.getChapter(chapterId).then(response => {
        this.chapter = response.data.chapter
      })
    },
    // 删除章节
    removeChapter(chapterId) {
      this.$confirm('此操作将删除章节, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 点击确定，执行then方法
        // 调用删除的方法
        chapterApi.deleteChapter(chapterId).then(response => {
          // 删除成功
          // 提示信息
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          // 刷新页面
          this.getChapterVideo()
        })
      }) // 点击取消，执行catch方法
    },
    // ==============================小节操作====================================
    // 添加小节弹框
    openVideo(chapterId) {
      // 弹框
      this.dialogVideoFormVisible = true
      // 设置章节id
      this.video.chapterId = chapterId
    },
    // 添加小节,弹窗点击确定之后调用
    saveOrUpdateVideo() {
      // this.addVideo()
      if (!this.video.id) {
        this.addVideo()
      } else {
        this.updateVideo()
      }
    },
    // 添加小节
    addVideo() {
      // 设置课程id
      this.video.courseId = this.courseId
      videoApi.addVideo(this.video).then(response => {
        // 关闭弹框
        this.dialogVideoFormVisible = false
        // 提示
        this.$message({
          type: 'success',
          message: '添加小节成功!'
        })
        // 刷新页面
        this.getChapterVideo()
      })
    },
    // 更新小节信息
    updateVideo() {
      videoApi.updateVideo(this.video).then(response => {
        // 关闭弹框
        this.dialogVideoFormVisible = false
        // 提示
        this.$message({
          type: 'success',
          message: '修改小节成功!'
        })
        // 刷新页面
        this.getChapterVideo()
      })
    },
    // 删除小节
    removeVideo(id) {
      this.$confirm('此操作将删除小节, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 点击确定，执行then方法
        // 调用删除的方法
        videoApi.deleteVideo(id).then(response => {
          // 删除成功
          // 提示信息
          this.$message({
            type: 'success',
            message: '删除小节成功!'
          })
          // 刷新页面
          this.getChapterVideo()
        })
      }) // 点击取消，执行catch方法
    },
    // 修改小节信息,弹框数据回显
    openEditVideo(videoId) {
      // 显示弹框
      this.dialogVideoFormVisible = true
      // 调用接口
      videoApi.getVideo(videoId).then(response => {
        this.video = response.data.video
      })
    },
    // ==============上传视频方法==============
    // 点击确定调用的方法
    handleVodRemove() {
      // 调用接口的删除视频的方法
      vodApi.deleteAliyunVod(this.video.videoSourceId).then(response => {
        // 提示信息
        this.$message({
          type: 'success',
          message: '删除视频成功!'
        })
        // 把文件列表清空
        this.fileList = []
        // 把video视频id和视频名称值清空
        // 上传视频id赋值
        this.video.videoSourceId = ''
        // 上传视频名称赋值
        this.video.videoOriginalName = ''
      })
    },
    // 点击×调用这个方法
    beforeVodRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    // 上传视频成功调用的方法
    handleVodUploadSuccess(response, file, fileList) {
      // 上传视频id赋值
      this.video.videoSourceId = response.data.videoId
      // 上传视频名称赋值
      this.video.videoOriginalName = file.name
    },
    handleUploadExceed() {
      this.$message.warning('想要重新上传视频，请先删除已上传的视频')
    }

  }
}
</script>
<style scoped>
.chapterList {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}
.chapterList li {
  position: relative;
}
.chapterList p {
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #ddd;
}
.chapterList .acts {
  float: right;
  font-size: 14px;
}

.videoList {
  padding-left: 50px;
}
.videoList p {
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #ddd;
}
</style>

