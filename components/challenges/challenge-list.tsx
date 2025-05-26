'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { ChallengeCard } from './challenge-card'
import { ChallengeFilters } from './challenge-filters'

interface Challenge {
  id: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  jezyk_pro: string
  topic_pro: string
}

interface Filters {
  language: string
  topic: string
  difficulty: string
}

export function ChallengeList() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<Filters>({
    language: 'all',
    topic: 'all',
    difficulty: 'all',
  })
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        let query = supabase
          .from('challenges')
          .select('*')
          .order('created_at', { ascending: false })

        if (filters.language !== 'all') {
          query = query.eq('jezyk_pro', filters.language)
        }
        if (filters.topic !== 'all') {
          query = query.eq('topic_pro', filters.topic)
        }
        if (filters.difficulty !== 'all') {
          query = query.eq('difficulty', filters.difficulty)
        }

        const { data, error } = await query

        if (error) throw error
        setChallenges(data || [])
      } catch (error) {
        console.error('Error fetching challenges:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchChallenges()
  }, [supabase, filters])

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters)
  }

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-48 rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
    )
  }

  if (challenges.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No challenges found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <ChallengeFilters onFilterChange={handleFilterChange} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {challenges.map((challenge) => (
          <ChallengeCard
            key={challenge.id}
            id={challenge.id}
            title={challenge.title}
            description={challenge.description}
            difficulty={challenge.difficulty}
            language={challenge.jezyk_pro}
            topic={challenge.topic_pro}
          />
        ))}
      </div>
    </div>
  )
} 