import { CONNECT_SOCKET, DISCONNECT_SOCKET, AVAILABLE_SOCKET, UNAVAILABLE_SOCKET, HIDE_SOCKET_NOTIFICATION } from '../constants'

export function connectSocket () {
  return {
    type: CONNECT_SOCKET
  }
}

export function disconnectSocket () {
  return {
    type: DISCONNECT_SOCKET
  }
}

export function availableSocket () {
  return {
    type: AVAILABLE_SOCKET
  }
}

export function unavailableSocket () {
  return {
    type: UNAVAILABLE_SOCKET
  }
}

export function hideSocketNotification () {
  return {
    type: HIDE_SOCKET_NOTIFICATION
  }
}
