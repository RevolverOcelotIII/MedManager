"use client";

import { useState, useEffect, useCallback } from "react";
import { MdEdit, MdDelete, MdVisibility } from "react-icons/md";
import { GridPage } from "@/src/components/layout/GridPage/GridPage";
import { GridColumn } from "@/src/types";
import { Employee } from "@/src/types/employee";
import { EMPLOYEE_COLUMNS } from "@/src/models/employee";
import { EmployeeFormModal } from "@/src/app/employees/EmployeeFormModal";
import { DetailsModal } from "@/src/components/layout/Modal/DetailsModal";
import { EmployeeService } from "@/src/services/employees";
import "@/src/styles/app/patients.css";

export default function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEmployees = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) setIsLoading(true);
      const data = await EmployeeService.getAll();
      setEmployees(data);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);
  
  const filteredEmployees = employees.filter(employee => 
    employee.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (employee.cpf && employee.cpf.includes(searchTerm))
  );

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsFormModalOpen(true);
  };

  const handleViewDetails = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDetailsModalOpen(true);
  };

  const handleNew = () => {
    setSelectedEmployee(null);
    setIsFormModalOpen(true);
  };

  const handleSubmit = async (data: Partial<Employee>) => {
    try {
      if (selectedEmployee) {
        await EmployeeService.update(selectedEmployee.id, data);
      } else {
        await EmployeeService.create(data);
      }
      setIsFormModalOpen(false);
      fetchEmployees(true);
    } catch (error) {
      console.error("Failed to save employee:", error);
      alert("Error saving employee. Please check the data and try again.");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      try {
        await EmployeeService.delete(id);
        fetchEmployees(true);
      } catch (error) {
        console.error("Failed to delete employee:", error);
        alert("Error deleting employee.");
      }
    }
  };

  const gridColumns: GridColumn<Employee>[] = [
    ...EMPLOYEE_COLUMNS
      .filter(column => column.grid)
      .map(column => ({
        header: column.label,
        accessor: column.render ? (item: Employee) => column.render!(item) : (column.name as keyof Employee),
        badge: column.badge,
        options: column.options,
      })),
    {
      header: "Actions",
      align: "right",
      className: "actions-column",
      accessor: (employee) => (
        <div className="action-buttons">
          <button 
            className="view-button" 
            aria-label="View Details"
            onClick={() => handleViewDetails(employee)}
          >
            <MdVisibility size={16} />
          </button>
          <button 
            className="edit-button" 
            aria-label="Edit"
            onClick={() => handleEdit(employee)}
          >
            <MdEdit size={16} />
          </button>
          <button 
            className="delete-button" 
            aria-label="Delete"
            onClick={() => handleDelete(employee.id)}
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
        title="Employees"
        description="Healthcare professionals and administrative staff."
        data={filteredEmployees}
        columns={gridColumns}
        rowKey="id"
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onNewClick={handleNew}
        isLoading={isLoading}
      />

      <EmployeeFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleSubmit}
        employee={selectedEmployee}
      />

      <DetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Employee Details"
        data={selectedEmployee}
        columns={EMPLOYEE_COLUMNS}
      />
    </>
  );
}
