import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '../../shared/components/layout/AppLayout'
import { apiBaseUrl } from '../../shared/config/api'
import {
  clearSession,
  getAccessToken,
  getSessionUser,
  loadSessionUser,
} from '../auth/services/authSession'

type AdminUser = {
  code: string
  firstName: string
  lastName: string
  email: string
  status: string
  role: 'USER' | 'ADMIN'
  createdAt: string
}

export function AdminUsersPage() {
  const navigate = useNavigate()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [creating, setCreating] = useState(false)

  const request = async (path = '', init?: RequestInit) => {
    const token = getAccessToken()
    const response = await fetch(`${apiBaseUrl}/api/admin/users${path}`, {
      ...init,
      headers: {
        ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
        Authorization: `Bearer ${token}`,
        ...init?.headers,
      },
    })
    if (response.status === 401) {
      clearSession()
      navigate('/login', { replace: true })
      throw new Error('Tu sesión expiró.')
    }
    if (response.status === 403) throw new Error('No tienes permisos de administrador.')
    if (!response.ok) throw new Error('No fue posible completar la operación.')
    return response
  }

  const load = async () => {
    setLoading(true)
    try {
      const session = getSessionUser() ?? (await loadSessionUser())
      if (session?.role !== 'ADMIN') {
        setError('Esta sección está disponible solo para administradores.')
        return
      }
      const response = await request()
      setUsers((await response.json()) as AdminUser[])
      setError('')
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'No fue posible cargar usuarios.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const create = async (event: FormEvent) => {
    event.preventDefault()
    setCreating(true)
    try {
      await request('', {
        method: 'POST',
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      })
      setName('')
      setEmail('')
      await load()
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'No fue posible crear el usuario.')
    } finally {
      setCreating(false)
    }
  }

  const remove = async (user: AdminUser) => {
    if (!window.confirm(`¿Eliminar la cuenta de ${user.firstName} ${user.lastName}?`)) return
    try {
      await request(`/${encodeURIComponent(user.code)}`, { method: 'DELETE' })
      await load()
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'No fue posible eliminar el usuario.')
    }
  }

  return (
    <AppLayout activePage="admin-users" className="admin-users-page section-shell">
      <header className="admin-users-heading">
        <span className="pill">Administración</span>
        <h1>Usuarios</h1>
        <p>Crea cuentas mediante invitación y administra sus accesos.</p>
      </header>

      <form className="admin-user-create" onSubmit={create}>
        <label>
          Nombre completo
          <input value={name} onChange={(event) => setName(event.target.value)} required />
        </label>
        <label>
          Correo electrónico
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        <button className="primary-cta" disabled={creating}>
          {creating ? 'Creando…' : 'Crear usuario'}
        </button>
      </form>

      {error && <p className="admin-users-error" role="alert">{error}</p>}
      {loading ? (
        <p>Cargando usuarios…</p>
      ) : (
        <div className="admin-users-table-wrap">
          <table className="admin-users-table">
            <thead><tr><th>Usuario</th><th>Rol</th><th>Estado</th><th>Creación</th><th>Acciones</th></tr></thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.code}>
                  <td><strong>{user.firstName} {user.lastName}</strong><small>{user.email}</small></td>
                  <td><span className={`admin-badge role-${user.role.toLowerCase()}`}>{user.role}</span></td>
                  <td><span className="admin-badge">{user.status}</span></td>
                  <td>{new Intl.DateTimeFormat('es-CL').format(new Date(user.createdAt))}</td>
                  <td><button className="admin-delete" disabled={user.role === 'ADMIN'} onClick={() => void remove(user)}>Eliminar</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppLayout>
  )
}
