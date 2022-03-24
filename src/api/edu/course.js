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
  // 修改课程信息
  updateCourseInfo(courseInfo) {
    return request({
      url: `${api_name}/updateCourseInfo`,
      method: 'post',
      data: courseInfo
    })
  }
}
