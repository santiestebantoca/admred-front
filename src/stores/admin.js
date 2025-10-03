import useAdminTiposStore from './admin-tipos'
import useAdminAreasStore from './admin-areas'
import useAdminUsersStore from './admin-users'

export default defineStore('http-client', () => {
  const tipos = useAdminTiposStore()
  const areas = useAdminAreasStore()
  const users = useAdminUsersStore()
  return { tipos, areas, users }
})
