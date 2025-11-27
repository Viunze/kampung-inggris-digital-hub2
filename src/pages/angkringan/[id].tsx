import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { usePostDetail } from '@/hooks/usePostDetail'; // Asumsi hook ini ada
import { deleteDocument } from '@/lib/firebase'; // Pastikan fungsi ini diekspor
import { ForumPost } from '@/types/forum'; 
import { Timestamp } from 'firebase/firestore'; 

const PostDetailPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const postId = typeof id === 'string' ? id : null;
    
    const { user, loading: authLoading } = useAuth();
    // Asumsi usePostDetail(postId) mengembalikan { post, loading, error }
    const { post, loading: postLoading, error: postError } = usePostDetail(postId);
    
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    // --- Perbaikan Syntax Error ada di sini ---
    const deletePostHandler = useCallback(async () => {
        if (!user || !postId || isDeleting || post?.authorId !== user.uid) {
            // Pengguna tidak berhak menghapus atau post/ID tidak ada
            return;
        }

        if (!window.confirm("Apakah Anda yakin ingin menghapus postingan ini?")) {
            return;
        }

        setIsDeleting(true);
        setDeleteError(null);

        try {
            // ✅ PERBAIKAN: Melengkapi panggilan fungsi deleteDocument
            // ASUMSI: deleteDocument(collectionName: string, docId: string)
            await deleteDocument('forumPosts', postId); 

            // Redirect setelah sukses
            router.push('/angkringan');
            
        } catch (error: any) {
            console.error("Error deleting document:", error);
            setDeleteError("Gagal menghapus postingan: " + error.message);
        } finally {
            setIsDeleting(false);
        }
    }, [user, postId, isDeleting, post?.authorId, router]);

    // --- Loading dan Error State ---

    if (authLoading || postLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p>Memuat Post...</p>
            </div>
        );
    }

    if (postError || !post) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen">
                <p className="text-red-500">Postingan tidak ditemukan atau terjadi error.</p>
                <button 
                    onClick={() => router.push('/angkringan')} 
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                    Kembali ke Angkringan
                </button>
            </div>
        );
    }
    
    const isAuthor = user?.uid === post.authorId;
    const formattedDate = post.timestamp instanceof Timestamp 
                          ? post.timestamp.toDate().toLocaleString()
                          : 'Tanggal tidak tersedia';

    // --- Rendering Detail Post ---
    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <button 
                onClick={() => router.push('/angkringan')} 
                className="text-indigo-600 mb-4 hover:underline"
            >
                &larr; Kembali ke Angkringan
            </button>

            <div className="bg-white p-6 shadow-xl rounded-lg border border-gray-100">
                
                {/* Header Post */}
                <div className="flex items-start justify-between border-b pb-4 mb-4">
                    <div className="flex items-center">
                        <img
                            src={post.authorPhotoUrl || '/default-avatar.png'}
                            alt={post.authorName}
                            className="w-12 h-12 rounded-full mr-4"
                        />
                        <div>
                            <p className="text-xl font-bold">{post.authorName}</p>
                            <p className="text-sm text-gray-500">Diposting pada: {formattedDate}</p>
                        </div>
                    </div>
                    
                    {/* Tombol Aksi */}
                    {isAuthor && (
                        <button
                            onClick={deletePostHandler}
                            className={`px-3 py-1 text-sm rounded transition duration-200 ${
                                isDeleting 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-red-500 text-white hover:bg-red-600'
                            }`}
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Menghapus...' : 'Hapus Post'}
                        </button>
                    )}
                </div>

                {/* Konten Post */}
                <div className="mb-6">
                    <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
                </div>

                {/* Feedback dan Statistik */}
                <div className="flex space-x-6 text-gray-600 text-sm border-t pt-4">
                    <span className="flex items-center">
                        <span className="mr-1">❤️</span> {post.likesCount} Suka
                    </span>
                    <span className="flex items-center">
                        <span className="mr-1">💬</span> {post.repliesCount} Komentar
                    </span>
                    {deleteError && (
                        <p className="text-red-500 text-sm ml-auto">⚠️ {deleteError}</p>
                    )}
                </div>
            </div>

            {/* Area Komentar/Reply bisa ditambahkan di sini */}
            <h2 className="text-2xl font-bold mt-8 mb-4">Komentar (Belum Diimplementasikan)</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-500">Fungsi komentar akan ditambahkan di fase selanjutnya.</p>
            </div>
            
        </div>
    );
};

export default PostDetailPage;
