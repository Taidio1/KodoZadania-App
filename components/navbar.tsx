'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { supabase } from '@/lib/supabase'
import router from 'next/router'

const handleSignOut = async () => {
  await supabase.auth.signOut()
  router.push('/')
}

export function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4 bg-background border-b">
      <div className="flex items-center space-x-4">
        <Link href="/" className="text-lg font-semibold">
          KodoZadania-App
        </Link>
        <Link href="/definicje" passHref legacyBehavior>
          <Button variant="ghost">Definicje</Button>
        </Link>
        <Link href="/challenges" passHref legacyBehavior>
          <Button variant="ghost">Zadania</Button>
        </Link>
        <Link href="/profil" passHref legacyBehavior>
          <Button variant="ghost">Profil</Button>
        </Link>
      </div>
      <div>
      
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
        </div>
      </div>
    </nav>
  )
} 