import { useState, useEffect, useMemo } from "react";
import { EmployeeService } from "@/src/services/employees";
import { Employee } from "@/src/types/employee";

export function useGetUserFormData() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchEmployees() {
      setIsLoading(true);
      try {
        const data = await EmployeeService.getAll();
        setEmployees(data);
      } catch (error) {
        console.error("Failed to fetch employees for user form:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEmployees();
  }, []);

  const employeeOptions = useMemo(() => 
    employees.map((employee) => ({
      label: `${employee.cpf} - ${employee.full_name}`,
      value: employee.id
    })), 
    [employees]
  );

  return {
    employeeOptions,
    isLoading
  };
}
