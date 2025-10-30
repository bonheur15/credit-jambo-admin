import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React from "react";
import { toast } from "sonner";
import { fetchWithAuth } from "../lib/api";

export const Route = createFileRoute("/dashboard")({
  component: DashboardComponent,
});

interface RecentTransaction {
  id: string;
  type: string;
  amount: number;
  created_at: string;
}

interface DashboardOverview {
  totalUsers: number;
  totalDevices: number;
  totalTransactions: number;
  totalTransactionVolume: number;
  recentTransactions: RecentTransaction[];
}

function DashboardComponent() {
  const [dashboardData, setDashboardData] =
    React.useState<DashboardOverview | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetchWithAuth("dashboard/overview");
        if (response.ok) {
          const data: DashboardOverview = await response.json();
          setDashboardData(data);
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Failed to fetch dashboard data.");
          toast.error(errorData.message || "Failed to fetch dashboard data.");
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
        toast.error(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({
    title,
    value,
    change,
    changeColor,
  }: {
    title: string;
    value: string;
    change?: string;
    changeColor?: string;
  }) => (
    <div className="rounded-lg bg-green-50/60 p-5 shadow-sm dark:bg-zinc-800">
      <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
        {title}
      </p>
      <p className="mt-1 text-3xl font-semibold text-zinc-900 dark:text-zinc-100">
        {value}
      </p>
      {change && changeColor && (
        <p className={`mt-1 text-sm font-medium ${changeColor}`}>{change}</p>
      )}
    </div>
  );

  if (loading) {
    return (
      <main className="flex-1 overflow-y-auto bg-white p-8 dark:bg-zinc-900">
        <h1 className="mb-6 text-4xl font-bold text-zinc-900 dark:text-zinc-100">
          Dashboard Overview
        </h1>
        <p>Loading dashboard data...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 overflow-y-auto bg-white p-8 dark:bg-zinc-900">
        <h1 className="mb-6 text-4xl font-bold text-zinc-900 dark:text-zinc-100">
          Dashboard Overview
        </h1>
        <p className="text-red-500">Error: {error}</p>
      </main>
    );
  }

  const stats = dashboardData
    ? [
        {
          title: "Total Users",
          value: dashboardData.totalUsers.toLocaleString(),
        },
        {
          title: "Total Devices",
          value: dashboardData.totalDevices.toLocaleString(),
        },
        {
          title: "Total Transactions",
          value: dashboardData.totalTransactions.toLocaleString(),
        },
        {
          title: "Total Transaction Volume",
          value: `$${dashboardData.totalTransactionVolume.toLocaleString()}`,
        },
      ]
    : [];

  return (
    <main className="flex-1 overflow-y-auto bg-white p-8 dark:bg-zinc-900">
      {/* Page Header */}
      <h1 className="mb-6 text-4xl font-bold text-zinc-900 dark:text-zinc-100">
        Dashboard Overview
      </h1>

      {/* Stats Card Grid */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} title={stat.title} value={stat.value} />
        ))}
      </section>

      {/* Recent Transactions Section */}
      <section className="mt-10">
        <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          Recent Transactions
        </h2>

        {/* Responsive Table Container */}
        <div className="w-full overflow-x-auto rounded-lg border border-zinc-200 shadow-sm dark:border-zinc-700">
          <table className="w-full min-w-[600px] divide-y divide-zinc-200 dark:divide-zinc-700">
            {/* Table Head */}
            <thead className="bg-green-50/60 dark:bg-zinc-800">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300"
                >
                  Amount
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300"
                >
                  Date
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-700 dark:bg-zinc-900">
              {dashboardData?.recentTransactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                >
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {tx.id}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-600 dark:text-zinc-300">
                    {tx.type}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-600 dark:text-zinc-300">
                    {tx.amount.toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-600 dark:text-zinc-300">
                    {new Date(tx.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
