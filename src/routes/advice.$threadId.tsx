import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Avatar } from "@/components/Avatar";
import { adviceThreads } from "@/data/mock";
import { useApp } from "@/store/app";
import { ArrowUp, MessageCircle, User } from "lucide-react";
import { useMemo } from "react";

export const Route = createFileRoute("/advice/$threadId")({
  head: () => ({ meta: [{ title: "Advice Thread — Orbit" }] }),
  component: AdviceThreadPage,
});

function AdviceThreadPage() {
  const { threadId } = useParams({ from: "/advice/$threadId" });
  const userPosts = useApp((s) => s.advicePosts);
  
  const allThreads = useMemo(() => {
    return [...userPosts.map((p) => ({ ...p, isNew: true })), ...adviceThreads];
  }, [userPosts]);

  const thread = allThreads.find((t) => t.id === threadId);

  if (!thread) {
    return (
      <div>
        <ScreenHeader title="Thread" back="/discover" />
        <p className="px-5 text-sm text-muted-foreground">
          Thread not found. <Link to="/discover" className="text-primary underline">Back to Discover</Link>
        </p>
      </div>
    );
  }

  // Sample answers for the thread
  const sampleAnswers = [
    {
      id: "ans1",
      author: "Anonymous '26",
      text: "Great question! From my experience, I'd recommend starting early and talking to upperclassmen who've been through it.",
      upvotes: 12,
      time: "2 days ago",
    },
    {
      id: "ans2", 
      author: "Current Junior",
      text: "I had the same question when I was in your shoes. The key is to be proactive and reach out to the right people.",
      upvotes: 8,
      time: "1 day ago",
    },
  ];

  const gradients = [
    "linear-gradient(135deg, #2B3A8C, #F5A623)",
    "linear-gradient(135deg, #7B4FCF, #C24E7C)",
  ];

  return (
    <div>
      <ScreenHeader title="Thread" back="/discover" />
      <div className="px-5 pb-10">
        {/* Thread header */}
        <div className="rounded-2xl bg-card p-4">
          <span className="text-[10px] rounded-full bg-primary/10 text-primary px-2.5 py-1 font-semibold">
            {thread.tag}
          </span>
          <h1 className="mt-3 text-lg font-bold text-primary leading-snug">{thread.title}</h1>
          <p className="mt-2 text-xs text-muted-foreground">
            answered by {thread.answeredBy}
          </p>
          <div className="mt-3 flex items-center gap-4 text-sm">
            <span className="inline-flex items-center gap-1 text-primary">
              <ArrowUp size={14} /> <b>{thread.upvotes}</b> upvotes
            </span>
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <MessageCircle size={14} /> {thread.answers} answers
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-2xl bg-card p-3 text-center">
            <ArrowUp size={14} className="mx-auto text-muted-foreground" />
            <p className="text-sm font-bold text-primary mt-1">{thread.upvotes}</p>
            <p className="text-[10px] text-muted-foreground uppercase">Upvotes</p>
          </div>
          <div className="rounded-2xl bg-card p-3 text-center">
            <MessageCircle size={14} className="mx-auto text-muted-foreground" />
            <p className="text-sm font-bold text-primary mt-1">{thread.answers}</p>
            <p className="text-[10px] text-muted-foreground uppercase">Answers</p>
          </div>
          <div className="rounded-2xl bg-card p-3 text-center">
            <User size={14} className="mx-auto text-muted-foreground" />
            <p className="text-sm font-bold text-primary mt-1">{thread.answeredBy}</p>
            <p className="text-[10px] text-muted-foreground uppercase">Top answer</p>
          </div>
        </div>

        {/* Answers */}
        <h3 className="mt-6 text-primary font-semibold text-sm">Top Answers</h3>
        <div className="mt-3 space-y-3">
          {sampleAnswers.map((ans, i) => (
            <div key={ans.id} className="rounded-2xl bg-card p-4">
              <div className="flex items-center gap-2">
                <Avatar seed={ans.author} size={32} />
                <div>
                  <p className="text-xs font-bold text-primary">{ans.author}</p>
                  <p className="text-[10px] text-muted-foreground">{ans.time}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-primary/90 leading-relaxed">{ans.text}</p>
              <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                <ArrowUp size={12} />
                <span>{ans.upvotes} upvotes</span>
              </div>
            </div>
          ))}
        </div>

        {/* Add answer button */}
        <button className="mt-6 w-full rounded-full bg-primary text-primary-foreground py-3 text-sm font-bold">
          Add Your Answer
        </button>
      </div>
    </div>
  );
}
