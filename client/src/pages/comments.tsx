import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThumbsUp, Reply, ChevronDown, ChevronUp, AlertTriangle, ShieldAlert, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import type { Comment, InsertComment } from "@shared/schema";
import { cn } from "@/lib/utils"; // Using cn instead of classnames

const ModerationIndicator = ({ status, flags }: { status: string, flags: string[] | null }) => {
  switch (status) {
    case 'approved':
      return <Shield className="h-4 w-4 text-green-500" aria-label="Approved" />;
    case 'pending':
      return <Shield className="h-4 w-4 text-yellow-500 animate-pulse" aria-label="Pending Review" />;
    case 'flagged':
      return (
        <div className="flex items-center gap-1">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          <span className="text-xs text-muted-foreground">Under Review</span>
        </div>
      );
    case 'rejected':
      return (
        <div className="flex items-center gap-1">
          <ShieldAlert className="h-4 w-4 text-red-500" />
          <span className="text-xs text-muted-foreground">Content Hidden</span>
        </div>
      );
    default:
      return null;
  }
};

const CommentSection = () => {
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [expandedComments, setExpandedComments] = useState<number[]>([]);
  const { toast } = useToast();

  const { data: comments, isLoading } = useQuery<Comment[]>({
    queryKey: ["/api/comments"],
  });

  const createCommentMutation = useMutation({
    mutationFn: async (comment: InsertComment) => {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(comment),
      });
      if (!res.ok) throw new Error("Failed to create comment");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/comments"] });
      setNewComment("");
      toast({
        title: "Comment posted",
        description: "Your comment has been submitted for moderation.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const likeCommentMutation = useMutation({
    mutationFn: async (commentId: number) => {
      const res = await fetch(`/api/comments/${commentId}/like`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to like comment");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/comments"] });
    },
  });

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    createCommentMutation.mutate({
      content: newComment,
      userId: 1, // This will be replaced with actual user ID once auth is implemented
      parentId: null
    });
  };

  const handleSubmitReply = (parentId: number) => {
    if (!replyText.trim()) return;
    createCommentMutation.mutate({
      content: replyText,
      userId: 1, // This will be replaced with actual user ID once auth is implemented
      parentId
    });
    setReplyingTo(null);
    setReplyText("");
  };

  const toggleReplies = (commentId: number) => {
    setExpandedComments(prev =>
      prev.includes(commentId)
        ? prev.filter(id => id !== commentId)
        : [...prev, commentId]
    );
  };

  const renderComment = (comment: Comment, isReply = false) => {
    const replies = comments?.filter(c => c.parentId === comment.id) || [];
    const isExpanded = expandedComments.includes(comment.id);

    if (comment.moderationStatus === 'rejected') {
      return (
        <Card key={comment.id} className={cn("p-4 mb-4", isReply && "ml-8")}>
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-red-500" />
            <p className="text-sm text-muted-foreground">This comment has been removed.</p>
          </div>
        </Card>
      );
    }

    return (
      <Card key={comment.id} className={cn("p-4 mb-4", isReply && "ml-8")}>
        <div className="flex items-start gap-4">
          <Avatar>
            <AvatarFallback>UN</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold">User {comment.userId}</span>
              <span className="text-xs text-muted-foreground">
                {new Date(comment.createdAt!).toLocaleString()}
              </span>
              <ModerationIndicator 
                status={comment.moderationStatus} 
                flags={comment.moderationFlags} 
              />
            </div>
            {comment.moderationStatus === 'flagged' ? (
              <div className="bg-yellow-500/10 p-2 rounded-md mb-2">
                <p className="text-sm text-yellow-500">
                  This comment is under review. It may contain sensitive content.
                </p>
                <details className="mt-2">
                  <summary className="text-sm text-muted-foreground cursor-pointer">View anyway</summary>
                  <p className="mt-2 text-sm">{comment.content}</p>
                </details>
              </div>
            ) : (
              <p className="text-sm mb-4">{comment.content}</p>
            )}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary"
                onClick={() => likeCommentMutation.mutate(comment.id)}
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                {comment.likes}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary"
                onClick={() => setReplyingTo(comment.id)}
              >
                <Reply className="h-4 w-4 mr-2" />
                Reply
              </Button>
              {replies.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-primary"
                  onClick={() => toggleReplies(comment.id)}
                >
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 mr-2" />
                  ) : (
                    <ChevronDown className="h-4 w-4 mr-2" />
                  )}
                  {replies.length} {replies.length === 1 ? "reply" : "replies"}
                </Button>
              )}
            </div>
            {replyingTo === comment.id && (
              <div className="mt-4">
                <Textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="mb-2"
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyText("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => handleSubmitReply(comment.id)}>
                    Reply
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        {isExpanded && replies.length > 0 && (
          <div className="mt-4">
            {replies.map(reply => renderComment(reply, true))}
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="min-h-screen pb-20 bg-background">
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-8">Community Discussion</h1>

        {/* New Comment Input */}
        <Card className="p-4 mb-8">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="mb-4"
          />
          <div className="flex justify-end">
            <Button onClick={handleSubmitComment}>
              Post Comment
            </Button>
          </div>
        </Card>

        {/* Comments List */}
        {isLoading ? (
          <div>Loading comments...</div>
        ) : (
          <div>
            {comments
              ?.filter(comment => !comment.parentId)
              .map(comment => renderComment(comment))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;