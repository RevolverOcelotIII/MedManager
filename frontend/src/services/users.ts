import { ApiService } from "./api";
import { User } from "@/src/types/user";

export const UserService = {
  getAll: () => ApiService.get<User[]>("/users/"),
  
  getById: (id: number) => ApiService.get<User>(`/users/${id}`),
  
  create: (data: any) => ApiService.post<User>("/users/", data),
  
  update: (id: number, data: any) => ApiService.put<User>(`/users/${id}`, data),
  
  delete: (id: number) => ApiService.delete(`/users/${id}`),
};
