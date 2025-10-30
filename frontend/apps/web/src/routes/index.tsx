import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: LoginComponent,
});

function LoginComponent() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 py-12 font-sans dark:bg-zinc-900">
      <div className="w-full max-w-sm">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Sign in to manage users, accounts, and transactions.
          </p>
        </header>

        <form className="mt-8 space-y-5">
          <div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Email"
              className="w-full appearance-none rounded-md bg-green-50 px-4 py-3 text-zinc-900 placeholder:text-green-800/70 shadow-sm ring-1 ring-inset ring-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-400 dark:ring-zinc-700"
            />
          </div>

          <div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Password"
              className="w-full appearance-none rounded-md bg-green-50 px-4 py-3 text-zinc-900 placeholder:text-green-800/70 shadow-sm ring-1 ring-inset ring-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-400 dark:ring-zinc-700"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full justify-center rounded-md bg-[#1FE76B] px-4 py-3 font-semibold text-zinc-900 shadow-sm transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Log In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
