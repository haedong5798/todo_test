'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

export default function Board() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
  });
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    if (session) {
      fetchPosts();
    }
  }, [session]);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/board');
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) return;

    try {
      const response = await fetch('/api/board', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      });

      if (response.ok) {
        const post = await response.json();
        setPosts([post, ...posts]);
        setNewPost({ title: '', content: '' });
      }
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };

  const deletePost = async (id: string) => {
    try {
      const response = await fetch(`/api/board?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPosts(posts.filter((post) => post.id !== id));
        if (selectedPost?.id === id) {
          setSelectedPost(null);
        }
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  if (!session) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please sign in to view the board.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Bulletin Board</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="p-4 bg-white rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedPost(post)}
              >
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <p className="text-gray-600 text-sm mb-2">
                  By {post.author} on{' '}
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-700 line-clamp-2">{post.content}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <form onSubmit={addPost} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Post title"
                value={newPost.title}
                onChange={(e) =>
                  setNewPost({ ...newPost, title: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <textarea
                placeholder="Post content"
                value={newPost.content}
                onChange={(e) =>
                  setNewPost({ ...newPost, content: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Post
            </button>
          </form>

          {selectedPost && (
            <div className="p-4 bg-white rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-2">{selectedPost.title}</h2>
              <p className="text-gray-600 text-sm mb-4">
                By {selectedPost.author} on{' '}
                {new Date(selectedPost.createdAt).toLocaleDateString()}
              </p>
              <p className="text-gray-700 mb-4">{selectedPost.content}</p>
              <button
                onClick={() => deletePost(selectedPost.id)}
                className="text-red-500 hover:text-red-600"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 