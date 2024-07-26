export default {
  registration(user: any): Promise<any> {
    return useApiFetch('/auth/registration', { method: 'POST', body: user })
  },
  login(email: string, password: string): Promise<any> {
    return useApiFetch('/auth/login', { method: 'POST', body: { email, password } })
  },
  refresh(): Promise<any> {
    return useApiFetch('/auth/refresh', { method: 'GET' })
  },
  resetPassword(password: string, token: string) {
    return useApiFetch('/auth/reset-password', { method: "POST", body: { password, token } })
  },
  forgotPassword(email: string) {
    return useApiFetch('/auth/forgot-password', { method: 'POST', body: { email } })
  },
  logout() {
    return useApiFetch('/auth/logout', { method: 'POST' })
  },
  updateUser(user: any): Promise<any> {
    return useApiFetch('/auth/update', { method: 'POST', body: { user } })
  },
  setManager(user_email:string,chosen_rest:string): Promise<any>{
    return useApiFetch('/user/set-manager', { method: 'POST', body: { user_email,chosen_rest } })
  },
  /**
   * 
   * @param userId 
   * @returns user's rests
   */
  getUserRests(userId: string): Promise<any> {
    return useApiFetch('/user/rests', {
      method: 'GET',
      query: {
        userId
      }
    })
  },
  chooseManagingRest(userId: string, restId: string): Promise<any> {
    return useApiFetch('/user/choose-managing-rest', {
      method: 'PATCH',
      body: {
        userId,
        restId
      }
    })
  }
}
