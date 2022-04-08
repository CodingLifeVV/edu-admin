import request from '@/utils/request'

// const 将变量声明为一个常量
const api_name = '/edu/course'

export default {
  // 1 添加课程信息
  addCourseInfo(courseInfo) {
    return request({
      url: `${api_name}/addCourseInfo`,
      method: 'post',
      data: courseInfo
    })
  },
  // 2 根据id查询课程信息
  getCourseInfoId(courseId) {
    return request({
      url: `${api_name}/getCourseInfo/` + courseId,
      method: 'get'
    })
  },
  // 3 修改课程信息
  updateCourseInfo(courseInfo) {
    return request({
      url: `${api_name}/updateCourseInfo`,
      method: 'post',
      data: courseInfo
    })
  },
  // 根据课程id查询待发布课程信息
  getPublihCourseInfo(courseId) {
    return request({
      url: `${api_name}/getPublishCourseInfo/` + courseId,
      method: 'get'
    })
  },
  // 发布课程
  publihCourse(courseId) {
    return request({
      url: `${api_name}/publishCourse/` + courseId,
      method: 'post'
    })
  },
  // 分页查询课程信息
  listByPageCondition(current, limit, courseQuery) {
    return request({
      url: `${api_name}/listByPageCondition/${current}/${limit}`,
      method: 'post',
      data: courseQuery
    })
  },
  // 删除课程
  removeCourse(id) {
    return request({
      url: `${api_name}/deleteCourse/${id}`,
      method: 'delete'
    })
  }
}
