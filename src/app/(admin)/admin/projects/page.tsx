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
import { Badge } from "@/components/ui/badge";
import { DashboardShell } from "@/components/admin/dashboard-shell";
import { EmptyState } from "@/components/shared/empty-state";
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

const projectStatusLabels: Record<string, string> = {
  PLANNED: "Planned",
  ONGOING: "Ongoing",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const projectStatusVariants: Record<string, "default" | "secondary" | "success" | "warning" | "destructive"> = {
  PLANNED: "secondary",
  ONGOING: "default",
  COMPLETED: "success",
  CANCELLED: "destructive",
};

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
          <div className="rounded-lg border bg-white">
            <Table>
              <TableHeader>
                <TableRow>
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
                      <span className="font-mono text-sm">
                        {project.projectNumber}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/admin/projects/${project.id}`}
                        className="font-medium hover:underline"
                      >
                        {project.name}
                      </Link>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {project.customer.companyName || project.customer.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant={projectStatusVariants[project.status] || "secondary"}>
                        {projectStatusLabels[project.status] || project.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      ${Number(project.totalValue).toLocaleString()}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {project._count.items}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/projects/${project.id}`}>
                        <Button variant="ghost" size="sm">
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
