'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Definition {
  id: string
  title: string
  language: string
  difficulty: string | null
  is_read: boolean
}

// Static list of common languages for the filter (temporary workaround)
const STATIC_LANGUAGES = ['All', 'python', 'javascript', 'csharp', 'typescript', 'html', 'css'];

export default function DefinitionsPage() {
  const [definitions, setDefinitions] = useState<Definition[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()
  const [user, setUser] = useState<any>(null)
  const [selectedLanguage, setSelectedLanguage] = useState('All')
  const [readStatusFilter, setReadStatusFilter] = useState('All')

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await (supabase as any).auth.getUser()
      setUser(user)
    }
    fetchUser()
  }, [supabase])

  useEffect(() => {
    const fetchDefinitions = async () => {
      setLoading(true)
      let query = supabase.from('definitions').select(
        `
        id,
        title,
        language,
        difficulty,
        user_read_definitions(definition_id)
        `
      );

      if (selectedLanguage !== 'All') {
        query = (query as any).eq('language', selectedLanguage);
      }

      const fetchAndFilter = async () => {
         try {
           const { data, error } = await (query as any);

           if (error) throw error;

           const processedData = data.map((item: any) => ({
             id: item.id,
             title: item.title,
             language: item.language,
             difficulty: item.difficulty,
             is_read: (item.user_read_definitions as any[]).length > 0,
           }));

           const filteredData = processedData.filter((item: any) => {
              if (readStatusFilter === 'Read') return item.is_read;
              if (readStatusFilter === 'Unread') return !item.is_read;
              return true; // 'All' status
           });

           setDefinitions(filteredData);

         } catch (error) {
           console.error('Error fetching definitions with filters:', error);
           setDefinitions([]); // Clear definitions on error
         } finally {
           setLoading(false);
         }
      };

      fetchAndFilter();

    };

    fetchDefinitions();

  }, [supabase, user, selectedLanguage, readStatusFilter]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><p>Loading definitions...</p></div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Definicje</h1>
      <div className="flex space-x-4 mb-6">
        <div className="flex items-center space-x-2">
          <label htmlFor="language-filter" className="text-sm font-medium">Język:</label>
          <Select onValueChange={setSelectedLanguage} defaultValue="All">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Wybierz język" />
            </SelectTrigger>
            <SelectContent>
              {STATIC_LANGUAGES.map(lang => (
                <SelectItem key={lang} value={lang}>{lang}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <label htmlFor="status-filter" className="text-sm font-medium">Status:</label>
          <Select onValueChange={setReadStatusFilter} defaultValue="All">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Wybierz status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">Wszystkie</SelectItem>
              <SelectItem value="Read">Przeczytane</SelectItem>
              <SelectItem value="Unread">Nieprzeczytane</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tytuł</TableHead>
            <TableHead>Język Programowania</TableHead>
            <TableHead>Poziom Zaawansowania</TableHead>
            <TableHead>Status (Przeczytane)</TableHead>
            <TableHead>Akcje</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {definitions.map((definition) => (
            <TableRow key={definition.id}>
              <TableCell className="font-medium">{definition.title}</TableCell>
              <TableCell>{definition.language}</TableCell>
              <TableCell>{definition.difficulty || 'N/A'}</TableCell>
              <TableCell>{definition.is_read ? 'Tak' : 'Nie'}</TableCell>
              <TableCell>
                <Link href={`/definicje/${definition.id}`} passHref legacyBehavior>
                  <Button variant="outline" size="sm">Sprawdź</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 