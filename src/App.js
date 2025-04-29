import React from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

function App() {
  const router = useRouter()
  const { user } = useAuth()

  React.useEffect(() => {
    if (user) {
      router.push('/dashboard')
    } else {
      router.push('/')
    }
  }, [router, user])

  return null
}

export default App 