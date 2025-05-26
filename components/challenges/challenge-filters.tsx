'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Filters {
  language: string
  topic: string
  difficulty: string
}

interface ChallengeFiltersProps {
  onFilterChange: (filters: Filters) => void
}

export function ChallengeFilters({ onFilterChange }: ChallengeFiltersProps) {
  const [languages, setLanguages] = useState<string[]>([])
  const [topics, setTopics] = useState<string[]>([])
  const [filters, setFilters] = useState<Filters>({
    language: 'all',
    topic: 'all',
    difficulty: 'all',
  })
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const { data: challenges, error } = await supabase
          .from('challenges')
          .select('jezyk_pro, topic_pro')

        if (error) throw error

        // Get unique values
        const uniqueLanguages = Array.from(new Set(challenges.map(c => c.jezyk_pro)))
        const uniqueTopics = Array.from(new Set(challenges.map(c => c.topic_pro)))

        setLanguages(uniqueLanguages)
        setTopics(uniqueTopics)
      } catch (error) {
        console.error('Error fetching filters:', error)
      }
    }

    fetchFilters()
  }, [supabase])

  const handleFilterChange = (key: keyof Filters, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = {
      language: 'all',
      topic: 'all',
      difficulty: 'all',
    }
    setFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Filters</CardTitle>
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Programming Language</label>
            <Select
              value={filters.language}
              onValueChange={(value) => handleFilterChange('language', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                {languages.map((language) => (
                  <SelectItem key={language} value={language}>
                    {language}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Topic</label>
            <Select
              value={filters.topic}
              onValueChange={(value) => handleFilterChange('topic', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select topic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Topics</SelectItem>
                {topics.map((topic) => (
                  <SelectItem key={topic} value={topic}>
                    {topic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Difficulty</label>
            <Select
              value={filters.difficulty}
              onValueChange={(value) => handleFilterChange('difficulty', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.language !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {filters.language}
                <button
                  className="ml-1 hover:text-destructive"
                  onClick={() => handleFilterChange('language', 'all')}
                >
                  ×
                </button>
              </Badge>
            )}
            {filters.topic !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {filters.topic}
                <button
                  className="ml-1 hover:text-destructive"
                  onClick={() => handleFilterChange('topic', 'all')}
                >
                  ×
                </button>
              </Badge>
            )}
            {filters.difficulty !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {filters.difficulty.charAt(0).toUpperCase() + filters.difficulty.slice(1)}
                <button
                  className="ml-1 hover:text-destructive"
                  onClick={() => handleFilterChange('difficulty', 'all')}
                >
                  ×
                </button>
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 