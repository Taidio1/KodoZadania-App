import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

export async function POST(request: Request) {
  try {
    const { code, challengeId } = await request.json()
    const supabase = createRouteHandlerClient({ cookies })

    // Get the challenge details
    const { data: challenge, error: challengeError } = await supabase
      .from('challenges')
      .select('*')
      .eq('id', challengeId)
      .single()

    if (challengeError) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 })
    }

    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Create a new attempt
    const { data: attempt, error: attemptError } = await supabase
      .from('challenge_attempts')
      .insert({
        user_id: user.id,
        challenge_id: challengeId,
        code: code,
        status: 'in_progress'
      })
      .select()
      .single()

    if (attemptError) {
      return NextResponse.json({ error: 'Failed to create attempt' }, { status: 500 })
    }

    // TODO: Implement actual code execution and testing
    // For now, we'll just compare with the solution
    const isCorrect = code.trim() === challenge.solution.trim()

    // Update the attempt status
    await supabase
      .from('challenge_attempts')
      .update({
        status: isCorrect ? 'success' : 'failed'
      })
      .eq('id', attempt.id)

    return NextResponse.json({
      success: isCorrect,
      message: isCorrect ? 'Solution is correct!' : 'Solution is incorrect. Try again!'
    })
  } catch (error) {
    console.error('Error running code:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 