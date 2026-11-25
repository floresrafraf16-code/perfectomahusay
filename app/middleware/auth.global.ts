export default defineNuxtRouteMiddleware((to) => {
  const isAdminAuthenticated = useState<boolean>('pmcc_is_admin_auth', () => false)

  if (import.meta.client) {
    const savedAuth = window.localStorage.getItem('pmcc_admin_auth_v1') === 'true'
    isAdminAuthenticated.value = savedAuth

    if (to.path !== '/' && !savedAuth) {
      return navigateTo('/')
    }
  }
})