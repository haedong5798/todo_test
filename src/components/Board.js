import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Board() {
  const [posts, setPosts] = useState([])
  const [newPost, setNewPost] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Get current user
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getCurrentUser()

    // Fetch posts
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching posts:', error)
      return
    }

    setPosts(data || [])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newPost.trim()) return

    const { error } = await supabase
      .from('posts')
      .insert([
        {
          content: newPost,
          user_id: user.id,
          user_email: user.email
        }
      ])

    if (error) {
      console.error('Error creating post:', error)
      return
    }

    setNewPost('')
    fetchPosts()
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">게시판</h1>
      
      {/* Post creation form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="새 게시글을 작성하세요..."
          className="w-full p-4 border rounded-lg mb-4"
          rows="4"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          게시글 작성
        </button>
      </form>

      {/* Posts list */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <span className="font-semibold">{post.user_email}</span>
              <span className="text-gray-500 text-sm">
                {new Date(post.created_at).toLocaleString()}
              </span>
            </div>
            <p className="text-gray-700">{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
} 