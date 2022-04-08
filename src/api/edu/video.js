import request from '@/utils/request'

// const 将变量声明为一个常量
const api_name = '/edu/video'

export default {
  // 添加小节
  addVideo(video) {
    return request({
      url: `${api_name}/addVideo`,
      method: 'post',
      data: video
    })
  },

  // 删除小节同时删除视频
  deleteVideo(id) {
    return request({
      url: `${api_name}/deleteVideo/` + id,
      method: 'delete'
    })
  },

  // 根据小节id查询小节信息
  getVideo(videoId) {
    return request({
      url: `${api_name}/getVideoInfo/` + videoId,
      method: 'get'
    })
  },

  // 更新小节信息
  updateVideo(video) {
    return request({
      url: `${api_name}/updateVideoInfo`,
      method: 'post',
      data: video
    })
  }

}
