import { createFileRoute } from "@tanstack/react-router";

import React from "react";
import { Search } from "lucide-react";

export const Route = createFileRoute("/users")({
  component: UsersPage,
});

interface Account {
  type: string;
  currency: string;
  balance: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface UserProfile {
  name: string;
  email: string;
  joined: string;
  avatarUrl: string;
  accounts: Account[];
}

const selectedUser: UserProfile = {
  name: "Sophia Clark",
  email: "sophia.clark@email.com",
  joined: "2023-01-15",
  avatarUrl:
    "https://placehold.co/128x128/E0E0E0/333333?text=SC&font=sans-serif",
  accounts: [
    { type: "Checking Account", currency: "USD", balance: 5250 },
    { type: "Savings Account", currency: "EUR", balance: 12800 },
    { type: "Investment Account", currency: "GBP", balance: 7500 },
  ],
};

const allUsers: User[] = [
  {
    id: "#12345",
    name: "Liam Harper",
    email: "liam.harper@email.com",
    createdAt: "2023-03-20",
  },
  {
    id: "#67890",
    name: "Olivia Bennett",
    email: "olivia.bennett@email.com",
    createdAt: "2023-02-10",
  },
  {
    id: "#24680",
    name: "Ethan Carter",
    email: "ethan.carter@email.com",
    createdAt: "2023-01-15",
  },
  {
    id: "#13579",
    name: "Ava Morgan",
    email: "ava.morgan@email.com",
    createdAt: "2022-12-05",
  },
  {
    id: "#98765",
    name: "Noah Foster",
    email: "noah.foster@email.com",
    createdAt: "2022-11-18",
  },
];

const UserDetailsSidebar: React.FC<{ user: UserProfile }> = ({ user }) => (
  <aside className="w-80 shrink-0 bg-white p-8 dark:bg-zinc-900">
    <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
      User Details
    </h1>

    <div className="flex flex-col items-center">
      <img
        src={user.avatarUrl}
        alt={user.name}
        className="h-32 w-32 rounded-full object-cover"
        onError={(e) =>
          (e.currentTarget.src =
            "https://placehold.co/128x128/E0E0E0/777777?text=User&font=sans-serif")
        }
      />
      <h2 className="mt-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
        {user.name}
      </h2>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">{user.email}</p>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-500">
        Joined on {user.joined}
      </p>
    </div>

    <div className="mt-10">
      <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
        Accounts
      </h3>
      <div className="mt-4 space-y-4">
        {user.accounts.map((account) => (
          <div key={account.type} className="flex items-center justify-between">
            <div>
              <p className="font-medium text-zinc-800 dark:text-zinc-200">
                {account.type}
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {account.currency}
              </p>
            </div>
            <p className="font-semibold text-zinc-900 dark:text-zinc-100">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: account.currency,
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(account.balance)}
            </p>
          </div>
        ))}
      </div>
    </div>
  </aside>
);

const UsersTable: React.FC<{ users: User[] }> = ({ users }) => (
  <main className="flex-1 overflow-y-auto bg-green-50/30 p-8 dark:bg-zinc-800/20">
    <h1 className="mb-6 text-4xl font-bold text-zinc-900 dark:text-zinc-100">
      Users
    </h1>

    <div className="relative mb-6">
      <input
        type="text"
        placeholder="Search..."
        className="w-full rounded-md border-none bg-white px-4 py-3 pl-10 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-200 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-700"
      />
      <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
    </div>

    <div className="w-full overflow-x-auto rounded-lg shadow-sm">
      <table className="w-full min-w-[700px] divide-y divide-zinc-200 dark:divide-zinc-700">
        <thead className="bg-white dark:bg-zinc-800">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300"
            >
              User ID
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300"
            >
              Name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300"
            >
              Email
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300"
            >
              Created At
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300"
            >
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-zinc-200/50 bg-white/80 backdrop-blur-sm dark:divide-zinc-700/50 dark:bg-zinc-900/80">
          {users.map((user) => (
            <tr
              key={user.id}
              className="hover:bg-green-50/50 dark:hover:bg-zinc-800/50"
            >
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {user.id}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-600 dark:text-zinc-300">
                {user.name}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-600 dark:text-zinc-300">
                {user.email}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-600 dark:text-zinc-300">
                {user.createdAt}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm">
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="font-medium text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400"
                >
                  View Details
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </main>
);

export default function UsersPage() {
  return (
    <div className="flex min-h-screen bg-white font-sans dark:bg-zinc-900">
      <UserDetailsSidebar user={selectedUser} />
      <UsersTable users={allUsers} />
    </div>
  );
}
