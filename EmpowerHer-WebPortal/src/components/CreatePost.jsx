import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { db } from '../config/firebase.config'; // Ensure you have initialized Firebase
import { collection, setDoc, doc, Timestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid'; // Import UUID for generating unique post IDs

const CreatePost = () => {
  const userUID = useSelector((state) => state.auth.uid); // Get the user UID from Redux store
  const [category, setCategory] = useState('');
  const [desc, setDesc] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userUID || !title || !desc) {
      alert("Title, description, and user UID are required.");
      return;
    }

    setLoading(true);
    try {
      const postId = uuidv4(); // Generate a unique post ID
      const postRef = doc(db, 'communityPost', postId);

      const postData = {
        postId,
        category,
        desc,
        likeCount: "0",  
        photoUrl,
        postedBy: doc(db, 'portalUsers', userUID), 
        postedOn: Timestamp.now(), 
        title,
        uid: userUID 
      };

      // Store the post in Firestore
      await setDoc(postRef, postData);

      console.log("Post created successfully!");
    } catch (error) {
      console.error("Error creating post: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-purple-200 shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-purple-800 mb-6 text-center">Create a New Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post Title"
          required
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Post Description"
          required
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="text"
          value={photoUrl}
          onChange={(e) => setPhotoUrl(e.target.value)}
          placeholder="Photo URL (Optional)"
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="Tech">Tech</option>
          <option value="Health">Health</option>
          <option value="Education">Education</option>
          <option value="Career">Career</option>
        </select>
        <button
          type="submit"
          disabled={loading}
          className="w-full p-4 bg-purple-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200 transform hover:bg-purple-700 disabled:bg-purple-300"
        >
          {loading ?
           'Creating...' 
           : 
           'Create Post'
           }
        </button>
        
      </form>
    </div>
  );
};

export default CreatePost;
