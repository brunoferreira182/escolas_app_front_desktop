import { MODE_MASTER_SERVER, MODE_SERVER } from './variables'

const port = MODE_SERVER === 'master' ? 8000 : 8010

function masterServerRoute () {
  let ret
  if (MODE_MASTER_SERVER === 'local') ret = 'http://localhost:' + port
  else if (MODE_MASTER_SERVER === 'dev') ret = 'https://api6.b3dev.dev:' + port
  else if (MODE_MASTER_SERVER === 'tiago') ret = 'http://192.168.1.3:' + port
  else if (MODE_MASTER_SERVER === 'darta') ret = 'http://192.168.1.2:' + port
  else if (MODE_MASTER_SERVER === 'prod') ret = 'https://api2.b3dev.dev:' + port
  return ret
}

export { masterServerRoute }
