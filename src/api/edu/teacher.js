import request from '@/utils/request'

// const 将变量声明为一个常量
const api_name = '/teacher'

// export default 导出常量、函数、文件、模块等
// 使用 import 导入
export default {
  // 教师列表（分页条件查询）
  getPageList(page, limit, searchObj) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'get',
      data: searchObj
    })
  },
  // 通过id删除教师
  removeById(teacherId) {
    return request({
      url: `${api_name}/${teacherId}`,
      method: 'delete'
    })
  }
}
