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
  }

  // 删除小节同时删除视频
}
