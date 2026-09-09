import Link from "next/link";
import { Plus, FolderKanban } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DashboardShell } from "@/components/admin/dashboard-shell";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { getProjects } from "./actions";
import { ProjectFilters } from "./project-filters";
import { ProjectPagination } from "./project-pagination";

interface ProjectsPageProps {
  searchParams: Promise<{
    query?: string;
    status?: string;
    customerId?: string;
    page?: string;
  }>;
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const params = await searchParams;
  const result = await getProjects({
    query: params.query,
    status: params.status as "PLANNED" | "ONGOING" | "COMPLETED" | "CANCELLED" | undefined,
    customerId: params.customerId,
    page: params.page ? parseInt(params.page) : 1,
    limit: 10,
  });

  return (
    <DashboardShell
      title="Projects"
      description="Manage your projects"
      actions={
        <Link href="/admin/projects/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Project
          </Button>
        </Link>
      }
    >
      {/* Filters */}
      <ProjectFilters />

      {/* Table */}
      {result.projects.length === 0 ? (
        <EmptyState
          icon={<FolderKanban className="h-6 w-6" />}
          title="No projects found"
          description={
            result.total === 0
              ? "Get started by creating your first project."
              : "No projects match your search criteria."
          }
          action={
            result.total === 0 ? (
              <Link href="/admin/projects/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Project
                </Button>
              </Link>
            ) : undefined
          }
        />
      ) : (
        <>
          <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Project Number</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Value</TableHead>
                  <TableHead className="hidden sm:table-cell">Items</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <span className="font-mono text-sm text-muted-foreground">
                        {project.projectNumber}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/admin/projects/${project.id}`}
                        className="font-medium text-card-foreground hover:text-primary transition-colors"
                      >
                        {project.name}
                      </Link>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      {project.customer.companyName || project.customer.name}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={project.status} />
                    </TableCell>
                    <TableCell className="hidden sm:table-cell font-medium">
                      ${Number(project.totalValue).toLocaleString()}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      {project._count.items}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/projects/${project.id}`}>
                        <Button variant="default" size="sm">
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <ProjectPagination
            page={result.page}
            totalPages={result.totalPages}
            total={result.total}
          />
        </>
      )}
    </DashboardShell>
  );
}
