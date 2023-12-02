import { IPost } from "../Post";
import { IUser } from "../User";

export type TComment = {
  comments: [
    {
      postId: IPost["_id"];
      author: {
        authorId: IUser["_id"];
        userName: IUser["userName"];
        avatar: IUser["avatar"];
      };
      description: string;
      comment_like_count: string[];
      comment_reply: [
        {
          referenced_comment: string;
          user: {
            userId: IUser["_id"];
            userName: IUser["userName"];
            avatar: IUser["avatar"];
          };
          description: string;
          reply_like_count: number;
          createdAt: Date,
          updatedAt: string,
        }
      ];
    }
  ];
};
