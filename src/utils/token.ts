const key: string = 'myPrivateKey'

const setToken = (token: string) => {
  localStorage.setItem(key, token)
}

const setSessionToken = (token: string) => {
  sessionStorage.setItem(key, token)
}

const getToken = () => {
  const token = localStorage.getItem(key)
  return token
}

const getSessionToken = () => {
  const token = sessionStorage.getItem(key)
  return token
}

const removeToken = () => {
  localStorage.removeItem(key)
}

export { setToken, getToken, removeToken, setSessionToken, getSessionToken }
