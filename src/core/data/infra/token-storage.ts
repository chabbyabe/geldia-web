const ACCESS_TOKEN_KEY = 'accessToken'

export const tokenStorage = {
  getAccessToken() {
    return sessionStorage.getItem(ACCESS_TOKEN_KEY)
  },
  setAccessToken(token: string) {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, token)
  },
  removeAccessToken() {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY)
  },
  hasAccessToken() {
    return Boolean(sessionStorage.getItem(ACCESS_TOKEN_KEY))
  }
}
