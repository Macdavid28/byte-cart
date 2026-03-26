import { Loader2 } from "lucide-react";

const LoadingSpinner = ({ text = "Loading..." }: { text?: string }) => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      <p className="text-sm font-medium text-slate-500">{text}</p>
    </div>
  );
};

export default LoadingSpinner;
