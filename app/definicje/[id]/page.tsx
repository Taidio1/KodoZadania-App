'use client'

import { useEffect, useState, use } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCheck } from 'lucide-react'
import { XCircle } from 'lucide-react'

interface Definition {
  id: string
  title: string
  language: string
  difficulty: string | null
  definition_content: string
  comparison: string | null
  code_example: string | null
}

const difficultyColors: Record<string, string> = {
  easy: 'bg-green-500/10 text-green-500',
  medium: 'bg-yellow-500/10 text-yellow-500',
  hard: 'bg-red-500/10 text-red-500',
  'N/A': 'bg-gray-500/10 text-gray-500', // Handle definitions without difficulty
}

export default function DefinitionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [definition, setDefinition] = useState<Definition | null>(null)
  const [loading, setLoading] = useState(true)
  const [isRead, setIsRead] = useState(false)

  useEffect(() => {
    const fetchDefinition = async () => {
      try {
        const { data, error } = await supabase
          .from('definitions')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error
        setDefinition(data)

        // Check if the definition has been read by the current user
        const { data: readData, error: readError } = await supabase
          .from('user_read_definitions')
          .select('definition_id')
          .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
          .eq('definition_id', id)
          .single()

        if (readData) {
          setIsRead(true)
        } else if (readError && readError.code !== 'PGRST116') { // PGRST116 means no rows found
          console.error('Error checking if definition read:', readError.message)
        }
      } catch (error) {
        console.error('Error fetching definition:', error)
        router.push('/definicje') // Redirect if definition not found or error
      } finally {
        setLoading(false)
      }
    }

    fetchDefinition()
  }, [id, router, supabase])

  const handleMarkAsRead = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      console.error('User not logged in')
      return // Or show a login required message
    }

    if (!definition || isRead) return

    try {
      const { error } = await supabase
        .from('user_read_definitions')
        .insert({
          user_id: user.id,
          definition_id: definition.id,
        })

      if (error) throw error

      setIsRead(true)
      console.log('Definition marked as read')
      // Optionally show a toast notification
    } catch (error) {
      console.error('Error marking definition as read:', error)
      // Optionally show an error toast
    }
  }

  const handleUnmarkAsRead = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      console.error('User not logged in')
      return // Or show a login required message
    }

    if (!definition || !isRead) return // Only unmark if it's currently marked as read

    try {
      const { error } = await supabase
        .from('user_read_definitions')
        .delete()
        .eq('user_id', user.id)
        .eq('definition_id', definition.id)

      if (error) throw error

      setIsRead(false)
      console.log('Definition unmarked as read')
      // Optionally show a toast notification
    } catch (error) {
      console.error('Error unmarking definition as read:', error)
      // Optionally show an error toast
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading definition...</p>
      </div>
    )
  }

  if (!definition) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Definition not found</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center mb-4">
          <Button variant="outline" onClick={() => router.push('/definicje')}>
            Back to Definitions
          </Button>
          {/* Placeholder for 'Mark as Read' button */}
          {/* <Button variant="outline">Mark as Read</Button> */}
          <Button
            variant={isRead ? 'destructive' : 'outline'}
            onClick={isRead ? handleUnmarkAsRead : handleMarkAsRead}
            disabled={loading}
          >
            {isRead ? (
              <><XCircle className="mr-2 h-4 w-4" /> Usuń z listy przeczytanych</>
            ) : (
              'Oznacz jako przeczytane'
            )}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">{definition.title}</CardTitle>
              <div className="flex gap-2">
                <Badge>{definition.language}</Badge>
                {definition.difficulty && (
                   <Badge className={difficultyColors[definition.difficulty]}>
                    {definition.difficulty.charAt(0).toUpperCase() + definition.difficulty.slice(1)}
                   </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none">
              <h3>Definicja:</h3>
              <p>{definition.definition_content}</p>

              {definition.comparison && (
                <>
                  <h3>Porównanie:</h3>
                  <p>{definition.comparison}</p>
                </>
              )}

              {definition.code_example && (
                <>
                  <h3>Przykład Kodu:</h3>
                  <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
                    <code className={`language-${definition.language.toLowerCase()}`}>{definition.code_example}</code>
                  </pre>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
} 