// pages/login.tsx o app/login.tsx
import { useState } from 'react'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Lógica de inicio de sesión
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center text-white p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-5xl text-center text-white font-extrabold mb-8">Iniciar sesión</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo electrónico"
            className="w-full p-3 rounded-xl bg-gray-800 text-white"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="w-full p-3 rounded-xl bg-gray-800 text-white"
          />
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-xl mt-4 hover:bg-blue-700 transition-all"
          >
            Iniciar sesión
          </button>
        </form>
        <div className="mt-4 text-center text-gray-400">
          ¿No tienes cuenta?{' '}
          <Link href="/signup">
            <a className="text-blue-400 hover:text-blue-500">Crea una ahora</a>
          </Link>
        </div>
      </div>
    </main>
  )
}
