<template>
  <div class="app-container">

    <!--查询表单 教师列表-->
    <el-form :inline="true" class="demo-form-inline">

      <el-form-item>
        <el-input v-model="searchObj.name" placeholder="教师名" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchObj.level" clearable placeholder="教师职称">
          <el-option :value="1" label="教授" />
          <el-option :value="2" label="副教授" />
          <el-option :value="3" label="讲师" />
          <el-option :value="4" label="助教" />
        </el-select>
      </el-form-item>
      <el-form-item label="添加时间">
        <el-date-picker
          v-model="searchObj.begin"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="searchObj.end"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="fetchData()">查
        询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>

    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="数据加载中"
      border
      fit
      highlight-current-row
    >
      <el-table-column
        label="序号"
        width="70"
        align="center"
      >
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="id" label="ID" width="180" />
      <el-table-column prop="name" label="名称" width="80" />
      <el-table-column label="头衔" width="80">
        <template slot-scope="scope">
          <p v-if="scope.row.level===1">教授 </p>
          <p v-if="scope.row.level===2">副教授 </p>
          <p v-if="scope.row.level===3">讲师 </p>
          <p v-if="scope.row.level===4">助教 </p>
        </template>
      </el-table-column>
      <el-table-column prop="intro" label="资历" />
      <el-table-column prop="gmtCreate" label="添加时间" width="160" />
      <el-table-column prop="sort" label="排序" width="60" />
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/edu/teacher/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">
              修改
            </el-button>
          </router-link>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeDataById(scope.row.id)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="fetchData"
    />

  </div>
</template>

<script>
import teacher from '@/api/edu/teacher'
export default {
  data() { // 定义变量和初始值, 名字随便写
    return {
      listLoading: true, // 是否显示loading信息
      list: null, // 查询之后返回的数据列表
      total: 0, // 总记录数
      page: 1, // 页码
      limit: 10, // 每页记录数
      searchObj: {}// 查询条件
    }
  },

  created() { // 当页面加载时获取数据, 页面渲染之前执行，一般调用methods中的方法
    this.fetchData()
  },

  methods: {
    fetchData(page = 1) { // 调用api层获取数据库中的数据
      console.log('加载列表')
      this.page = page
      this.listLoading = true
      // 分页查询教师信息
      teacher.getPageList(this.page, this.limit, this.searchObj).then(response => {
        // .then请求成功, response接口返回的数据
        this.list = response.data.rows
        // console.log(this.list) // 返回数据集合
        this.total = response.data.total
        this.listLoading = false
        // console.log(this.total) // 总记录数
      }).catch(error => { // 请求失败
        console.log(error)
      })
    },
    // 清空查询信息
    resetData() { // 清空数据
      this.searchObj = {}
      this.fetchData()
    },
    // 通过id删除教师信息
    removeDataById(id) {
      this.$confirm('此操作将永久删除讲师记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // 点击确定，执行then方法
        // 调用删除的方法
        teacher.deleteTeacherId(id)
          .then(response => { // 删除成功
            // 提示信息
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            // 回到列表页面
            this.fetchData()
          })
      }) // 点击取消，执行catch方法
    }
  }
}
</script>

