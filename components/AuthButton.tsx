'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AuthButton() {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
            setLoading(false)
        }

        getUser()
    }, [])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    if (loading) {
        return null
    }

    if (!user) {
        return null
    }

    return (
        <div className="flex items-center gap-4">
            <span className="text-white/80 text-sm">
                {user.email}
            </span>
            <button
                onClick={handleSignOut}
                className="btn-secondary"
            >
                Sign Out
            </button>
        </div>
    )
}
