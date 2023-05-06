import io, { Socket } from 'socket.io-client'
import { SocketURL } from '../utils/URL'

const useSocket = (roomid?: string) => {
  const socket: Socket = io(SocketURL)
  // const socket: Socket = io(`http://localhost:3000?roomid=${roomid}`)
  return socket
}

export default useSocket
