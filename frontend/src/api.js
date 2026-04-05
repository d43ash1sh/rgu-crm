import axios from "axios";

// Look for a token in local storage
const getToken = () => localStorage.getItem('asf_admin_token');

const api = axios.create({ 
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api" 
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginAdmin = async (email, password) => {
  const res = await api.post('/auth/login', { email, password });
  localStorage.setItem('asf_admin_token', res.data.token);
  return res.data;
};

export const logoutAdmin = () => {
  localStorage.removeItem('asf_admin_token');
};

export const getDashboardData = () => api.get("/dashboard").then((res) => res.data);
export const getMembers = () => api.get("/members").then((res) => res.data);
export const addMember = (data) => api.post("/members", data).then((res) => res.data);
export const updateMemberStatus = (id, status) => api.patch(`/members/${id}`, { status }).then((res) => res.data);

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
