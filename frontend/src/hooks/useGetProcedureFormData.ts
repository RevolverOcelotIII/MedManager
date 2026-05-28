import { useState, useEffect, useMemo } from "react";
import { EmployeeService } from "@/src/services/employees";
import { Role } from "@/src/types/employee";

export function useGetProcedureFormData() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchRoles() {
      setIsLoading(true);
      try {
        const data = await EmployeeService.getRoles();
        setRoles(data);
      } catch (error) {
        console.error("Failed to fetch roles for procedure form:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRoles();
  }, []);

  const roleOptions = useMemo(() => 
    roles.map((role) => ({
      label: role.name,
      value: role.id
    })), 
    [roles]
  );

  return {
    roleOptions,
    isLoading
  };
}
