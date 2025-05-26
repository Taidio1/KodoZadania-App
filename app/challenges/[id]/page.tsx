'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemeToggle } from '@/components/theme-toggle'
import { CodeEditor } from '@/components/code-editor'
import { useToast } from '@/components/ui/use-toast'

interface Challenge {
  id: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  jezyk_pro: string
  topic_pro: string
  starter_code: string
  solution: string
  test_cases: any
}

const difficultyColors = {
  easy: 'bg-green-500/10 text-green-500',
  medium: 'bg-yellow-500/10 text-yellow-500',
  hard: 'bg-red-500/10 text-red-500',
}

export default function ChallengePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [loading, setLoading] = useState(true)
  const [code, setCode] = useState('')
  const [showSolution, setShowSolution] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const { data, error } = await supabase
          .from('challenges')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error
        setChallenge(data)
        setCode(data.starter_code)
      } catch (error) {
        console.error('Error fetching challenge:', error)
        router.push('/dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchChallenge()
  }, [id, router, supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleSubmit = async () => {
    if (!challenge) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/run-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          challengeId: challenge.id,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit solution')
      }

      toast({
        title: data.success ? 'Success!' : 'Try Again',
        description: data.message,
        variant: data.success ? 'default' : 'destructive',
      })

      if (data.success) {
        // Mark challenge as completed for the user
        const { data: { user } } = await supabase.auth.getUser()
        if (user && challenge) {
          const { error: insertError } = await supabase
            .from('user_completed_challenges')
            .insert({
              user_id: user.id,
              challenge_id: challenge.id,
            })

          if (insertError) {
            console.error('Error marking challenge as completed:', insertError)
          } else {
            console.log('Challenge marked as completed')
          }
        }

        // Optionally show the solution or redirect
        setShowSolution(true)
      }
    } catch (error) {
      console.error('Error submitting solution:', error)
      toast({
        title: 'Error',
        description: 'Failed to submit solution. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  if (!challenge) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Challenge not found</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center mb-4">
          <Button variant="outline" onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-8rem)]">
          {/* Left column - Challenge description */}
          <div className="flex flex-col h-full">
            <Card className="flex-1 overflow-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">{challenge.title}</CardTitle>
                  <div className="flex gap-2">
                    <Badge className={difficultyColors[challenge.difficulty]}>
                      {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                    </Badge>
                    <Badge variant="secondary">{challenge.jezyk_pro}</Badge>
                    <Badge variant="secondary">{challenge.topic_pro}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none">
                  <p>{challenge.description}</p>
                </div>
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">Solution</h3>
                    <Button
                      variant="outline"
                      onClick={() => setShowSolution(!showSolution)}
                    >
                      {showSolution ? 'Hide Solution' : 'Show Solution'}
                    </Button>
                  </div>
                  <div className={`relative ${showSolution ? '' : 'blur-sm'}`}>
                    <pre className="p-4 bg-muted rounded-lg">
                      <code>{challenge.solution}</code>
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column - Code editor */}
          <div className="flex flex-col h-full">
            <Card className="flex-1 flex flex-col">
              <CardHeader className="flex-none">
                <CardTitle>Code Editor</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <CodeEditor
                  language={challenge.jezyk_pro}
                  code={code}
                  onChange={setCode}
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
} 