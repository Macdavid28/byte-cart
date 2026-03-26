import { PackageOpen } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

const EmptyState = ({
  title = "Nothing here yet",
  message = "Check back later or try a different action.",
  icon,
  action,
}: EmptyStateProps) => {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
        {icon || <PackageOpen className="h-10 w-10 text-slate-400" />}
      </div>
      <h3 className="text-xl font-bold font-secondary text-slate-800">{title}</h3>
      <p className="max-w-sm text-slate-500">{message}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
};

export default EmptyState;
