import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface ApiRequestOptions {
  method: HttpMethod;
  url: string;
  data?: any;
  config?: AxiosRequestConfig;
  isFormData?: boolean;
}

export async function request<T>({
  method,
  url,
  data,
  config = {},
  isFormData = false,
}: ApiRequestOptions): Promise<T> {
  let requestData = data;

  if (isFormData && data) {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
    requestData = formData;
  }

  const response = await axiosInstance.request<T>({
    method,
    url,
    data: requestData,
    ...config,
    headers: {
      ...config.headers,
      ...(isFormData ? { "Content-Type": "multipart/form-data" } : {}),
    },
  });

  return response.data;
}

export const ApiService = {
  get: <T>(url: string, config?: AxiosRequestConfig) => 
    request<T>({ method: "GET", url, config }),
  
  post: <T>(url: string, data?: any, isFormData = false, config?: AxiosRequestConfig) => 
    request<T>({ method: "POST", url, data, isFormData, config }),
  
  put: <T>(url: string, data?: any, isFormData = false, config?: AxiosRequestConfig) => 
    request<T>({ method: "PUT", url, data, isFormData, config }),
  
  delete: <T>(url: string, config?: AxiosRequestConfig) => 
    request<T>({ method: "DELETE", url, config }),
};
