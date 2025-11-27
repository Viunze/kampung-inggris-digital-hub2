import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { useForumPosts } from '@/hooks/useForumPosts'; // Asumsi hook ini ada
import { addDocument } from '@/lib/firebase'; // Asumsi fungsi ini ada
import { ForumPost } from '@/types/forum'; // Asumsi interface ini ada

// Anggap interface ForumPost memiliki id: string | FieldValue

const Angkringan = () => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { posts, loading: postsLoading, error: postsError } = useForumPosts();
  const [newPostContent, setNewPostContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Redirect jika user tidak login dan auth tidak sedang loading
    if (!user && !authLoading) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleSubmitPost = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newPostContent.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const newPost: Omit<ForumPost, 'id' | 'timestamp'> = {
        content: newPostContent.trim(),
        authorId: user.uid,
        authorName: user.displayName || 'Anonim',
        authorPhotoUrl: user.photoURL || undefined,
        likesCount: 0,
        likedBy: [],
        repliesCount: 0,
        // ID dan Timestamp akan ditambahkan oleh Firestore/fungsi addDocument
      };

      // ✅ PERBAIKAN: Menggunakan Omit<ForumPost, 'id'>
      // Ini memberi tahu TypeScript bahwa kita mengirim ForumPost TANPA properti 'id'.
      // Ini memperbaiki Type error: Property 'id' is missing
      await addDocument<Omit<ForumPost, 'id'>>('forumPosts', {
        ...newPost,
        timestamp: new Date(), // Menggunakan Date object, bukan 'as any'
      });

      setNewPostContent('');
      // Anda mungkin perlu me-refresh posts di hook useForumPosts
    } catch (err: any) {
      console.error("Error adding forum post:", err);
      // Di sini kita bisa menambahkan notifikasi error ke user
    } finally {
      setIsSubmitting(false);
    }
  }, [user, newPostContent, isSubmitting]);

  if (authLoading || postsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Memuat...</p>
      </div>
    );
  }

  if (postsError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">Error memuat post: {postsError.message}</p>
      </div>
    );
  }

  // --- Rendering UI ---
  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Angkringan Diskusi</h1>

      {/* Form Post Baru */}
      <form onSubmit={handleSubmitPost} className="bg-white p-4 shadow-md rounded-lg mb-8">
        <textarea
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          rows={3}
          placeholder="Apa yang ada di pikiranmu?"
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          disabled={isSubmitting}
        />
        <button
          type="submit"
          className={`mt-3 px-4 py-2 rounded-lg text-white font-semibold transition duration-200 ${
            !user || newPostContent.trim() === '' || isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
          disabled={!user || newPostContent.trim() === '' || isSubmitting}
        >
          {isSubmitting ? 'Mengirim...' : 'Kirim Post'}
        </button>
      </form>

      {/* Daftar Post */}
      <div className="space-y-4">
        {posts?.length === 0 ? (
          <p className="text-gray-500">Belum ada postingan. Jadilah yang pertama!</p>
        ) : (
          posts?.map((post) => (
            <div key={post.id} className="bg-white p-4 shadow rounded-lg">
              <div className="flex items-center mb-2">
                <img
                  src={post.authorPhotoUrl || '/default-avatar.png'}
                  alt={post.authorName}
                  className="w-8 h-8 rounded-full mr-3"
                />
                <div>
                  <p className="font-semibold">{post.authorName}</p>
                  <p className="text-xs text-gray-500">
                    {post.timestamp ? new Date(post.timestamp).toLocaleString() : 'Baru saja'}
                  </p>
                </div>
              </div>
              <p className="text-gray-700">{post.content}</p>
              <div className="mt-3 flex space-x-4 text-sm text-gray-500">
                <span>❤️ {post.likesCount} Suka</span>
                <span>💬 {post.repliesCount} Komentar</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Angkringan;
