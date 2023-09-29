import { MODE_MASTER_SERVER } from './variables'

function masterServerRoute () {
  let ret
  if (MODE_MASTER_SERVER === 'local') ret = 'http://localhost:8000'
  else if (MODE_MASTER_SERVER === 'homol') ret = 'https://homolr.b3dev.net/api'
  else if (MODE_MASTER_SERVER === 'darta') ret = 'http://192.168.1.5:8000'
  else if (MODE_MASTER_SERVER === 'tiago') ret = 'http://192.168.1.3:8000'
  else if (MODE_MASTER_SERVER === 'dev') ret = 'https://api6.b3dev.dev:8000'
  return ret
}

export { masterServerRoute }
