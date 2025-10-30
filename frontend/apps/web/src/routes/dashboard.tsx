import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CreditCardIcon, HomeIcon, ListIcon, UserIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { TransactionModal } from "../components/transaction-modal";
import { fetchWithAuth } from "../lib/api";

const API_URL = import.meta.env.VITE_API_URL;

export const Route = createFileRoute("/dashboard")({
  component: DashboardComponent,
});

type TAccount = {
  id: string;
  user_id: string;
  currency: string;
  created_at: string;
};

type TTransaction = {
  id: string;
  account_id: string;
  type: string;
  amount: number;
  reference: string;
  meta: Record<string, any>;
  created_at: string;
  created_by: string;
  status: string;
};

type TBalance = {
  account_id: string;
  balance: number;
  currency: string;
  last_snapshot_at: string;
};

function DashboardComponent() {
  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      change: "+12%",
      changeColor: "text-green-600",
    },
    {
      title: "Total Devices",
      value: "5,678",
      change: "+8%",
      changeColor: "text-green-600",
    },
    {
      title: "Total Transactions",
      value: "9,012",
      change: "+15%",
      changeColor: "text-green-600",
    },
    {
      title: "Total Transaction Volume",
      value: "$345,678",
      change: "+10%",
      changeColor: "text-green-600",
    },
  ];

  // Mock data for the transactions table
  const transactions = [
    {
      id: "#12345",
      type: "Purchase",
      amount: "$123.45",
      date: "2023-08-15",
    },
    { id: "#67890", type: "Refund", amount: "$67.89", date: "2023-08-14" },
    { id: "#11223", type: "Transfer", amount: "$456.78", date: "2023-08-13" },
    { id: "#44556", type: "Purchase", amount: "$78.90", date: "2023-08-12" },
    {
      id: "#77889",
      type: "Withdrawal",
      amount: "$234.56",
      date: "2023-08-11",
    },
  ];

  /**
   * StatCard Component
   * Displays a single statistic card for the dashboard overview.
   */
  const StatCard = ({
    title,
    value,
    change,
    changeColor,
  }: {
    title: string;
    value: string;
    change: string;
    changeColor: string;
  }) => (
    <div className="rounded-lg bg-green-50/60 p-5 shadow-sm dark:bg-zinc-800">
      <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
        {title}
      </p>
      <p className="mt-1 text-3xl font-semibold text-zinc-900 dark:text-zinc-100">
        {value}
      </p>
      <p className={`mt-1 text-sm font-medium ${changeColor}`}>{change}</p>
    </div>
  );
  return (
    <main className="flex-1 overflow-y-auto bg-white p-8 dark:bg-zinc-900">
      {/* Page Header */}
      <h1 className="mb-6 text-4xl font-bold text-zinc-900 dark:text-zinc-100">
        Dashboard Overview
      </h1>

      {/* Stats Card Grid */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            changeColor={stat.changeColor}
          />
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
              {transactions.map((tx) => (
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
                    {tx.amount}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-600 dark:text-zinc-300">
                    {tx.date}
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
