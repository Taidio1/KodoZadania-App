'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChallengeList } from '@/components/challenges/challenge-list'
import { ThemeToggle } from '@/components/theme-toggle'
import { ChallengeFilters } from '@/components/challenges/challenge-filters'

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/')
      }
      setLoading(false)
    }

    checkSession()
  }, [router, supabase])


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Zadania</h1>
      </div>
      
      <div className="grid gap-6">
        <section>
          <ChallengeList />
        </section>
      </div>
    </main>
  )
} 