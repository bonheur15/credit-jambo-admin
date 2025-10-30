import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  DollarSign,
  Home,
  Smartphone,
  User,
  Users,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col justify-between overflow-y-auto bg-zinc-900 p-4 text-zinc-300 sticky top-0">
      <div>
        <header className="mb-6">
          <h2 className="px-3 text-lg font-semibold text-white">Admin Panel</h2>
        </header>

        <nav className="flex flex-col space-y-1">
          <a className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors bg-zinc-100 text-zinc-900">
            <Home className="h-5 w-5" />
            Dashboard
          </a>

          <a className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-zinc-800 hover:text-white">
            <Users className="h-5 w-5" />
            Users
          </a>

          <a className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-zinc-800 hover:text-white">
            <User className="h-5 w-5" />
            Accounts
          </a>

          <a className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-zinc-800 hover:text-white">
            <DollarSign className="h-5 w-5" />
            Transactions
          </a>

          <a className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-zinc-800 hover:text-white">
            <Smartphone className="h-5 w-5" />
            Devices
          </a>
        </nav>
      </div>

      <nav>
        <a className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-zinc-800 hover:text-white">
          <ArrowLeft className="h-5 w-5" />
          Logout
        </a>
      </nav>
    </aside>
  );
}
