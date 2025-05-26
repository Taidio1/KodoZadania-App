'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// We will add charting library imports later

interface ReadDefinition {
  read_at: string | null;
  definitions: { // Joined data from definitions table
    language: string
    title: string
  }[] | null; // Supabase returns an array of joined data, or null
}

interface CompletedChallenge {
  completed_at: string | null;
  challenges: { // Joined data from challenges table
    jezyk_pro: string
    title: string
  }[] | null; // Supabase returns an array of joined data, or null
}

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [readDefinitions, setReadDefinitions] = useState<ReadDefinition[]>([])
  const [completedChallenges, setCompletedChallenges] = useState<CompletedChallenge[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        // Fetch read definitions for the user
        const { data: readData, error: readError } = await supabase
          .from('user_read_definitions')
          .select(
            `
            read_at,
            definitions (
              language,
              title
            )
            `
          )
          .eq('user_id', user.id)

        if (readError) {
          console.error('Error fetching read definitions:', readError)
        } else {
          setReadDefinitions(readData || [])
        }

        // Fetch completed challenges for the user
        const { data: completedData, error: completedError } = await supabase
          .from('user_completed_challenges')
          .select(
            `
            completed_at,
            challenges (
              jezyk_pro,
              title
            )
            `
          )
          .eq('user_id', user.id)

        if (completedError) {
          console.error('Error fetching completed challenges:', completedError)
        } else {
          setCompletedChallenges(completedData || [])
        }
      }

      setLoading(false)
    }

    fetchData()
  }, [supabase])

  // --- Data Processing for Stats ---
  const definitionStats = readDefinitions.reduce((acc, item) => {
    // Group by date (YYYY-MM-DD) from the main item object
    const date = item.read_at ? new Date(item.read_at).toISOString().split('T')[0] : 'Unknown Date';
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const challengeStats = completedChallenges.reduce((acc, item) => {
    // Group by date (YYYY-MM-DD) from the main item object
    const date = item.completed_at ? new Date(item.completed_at).toISOString().split('T')[0] : 'Unknown Date';
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Format data for charts (example: array of objects)
  const definitionChartData = Object.keys(definitionStats).map(date => ({
    date: date,
    count: definitionStats[date],
  }));

  const challengeChartData = Object.keys(challengeStats).map(lang => ({
    date: lang, // This 'lang' variable is actually the date key from reduce
    count: challengeStats[lang],
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading profile data...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Please log in to view your profile.</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Profil Użytkownika: {user.email}</h1>

        {/* Definitions Stats */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Statystyki Definicji (Przeczytane)</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Chart for Definitions will go here */}
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={definitionChartData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  {/* <CartesianGrid strokeDasharray="3 3" /> */}
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Separator className="my-6" />

        {/* Challenges Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Statystyki Zadań (Ukończone)</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Chart for Challenges will go here */}
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={challengeChartData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  {/* <CartesianGrid strokeDasharray="3 3" /> */}
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

      </div>
    </main>
  )
} 