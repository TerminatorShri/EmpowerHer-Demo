import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { db } from '../config/firebase.config';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'; // Import the trash icon

const Post = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const userUID = useSelector((state) => state.auth.uid);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        if (userUID) {
          // Create a query to fetch posts where uid matches the logged-in user's UID
          const postsRef = collection(db, 'communityPost');
          const userPostsQuery = query(postsRef, where('uid', '==', userUID));
          const querySnapshot = await getDocs(userPostsQuery);

          const userPosts = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));
          setPosts(userPosts);
        } else {
          console.log("User UID not available in the Redux store.");
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userUID]);

  const deletePost = async (postId) => {
    const result = window.confirm("Do you want to proceed? This action is irreversible.");
    if (result) {
      try {
        // Get the post reference
        const postRef = doc(db, 'communityPost', postId);
        
        // Delete the post from Firestore
        await deleteDoc(postRef);
        console.log('Post deleted successfully');
        
        // Remove the deleted post from the state
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    } else {
      console.log("User canceled the deletion.");
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      {loading ? (
        <p className="text-center text-lg text-purple-600">Loading posts...</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="p-6 my-4 border border-gray-300 rounded-lg bg-white shadow-lg hover:shadow-xl transition-all duration-300 relative">
          <h2 className="font-semibold text-2xl text-purple-800 mb-2">{post.title}</h2>
          <p className="text-lg text-gray-700 mb-4">{post.desc}</p>
        
          {post.photoUrl && (
            <img src={post.photoUrl} alt="Post" className="w-full h-60 object-cover rounded-lg mb-4" />
          )}
        
          <div className="flex justify-between text-sm text-gray-500">
            <p className="italic">Category: {post.category}</p>
            <p className="font-medium">Likes: {post.likeCount}</p>
          </div>
        
          {/* Right-aligned delete icon */}
          <div className="absolute top-9 right-5">
            <FontAwesomeIcon
              onClick={() => deletePost(post.id)}
              icon={faTrashAlt}
              className="text-purple-500 text-2xl cursor-pointer hover:text-purple-700 transition-all duration-200"
            />
          </div>
        </div>
        
        ))
      )}
    </div>
  );
};

export default Post;
