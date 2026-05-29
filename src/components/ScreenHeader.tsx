import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

export function ScreenHeader({
  title,
  back,
  right,
}: {
  title: string;
  back?: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between px-5 pt-4 pb-3">
      <div className="w-10">
        {back && (
          <Link to={back} className="text-muted-foreground -ml-2 p-2 inline-flex">
            <ChevronLeft size={26} />
          </Link>
        )}
      </div>
      <h1 className="text-xl font-bold text-primary">{title}</h1>
      <div className="w-10 flex justify-end">{right}</div>
    </div>
  );
}
