import request from '@/utils/request'

// const 将变量声明为一个常量
const api_name = '/eduvod/video'

export default {

  // 根据id删除云端视频
  deleteAliyunVod(videoSourceId) {
    return request({
      url: `${api_name}/deleteVideoSource/${videoSourceId}`,
      method: 'delete'
    })
  }
}
