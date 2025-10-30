import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/devices")({
  component: DevicesManagement,
});

import React from "react";
import { ChevronDown } from "lucide-react";

type DeviceStatus = "VERIFIED" | "PENDING";

interface Device {
  id: string;
  userId: string;
  meta: string;
  registeredAt: string;
  registeredTime: string;
  createdBy: string;
  status: DeviceStatus;
}

const mockDevices: Device[] = [
  {
    id: "Device-001",
    userId: "User-123",
    meta: "Phone (iOS)",
    registeredAt: "2024-01-15",
    registeredTime: "10:00 AM",
    createdBy: "Admin-001",
    status: "VERIFIED",
  },
  {
    id: "Device-002",
    userId: "User-456",
    meta: "Laptop (macOS)",
    registeredAt: "2024-02-20",
    registeredTime: "02:30 PM",
    createdBy: "Admin-002",
    status: "VERIFIED",
  },
  {
    id: "Device-003",
    userId: "User-789",
    meta: "Tablet (Android)",
    registeredAt: "2024-03-10",
    registeredTime: "09:45 AM",
    createdBy: "Admin-001",
    status: "PENDING",
  },
  {
    id: "Device-004",
    userId: "User-101",
    meta: "Phone (Android)",
    registeredAt: "2024-04-05",
    registeredTime: "11:15 AM",
    createdBy: "Admin-002",
    status: "VERIFIED",
  },
  {
    id: "Device-005",
    userId: "User-112",
    meta: "Laptop (Windows)",
    registeredAt: "2024-05-12",
    registeredTime: "01:00 PM",
    createdBy: "Admin-001",
    status: "PENDING",
  },
  {
    id: "Device-006",
    userId: "User-131",
    meta: "Tablet (iOS)",
    registeredAt: "2024-06-18",
    registeredTime: "03:45 PM",
    createdBy: "Admin-002",
    status: "VERIFIED",
  },
  {
    id: "Device-007",
    userId: "User-141",
    meta: "Phone (iOS)",
    registeredAt: "2024-07-22",
    registeredTime: "08:00 AM",
    createdBy: "Admin-001",
    status: "PENDING",
  },
  {
    id: "Device-008",
    userId: "User-151",
    meta: "Laptop (macOS)",
    registeredAt: "2024-08-28",
    registeredTime: "04:15 PM",
    createdBy: "Admin-002",
    status: "VERIFIED",
  },
  {
    id: "Device-009",
    userId: "User-151",
    meta: "Tablet (Android)",
    registeredAt: "2024-09-14",
    registeredTime: "08:30 AM",
    createdBy: "Admin-001",
    status: "PENDING",
  },
  {
    id: "Device-010",
    userId: "User-171",
    meta: "Phone (Android)",
    registeredAt: "2024-10-20",
    registeredTime: "07:45 PM",
    createdBy: "Admin-002",
    status: "VERIFIED",
  },
];

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
              {mockDevices.map((device) => (
                <tr
                  key={device.id}
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                >
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {device.id}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-600 dark:text-zinc-300">
                    {device.userId}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-600 dark:text-zinc-300">
                    {device.meta}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-600 dark:text-zinc-300">
                    <div>{device.registeredAt}</div>
                    <div className="text-xs text-zinc-400">
                      {device.registeredTime}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-600 dark:text-zinc-300">
                    {device.createdBy}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <StatusBadge status={device.status} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="font-medium text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400"
                    >
                      Approve
                    </a>
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
