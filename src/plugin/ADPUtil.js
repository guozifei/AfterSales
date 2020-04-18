import _ from 'lodash'
import { Md5 } from 'ts-md5/dist/md5'

export function checksum () {
  if (arguments.length === 0) {
    throw 'Error checksum arguments'
  }
  // console.log('checksum:', _.join(arguments, '_'))
  return Md5.hashStr(_.join(arguments, '_'))
}
