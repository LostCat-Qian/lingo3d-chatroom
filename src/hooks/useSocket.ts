import io, { Socket } from 'socket.io-client'
import { SocketURL } from '../utils/URL'

const useSocket = () => {
  const socket: Socket = io(SocketURL)
  return socket
}
export default useSocket
