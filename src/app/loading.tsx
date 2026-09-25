import Layout from '@/components/Layout';
import { Skeleton } from '@/components/rc';

export default function Loading() {
  return (
    <Layout>
      <div className="rc-container py-8 md:py-14">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-[18px]">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex h-64 flex-col gap-3 rounded-rc-card border border-rc-border-card bg-rc-surface p-5">
              <Skeleton className="h-32 rounded-[10px]" />
              <Skeleton className="h-4 w-3/4 rounded" />
              <Skeleton className="h-4 w-1/2 rounded" />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
