import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function BentoSkeleton() {
  return (
    <Card className="bg-card text-card-foreground border border-border transition-all shadow-sm rounded-3xl overflow-hidden relative">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-secondary/50 to-transparent z-10" />
      <CardHeader className="flex flex-row items-center gap-4 pb-4">
        <div className="w-10 h-10 rounded-lg bg-secondary shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-32 bg-secondary rounded-full" />
          <div className="h-2 w-16 bg-secondary rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-1 w-full bg-secondary rounded-full" />
        <div className="flex justify-between">
          <div className="h-2 w-10 bg-secondary rounded-full" />
          <div className="h-2 w-8 bg-secondary rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}
