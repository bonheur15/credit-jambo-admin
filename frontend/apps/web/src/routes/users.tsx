import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { fetchWithAuth } from "../lib/api";

export const Route = createFileRoute("/users")({
  component: UsersPage,
});

interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

interface Account {
  id: string;
  currency: string;
  balance: number;
}

interface UserDetails extends User {
  accounts: Account[];
}

const UserDetailsSidebar: React.FC<{ user: UserDetails | null }> = ({
  user,
}) => {
  if (!user) {
    return (
      <aside className="w-80 shrink-0 bg-white p-8 dark:bg-zinc-900">
        <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          User Details
        </h1>
        <p>Select a user to view details.</p>
      </aside>
    );
  }

  return (
    <aside className="w-80 shrink-0 bg-white p-8 dark:bg-zinc-900">
      <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
        User Details
      </h1>

      <div className="flex flex-col items-center">
        <img
          src={`https://ui-avatars.com/api/?name=${user.name}&background=E0E0E0&color=333333&size=128`}
          alt={user.name}
          className="h-32 w-32 rounded-full object-cover"
        />
        <h2 className="mt-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          {user.name}
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{user.email}</p>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-500">
          Joined on {new Date(user.created_at).toLocaleDateString()}
        </p>
      </div>

      <div className="mt-10">
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Accounts
        </h3>
        <div className="mt-4 space-y-4">
          {user.accounts.map((account) => (
            <div key={account.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-zinc-800 dark:text-zinc-200">
                  {account.currency} Account
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  ID: {account.id}
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
};

function UsersPage() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [selectedUser, setSelectedUser] = React.useState<UserDetails | null>(
    null,
  );
  const [loadingUsers, setLoadingUsers] = React.useState(true);
  const [loadingUserDetails, setLoadingUserDetails] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await fetchWithAuth("users");
      if (response.ok) {
        const data: User[] = await response.json();
        setUsers(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to fetch users.");
        toast.error(errorData.message || "Failed to fetch users.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      toast.error(err.message || "An unexpected error occurred.");
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchUserDetails = async (userId: string) => {
    setLoadingUserDetails(true);
    try {
      const response = await fetchWithAuth(`users/${userId}`);
      if (response.ok) {
        const data: UserDetails = await response.json();
        setSelectedUser(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to fetch user details.");
        toast.error(errorData.message || "Failed to fetch user details.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      toast.error(err.message || "An unexpected error occurred.");
    } finally {
      setLoadingUserDetails(false);
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  if (loadingUsers) {
    return (
      <div className="flex min-h-screen bg-white font-sans dark:bg-zinc-900 p-8">
        <p>Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-white font-sans dark:bg-zinc-900 p-8">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white font-sans dark:bg-zinc-900">
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
                  className="hover:bg-green-50/50 dark:hover:bg-zinc-800/50 cursor-pointer"
                  onClick={() => fetchUserDetails(user.id)}
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
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click from triggering
                        fetchUserDetails(user.id);
                      }}
                      className="font-medium text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <UserDetailsSidebar user={selectedUser} />
    </div>
  );
}
