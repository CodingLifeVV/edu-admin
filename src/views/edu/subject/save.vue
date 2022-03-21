<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="信息描述">
        <el-tag type="info">excel模版说明</el-tag>
        <el-tag>
          <i class="el-icon-download" />
          <a
            :href="'https://eduvv.oss-cn-beijing.aliyuncs.com/excel/%E8%AF%BE%E7%A8%8B%E5%88%86%E7%B1%BB.xlsx'"
          >点击下载模版</a>
        </el-tag>
      </el-form-item>

      <el-form-item label="添加分类">
        <el-upload
          ref="upload"
          :auto-upload="false"
          :on-success="fileUploadSuccess"
          :on-error="fileUploadError"
          :disabled="importBtnDisabled"
          :limit="1"
          :action="VUE_APP_BASE_API+'/edu/subject/addSubject'"
          name="file"
          accept="application/vnd.ms-excel"
        >
          <el-button slot="trigger" size="medium" type="primary">选取 Excel 文件</el-button>
          <el-button
            :loading="loading"
            style="margin-left: 10px;"
            size="medium"
            type="success"
            @click="submitUpload"
          >导入分类</el-button>
          <div slot="tip" class="el-upload__tip">只能上传 excel 文件</div>
        </el-upload>

      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      VUE_APP_BASE_API: `${process.env.VUE_APP_BASE_API}`, // 接口API地址
      importBtnDisabled: false, // 按钮是否禁用,
      loading: false
    }
  },
  created() {},
  methods: {
    // 上传文件
    submitUpload() {
      this.importBtnDisabled = true
      this.loading = true
      this.$refs.upload.submit()
    },
    // 上传成功
    fileUploadSuccess(response) {
      if (response.success === true) {
        this.loading = false
        this.$message({
          type: 'success',
          message: '添加课程分类成功'
        })
        // 回到列表页面，路由跳转
        this.$router.push({ path: '/edu/subject/list' })
      }
    },
    // 上传失败
    fileUploadError(response) {
      this.loading = false
      this.$message({
        type: 'error',
        message: '添加课程分类失败'
      })
    }
  }

}

</script>
