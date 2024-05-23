export const formatSize = (fileSize: number) => {
  if (fileSize === 0) {
    return 'Unknown'
  } else {
    const i = Math.floor(Math.log(fileSize) / Math.log(1024))
    const size = ((fileSize / Math.pow(1024, i)) * 1).toFixed(2)
    return `${size} ${['B', 'kB', 'MB', 'GB', 'TB'][i]}`
  }
}
