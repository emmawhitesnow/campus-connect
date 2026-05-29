import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useApp } from "@/store/app";
import { adviceThreads } from "@/data/mock";
import { ArrowUp, MessageCircle, Bookmark } from "lucide-react";
import { Avatar } from "@/components/Avatar";

export const Route = createFileRoute("/advice/$adviceId")({
  head: () => ({ meta: [{ title: "Advice — Orbit" }] }),
  component: AdviceDetailPage,
});

const MOCK_REPLIES: Record<string, { id: string; author: string; text: string; upvotes: number }[]> = {
  default: [
    { id: "r1", author: "Maya '26", text: "Honestly the best decision I made was talking to upperclassmen first. They have the real scoop.", upvotes: 18 },
    { id: "r2", author: "Ben '27", text: "Same answer as everyone else — go to the info session, decide after.", upvotes: 7 },
    { id: "r3", author: "Sofia '26", text: "DM me if you want to chat about specifics. Happy to help!", upvotes: 4 },
  ],
};

function AdviceDetailPage() {
  const { adviceId } = useParams({ from: "/advice/$adviceId" });
  const navigate = useNavigate();
  const storePosts = useApp((s) => s.advicePosts);

  const post = storePosts.find((p) => p.id === adviceId) ?? adviceThreads.find((a) => a.id === adviceId);
  if (!post) {
    return (
      <div>
        <ScreenHeader title="Question" back="/discover" />
        <p className="px-5 text-sm text-muted-foreground">Post not found.</p>
      </div>
    );
  }

  const replies = MOCK_REPLIES.default;
  const body = "body" in post && post.body ? post.body : "Curious how others have approached this — would love any tips, gotchas, or just hot takes.";

  return (
    <div>
      <ScreenHeader title="Question" back="/discover" right={<Bookmark size={18} className="text-primary" />} />
      <div className="px-5 pb-10">
        <span className="text-[10px] rounded-full bg-primary/10 text-primary px-2 py-0.5 font-semibold">{post.tag}</span>
        <h1 className="mt-3 text-xl font-extrabold text-primary leading-tight">{post.title}</h1>
        <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
          <span>answered by {post.answeredBy}</span>
          <span className="inline-flex items-center gap-1"><ArrowUp size={12} /> {post.upvotes}</span>
          <span className="inline-flex items-center gap-1"><MessageCircle size={12} /> {post.answers || replies.length}</span>
        </div>
        <p className="mt-4 text-sm text-primary/90 leading-relaxed">{body}</p>

        <h3 className="mt-7 text-primary font-semibold text-sm">{replies.length} replies</h3>
        <div className="mt-3 space-y-3">
          {replies.map((r) => (
            <div key={r.id} className="rounded-2xl bg-card p-3">
              <div className="flex items-center gap-2">
                <Avatar seed={r.author} size={28} />
                <p className="text-xs font-bold text-primary">{r.author}</p>
              </div>
              <p className="text-sm text-primary mt-2 leading-relaxed">{r.text}</p>
              <button className="mt-2 text-[11px] text-muted-foreground inline-flex items-center gap-1">
                <ArrowUp size={11} /> {r.upvotes}
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate({ to: "/discover" })}
          className="mt-7 w-full rounded-full bg-primary text-primary-foreground py-3 text-sm font-bold"
        >
          Add your reply
        </button>
      </div>
    </div>
  );
}
