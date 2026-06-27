/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { useState, useEffect } from "react";
import { observer } from "mobx-react";
import { Trash2, UserX, UserCheck } from "lucide-react";
import { PageWrapper } from "@/components/common/page-wrapper";
import type { Route } from "./+types/page";

type TUser = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  date_joined: string;
  last_login: string | null;
};

const MembersPage = observer(function MembersPage() {
  const [users, setUsers] = useState<TUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/instances/users/", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data.results || data);
    } catch (e) {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleActive = async (userId: string, isActive: boolean) => {
    try {
      await fetch(`/api/instances/users/${userId}/`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !isActive }),
      });
      fetchUsers();
    } catch {
      setError("Failed to update user");
    }
  };

  const deleteUser = async (userId: string, email: string) => {
    if (!confirm(`Delete ${email}? This cannot be undone.`)) return;
    try {
      await fetch(`/api/instances/users/${userId}/`, {
        method: "DELETE",
        credentials: "include",
      });
      fetchUsers();
    } catch {
      setError("Failed to delete user");
    }
  };

  const filtered = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      `${u.first_name} ${u.last_name}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageWrapper
      header={{
        title: "Members",
        description: "Manage all users on this instance.",
      }}
    >
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md rounded-md border border-border-primary bg-layer-1 px-3 py-2 text-sm text-primary outline-none focus:border-accent-primary"
        />
        {loading && <div className="text-secondary text-sm">Loading...</div>}
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {!loading && (
          <div className="rounded-lg border border-border-primary overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-layer-1 border-b border-border-primary">
                <tr>
                  <th className="text-left px-4 py-3 text-secondary font-medium">Name</th>
                  <th className="text-left px-4 py-3 text-secondary font-medium">Email</th>
                  <th className="text-left px-4 py-3 text-secondary font-medium">Status</th>
                  <th className="text-left px-4 py-3 text-secondary font-medium">Joined</th>
                  <th className="text-left px-4 py-3 text-secondary font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user.id} className="border-b border-border-primary last:border-0 hover:bg-layer-1">
                    <td className="px-4 py-3 text-primary">
                      {user.first_name} {user.last_name}
                    </td>
                    <td className="px-4 py-3 text-secondary">{user.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          user.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-secondary">
                      {new Date(user.date_joined).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleActive(user.id, user.is_active)}
                          className="p-1.5 rounded hover:bg-layer-2 text-secondary hover:text-primary transition-colors"
                          title={user.is_active ? "Deactivate" : "Activate"}
                        >
                          {user.is_active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => deleteUser(user.id, user.email)}
                          className="p-1.5 rounded hover:bg-layer-2 text-secondary hover:text-red-500 transition-colors"
                          title="Delete user"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-secondary">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageWrapper>
  );
});

export const meta: Route.MetaFunction = () => [{ title: "Members - God Mode" }];
export default MembersPage;