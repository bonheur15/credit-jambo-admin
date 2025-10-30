import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { fetchWithAuth } from "../lib/api";

export const Route = createFileRoute("/devices")({
  component: DevicesManagement,
});

type DeviceStatus = "VERIFIED" | "PENDING";

interface Device {
  id: string;
  user_id: string;
  device_id: string;
  device_meta: Record<string, any>;
  registered_at: string;
  created_by: string;
  status: DeviceStatus;
}

const StatusBadge: React.FC<{ status: DeviceStatus }> = ({ status }) => {
  const baseClasses =
    "inline-block rounded-full px-3 py-1 text-xs font-semibold";
  const statusClasses =
    status === "VERIFIED"
      ? "bg-green-100 text-green-800"
      : "bg-gray-200 text-gray-800";

  return <span className={`${baseClasses} ${statusClasses}`}>{status}</span>;
};

const FilterDropdown: React.FC<{ label: string }> = ({ label }) => (
  <button className="flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700">
    {label}
    <ChevronDown className="h-4 w-4" />
  </button>
);

function DevicesManagement() {
  const [devices, setDevices] = React.useState<Device[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchDevices = async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth("devices");
      if (response.ok) {
        const data: Device[] = await response.json();
        setDevices(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to fetch devices.");
        toast.error(errorData.message || "Failed to fetch devices.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      toast.error(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchDevices();
  }, []);

  const handleApprove = async (deviceId: string) => {
    try {
      const response = await fetchWithAuth(`devices/${deviceId}/approve`);
      if (response.ok) {
        toast.success("Device approved successfully!");
        fetchDevices(); // Refresh the list of devices
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to approve device.");
      }
    } catch (err: any) {
      toast.error(
        err.message || "An unexpected error occurred during approval.",
      );
    }
  };

  if (loading) {
    return (
      <main className="flex-1 overflow-y-auto bg-white p-8 dark:bg-zinc-900">
        <h1 className="mb-6 text-4xl font-bold text-zinc-900 dark:text-zinc-100">
          Devices Management
        </h1>
        <p>Loading devices...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 overflow-y-auto bg-white p-8 dark:bg-zinc-900">
        <h1 className="mb-6 text-4xl font-bold text-zinc-900 dark:text-zinc-100">
          Devices Management
        </h1>
        <p className="text-red-500">Error: {error}</p>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto bg-white p-8 dark:bg-zinc-900">
      <h1 className="mb-6 text-4xl font-bold text-zinc-900 dark:text-zinc-100">
        Devices Management
      </h1>

      <section className="mb-6 flex gap-4">
        <FilterDropdown label="Status" />
        <FilterDropdown label="User" />
      </section>

      <section>
        <div className="w-full overflow-x-auto rounded-lg border border-zinc-200 shadow-sm dark:border-zinc-700">
          <table className="w-full min-w-[1000px] divide-y divide-zinc-200 dark:divide-zinc-700">
            <thead className="bg-green-50/60 dark:bg-zinc-800">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300"
                >
                  Device ID
                </th>
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
                  Device Meta
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300"
                >
                  Registered At
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300"
                >
                  Created By
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300"
                >
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-700 dark:bg-zinc-900">
              {devices.map((device) => (
                <tr
                  key={device.id}
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                >
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {device.device_id}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-600 dark:text-zinc-300">
                    {device.user_id}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-600 dark:text-zinc-300">
                    {JSON.stringify(device.device_meta)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-600 dark:text-zinc-300">
                    <div>
                      {new Date(device.registered_at).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-zinc-400">
                      {new Date(device.registered_at).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-600 dark:text-zinc-300">
                    {device.created_by}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <StatusBadge status={device.status} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {device.status === "PENDING" && (
                      <button
                        onClick={() => handleApprove(device.id)}
                        className="font-medium text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400"
                      >
                        Approve
                      </button>
                    )}
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
