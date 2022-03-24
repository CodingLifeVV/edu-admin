import request from '@/utils/request'

// const 将变量声明为一个常量
const api_name = '/edu/subject'

export default {
  // 获得课程列表
  getAllNestedCourseSubject() {
    return request({
      url: `${api_name}/getAllSubject`,
      method: 'get'
    })
  }
}
