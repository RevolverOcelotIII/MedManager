"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MdEdit, MdDelete, MdVisibility } from "react-icons/md";
import { GridPage } from "@/src/components/layout/GridPage/GridPage";
import { GridColumn } from "@/src/types";
import { User } from "@/src/types/user";
import { USER_COLUMNS } from "@/src/models/user";
import { UserFormModal } from "@/src/app/users/UserFormModal";
import { DetailsModal } from "@/src/components/layout/Modal/DetailsModal";
import { UserService } from "@/src/services/users";
import { useAuth } from "@/src/hooks/useAuth";
import { AccessLevel } from "@/src/types/role";
import { i18n } from "@/src/lib/i18n";
import "@/src/styles/app/patients.css";

export default function UsersPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) setIsLoading(true);
      const data = await UserService.getAll();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthLoading) {
      if (user?.employee?.role?.access_level !== AccessLevel.admin) {
        router.push("/patients");
      } else {
        fetchUsers();
      }
    }
  }, [isAuthLoading, user, router, fetchUsers]);

  if (isAuthLoading || user?.employee?.role?.access_level !== AccessLevel.admin) {
    return null;
  }
  
  const filteredUsers = users.filter(user => {
    const search = searchTerm.toLowerCase();
    const employeeName = user.employee?.full_name?.toLowerCase() || "";
    const email = user.email.toLowerCase();
    
    return employeeName.includes(search) || 
           email.includes(search);
  });

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsFormModalOpen(true);
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setIsDetailsModalOpen(true);
  };

  const handleNew = () => {
    setSelectedUser(null);
    setIsFormModalOpen(true);
  };

  const handleSubmit = async (data: Partial<User> & { password?: string }) => {
    try {
      if (selectedUser) {
        if (!data.password) delete data.password;
        await UserService.update(selectedUser.id, data);
      } else {
        await UserService.create(data);
      }
      setIsFormModalOpen(false);
      fetchUsers(true);
    } catch (error) {
      console.error("Failed to save user:", error);
      alert(i18n.t("common.error_saving"));
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm(i18n.t("common.confirm_delete"))) {
      try {
        await UserService.delete(id);
        fetchUsers(true);
      } catch (error) {
        console.error("Failed to delete user:", error);
        alert(i18n.t("common.error_deleting"));
      }
    }
  };

  const gridColumns: GridColumn<User>[] = [
    ...USER_COLUMNS
      .filter(column => column.grid)
      .map(column => ({
        header: column.label,
        accessor: column.render ? (item: User) => column.render!(item) : (column.name as keyof User),
        badge: column.badge,
        options: column.options,
      })),
    {
      header: i18n.t("common.actions"),
      align: "right",
      className: "actions-column",
      accessor: (user) => (
        <div className="action-buttons">
          <button 
            className="view-button" 
            aria-label={i18n.t("common.view_details")}
            onClick={() => handleViewDetails(user)}
          >
            <MdVisibility size={16} />
          </button>
          <button 
            className="edit-button" 
            aria-label={i18n.t("common.edit")}
            onClick={() => handleEdit(user)}
          >
            <MdEdit size={16} />
          </button>
          <button 
            className="delete-button" 
            aria-label={i18n.t("common.delete")}
            onClick={() => handleDelete(user.id)}
          >
            <MdDelete size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <>
      <GridPage
        title={i18n.t("pages.users.title")}
        description={i18n.t("pages.users.description")}
        data={filteredUsers}
        columns={gridColumns}
        rowKey="id"
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onNewClick={handleNew}
        isLoading={isLoading}
      />

      <UserFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleSubmit}
        user={selectedUser}
      />

      <DetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title={i18n.t("pages.users.details_title")}
        data={selectedUser}
        columns={USER_COLUMNS}
      />
    </>
  );
}
