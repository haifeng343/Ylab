// 默认选中处理
export function getSelected(data) {
  const selectedArr = []
  shendu(data)
  function shendu(data) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].isSelect) {
        selectedArr.push(data[i].id)
      }
      if (data[i].child) {
        shendu(data[i].child)
      }
    }
  }
  return selectedArr
}

// 过滤isMenu
export function setDisabled(arr) {
  for (let i = 0; i < arr.length; i++) {
    arr[i].disabled = true
    if (arr[i].child) {
      setDisabled(arr[i].child)
    }
  }
  return arr
}
