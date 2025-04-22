import Layout from '@/components/Layout';

export default function Loading() {
  return (
    <Layout>
      <div className="content-container py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-panel animate-pulse rounded-lg p-5 h-64">
              <div className="h-32 bg-muted rounded-md mb-4"></div>
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
} 