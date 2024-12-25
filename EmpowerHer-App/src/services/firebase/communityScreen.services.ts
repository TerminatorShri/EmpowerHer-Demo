import axios from "axios";
import { firestore } from "../../config/firebase.config";
import { collection, getDocs } from "firebase/firestore";
import { LikeResponse, CommentResponse, PostType } from "../../types/types";

export const likePost = async (
  postId: string,
  userId: string
): Promise<LikeResponse> => {
  const response = await axios.post(`/api/posts/${postId}/like`, { userId });
  return response.data;
};

export const commentOnPost = async (
  postId: string,
  userId: string,
  comment: string
): Promise<CommentResponse> => {
  const response = await axios.post(`/api/posts/${postId}/comment`, {
    userId,
    comment,
  });
  return response.data;
};

export const getAllPosts = async (): Promise<PostType[]> => {
  const collectionRef = collection(firestore, "communityPost");
  const response = await getDocs(collectionRef);

  return response.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      postedBy: data.postedBy || "",
      title: data.title || "",
      desc: data.desc || "",
      category: data.category || "",
      photoUrl: data.photoUrl || "",
    };
  });
};
