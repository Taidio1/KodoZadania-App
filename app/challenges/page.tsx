import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { ChallengeList } from '@/components/challenges/challenge-list'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function ChallengesPage() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return null // Middleware will handle the redirect
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Python Challenges</h1>
          <Button asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
        
        <div className="grid gap-4">
          <ChallengeList />
        </div>
      </div>
    </main>
  )
}
