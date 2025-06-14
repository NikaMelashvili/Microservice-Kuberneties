export type User = {
  _id?: string;
  username: string;
  email: string;
  password?: string;
};

export type Comment = {
  id: number;
  author: string;
  content: string;
  date: string | null;
  postId: number;
};

export type Post = {
  id: number;
  username: string;
  content: string;
  description: string;
  image_url: string;
  created_at: string;
  comments: Comment[];
};
