import OSS from 'ali-oss'
import { parseTime } from '@/utils'

// 读取文件
function readFile(option) {
  return new Promise((resolve, reject) => {
    try {
      const file = new FileReader()
      file.addEventListener('load', e => {
        resolve(e.target.result)
      })
      file.readAsArrayBuffer(option.file)
    } catch (e) {
      reject()
    }
  })
}

// oss上传文件
// option 上传过程中的回调参数
// eslint-disable-next-line
export default async (option = {}) => {
  const fileResult = await readFile(option)
  if (!fileResult) return option.onError ? option.onError('读取文件失败') : '读取文件失败'

  const ossClient = new OSS({
    region: 'oss-cn-beijing',
    accessKeyId: 'LTAI4GKZ53eoTEYTTdfszb8Z',
    accessKeySecret: 'BdWuNpJkw12rprTFW4GpwLf0tEvV9S',
    bucket: 'erp-new'
  })
  // 格式化文件名
  const ossObj = `erp/file/${parseTime(new Date(), '{y}{m}{d}')}/${new Date().getTime()}-${option.file.name}`
  try {
    // 调用 oss实例put方式上传文件
    const result = await ossClient.put(ossObj, OSS.Buffer(fileResult))
    return option.onSuccess ? option.onSuccess(result) : result
  } catch (e) {
    return option.onError ? option.onError('上传失败') : { res: 'FAIL' }
  }
}
