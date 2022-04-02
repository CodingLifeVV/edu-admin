import request from '@/utils/request'

// const 将变量声明为一个常量
const api_name = '/edu/chapter'

export default {
  // 1 根据课程id获取章节和小节数据列表
  getAllChapterVideo(courseId) {
    return request({
      url: `${api_name}/getChapterVideo/` + courseId,
      method: 'get'
    })
  },
  // 添加章节
  addChapter(chapter) {
    return request({
      url: `${api_name}/addChapter/`,
      method: 'post',
      data: chapter
    })
  },
  // 根据id查询章节
  getChapter(chapterId) {
    return request({
      url: `${api_name}/getChapterInfo/` + chapterId,
      method: 'get'
    })
  },
  // 修改章节信息
  updateChapter(chapter) {
    return request({
      url: `${api_name}/updateChapter/`,
      method: 'post',
      data: chapter
    })
  },
  // 根据章节id删除章节
  deleteChapter(chapterId) {
    return request({
      url: `${api_name}/deleteChapter/` + chapterId,
      method: 'delete'
    })
  }

}
