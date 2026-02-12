'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface AddBookmarkFormProps {
    onBookmarkAdded: () => void
}

export default function AddBookmarkForm({ onBookmarkAdded }: AddBookmarkFormProps) {
    const [url, setUrl] = useState('')
    const [title, setTitle] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        // Validate URL
        try {
            new URL(url)
        } catch {
            setError('Please enter a valid URL')
            return
        }

        if (!title.trim()) {
            setError('Please enter a title')
            return
        }

        setLoading(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                setError('You must be logged in')
                return
            }

            const { error: insertError } = await supabase
                .from('bookmarks')
                .insert([
                    {
                        user_id: user.id,
                        url: url,
                        title: title,
                    },
                ])

            if (insertError) throw insertError

            // Clear form
            setUrl('')
            setTitle('')
            onBookmarkAdded()
        } catch (err: any) {
            setError(err.message || 'Failed to add bookmark')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="glass-card p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">Add New Bookmark</h2>

            {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <label htmlFor="url" className="block text-sm font-medium text-white/80 mb-2">
                        URL
                    </label>
                    <input
                        id="url"
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com"
                        className="input-field"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-white/80 mb-2">
                        Title
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="My Awesome Website"
                        className="input-field"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Adding...' : 'Add Bookmark'}
                </button>
            </div>
        </form>
    )
}
