import { CommentType } from "../types/comment";

export function findCommentById(
  comments: CommentType[],
  id: string
): CommentType | null {
  for (const comment of comments) {
    if (comment._id === id) return comment;
    const found = findCommentById(comment.replies, id);
    if (found) return found;
  }
  return null;
}
