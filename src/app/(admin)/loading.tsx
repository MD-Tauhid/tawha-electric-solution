import { PageLoading } from "@/components/shared/page-loading";

export default function AdminLoading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <PageLoading message="Loading admin..." />
    </div>
  );
}
