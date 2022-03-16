import request from '@/utils/request'

// const 将变量声明为一个常量
const api_name = '/edu/teacher'

// export default 导出常量、函数、文件、模块等
// 使用 import 导入
export default {
  // 教师列表(分页条件查询)
  getPageList(current, limit, searchObj) {
    return request({
      url: `${api_name}/listByPageCondition/${current}/${limit}`,
      method: 'post',
      data: searchObj
    })
  },
  // 通过id删除教师
  deleteTeacherId(teacherId) {
    return request({
      url: `${api_name}/delete/${teacherId}`,
      method: 'delete'
    })
  },
  // 新增教师
  addTeacher(teacher) {
    return request({
      url: `${api_name}/addTeacher`,
      method: 'post',
      data: teacher
    })
  },
  // 通过Id查询教师信息
  getTeacherById(id) {
    return request({
      url: `${api_name}/getTeacher/${id}`,
      method: 'get'
    })
  },
  // 根据教师id更新教师信息
  updateTeacherById(teacher) {
    return request({
      url: `${api_name}/updateTeacher`,
      method: 'post',
      data: teacher
    })
  }

}
