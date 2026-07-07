import axios from "axios";

const api = axios.create({ 
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
  withCredentials: true
});

api.interceptors.request.use((config) => {
  // CSRF protection header
  config.headers['X-Requested-With'] = 'XMLHttpRequest';
  return config;
});

export const checkAuth = async () => {
  const res = await api.get('/auth/me');
  return res.data;
};

export const loginAdmin = async (email, password) => {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
};

export const logoutAdmin = async () => {
  const res = await api.post('/auth/logout');
  return res.data;
};

export const getRegisterOptions = () => api.get('/auth/register-options').then(res => res.data);
export const verifyRegister = (data) => api.post('/auth/register-verify', data).then(res => res.data);
export const getLoginOptions = () => api.get('/auth/login-options').then(res => res.data);
export const verifyLoginPasskey = (data) => api.post('/auth/login-verify', data).then(res => res.data);

export const getDashboardData = () => api.get("/dashboard").then((res) => res.data);
export const getMembers = () => api.get("/members").then((res) => res.data);
export const addMember = (data) => api.post("/members", data).then((res) => res.data);
export const updateMemberStatus = (id, status) => api.patch(`/members/${id}`, { status }).then((res) => res.data);
export const deleteMember = (id) => api.delete(`/members/${id}`).then((res) => res.data);

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const verifyStudent = (email, rollNumber) => api.post("/verify-student", { email, rollNumber }).then((res) => res.data);
export const getListings = () => api.get("/listings").then((res) => res.data);
export const getListingDetails = (id) => api.get(`/listings/${id}`).then((res) => res.data);
export const addListing = (data) => api.post("/listings", data).then((res) => res.data);
export const updateListing = (id, data) => api.put(`/listings/${id}`, data).then((res) => res.data);
export const deleteListing = (id, userEmail) => api.delete(`/listings/${id}`, { data: { userEmail } }).then((res) => res.data);
export const reportListing = (id, data) => api.post(`/listings/${id}/report`, data).then((res) => res.data);

export const getAdminListings = () => api.get("/admin/listings").then((res) => res.data);
export const updateListingStatus = (id, status, rejectionReason) => api.patch(`/admin/listings/${id}/status`, { status, rejectionReason }).then((res) => res.data);
export const resolveListingReport = (id, action) => api.patch(`/admin/listings/${id}/resolve-report`, { action }).then((res) => res.data);

export const getRoommateRequests = () => api.get("/roommates").then((res) => res.data);
export const addRoommateRequest = (data) => api.post("/roommates", data).then((res) => res.data);
export const deleteRoommateRequest = (id, userEmail) => api.delete(`/roommates/${id}`, { data: { userEmail } }).then((res) => res.data);

export const getNotices = () => api.get("/notices").then((res) => res.data);
export const addNotice = (data) => api.post("/notices", data).then((res) => res.data);
export const deleteNotice = (id) => api.delete(`/notices/${id}`).then((res) => res.data);

export const getEvents = () => api.get("/events").then((res) => res.data);
export const addEvent = (data) => api.post("/events", data).then((res) => res.data);
export const deleteEvent = (id) => api.delete(`/events/${id}`).then((res) => res.data);

export const getGalleryItems = () => api.get("/gallery").then((res) => res.data);
export const addGalleryItem = (data) => api.post("/gallery", data).then((res) => res.data);
export const deleteGalleryItem = (id) => api.delete(`/gallery/${id}`).then((res) => res.data);

export const getTeamMembers = () => api.get("/team").then((res) => res.data);
export const addTeamMember = (data) => api.post("/team", data).then((res) => res.data);
export const updateTeamMember = (id, data) => api.put(`/team/${id}`, data).then((res) => res.data);
export const deleteTeamMember = (id) => api.delete(`/team/${id}`).then((res) => res.data);
