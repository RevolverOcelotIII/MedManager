"use client";

import { useState, useEffect, useCallback } from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import { GridPage } from "@/src/components/layout/GridPage/GridPage";
import { GridColumn } from "@/src/types";
import { Role } from "@/src/types/role";
import { ROLE_COLUMNS } from "@/src/models/role";
import { RoleFormModal } from "@/src/app/roles/RoleFormModal";
import { RoleService } from "@/src/services/roles";
import "@/src/styles/app/patients.css";

export default function RolesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRoles = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) setIsLoading(true);
      const data = await RoleService.getAll();
      setRoles(data);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);
  
  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.access_level.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setIsFormModalOpen(true);
  };

  const handleNew = () => {
    setSelectedRole(null);
    setIsFormModalOpen(true);
  };

  const handleSubmit = async (data: Partial<Role>) => {
    try {
      if (selectedRole) {
        await RoleService.update(selectedRole.id, data);
      } else {
        await RoleService.create(data);
      }
      setIsFormModalOpen(false);
      fetchRoles(true);
    } catch (error) {
      console.error("Failed to save role:", error);
      alert("Error saving role. Please check the data and try again.");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this role?")) {
      try {
        await RoleService.delete(id);
        fetchRoles(true);
      } catch (error) {
        console.error("Failed to delete role:", error);
        alert("Error deleting role.");
      }
    }
  };

  const gridColumns: GridColumn<Role>[] = [
    ...ROLE_COLUMNS
      .filter(column => column.grid)
      .map(column => ({
        header: column.label,
        accessor: column.render ? (item: Role) => column.render!(item) : (column.name as keyof Role),
        badge: column.badge,
        options: column.options,
      })),
    {
      header: "Actions",
      align: "right",
      className: "actions-column",
      accessor: (role) => (
        <div className="action-buttons">
          <button 
            className="edit-button" 
            aria-label="Edit"
            onClick={() => handleEdit(role)}
          >
            <MdEdit size={16} />
          </button>
          <button 
            className="delete-button" 
            aria-label="Delete"
            onClick={() => handleDelete(role.id)}
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
        title="Hospital Roles"
        description="Define job titles and their corresponding access categories."
        data={filteredRoles}
        columns={gridColumns}
        rowKey="id"
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onNewClick={handleNew}
        isLoading={isLoading}
      />

      <RoleFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleSubmit}
        role={selectedRole}
      />
    </>
  );
}
