import getCookie from '../utils/getCookie';

const API_URL = 'http://127.0.0.1:8000/api/';

const handleApiResponse = async (response: Response) => {
  const contentType = response.headers.get('content-type');
  
  if (!response.ok) {
    if (contentType?.includes('application/json')) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    } else {
      const errorText = await response.text();
      throw new Error(errorText || `Request failed with status ${response.status}`);
    }
  }

  if (contentType?.includes('application/json')) {
    return await response.json();
  }
  
  return null;
};

const getAuthHeaders = () => {
  const token = getCookie('access_token');
  if (!token) {
    throw new Error('Authentication token not found');
  }
  
  return {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json'
  };
};

export default {
  // User Management
  getUsers: async () => {
    const response = await fetch(`${API_URL}user/`, {
      headers: getAuthHeaders()
    });
    return handleApiResponse(response);
  },

  addUser: async (formData: FormData) => {
    const headers = getAuthHeaders();
    // Don't set Content-Type for FormData - let browser set it with boundary
    

    const response = await fetch(`${API_URL}user/`, {
      method: 'POST',
      headers,
      body: formData
    });
    return handleApiResponse(response);
  },

  updateUser: async (id: number, formData: FormData) => {
    const headers = getAuthHeaders();
    

    const response = await fetch(`${API_URL}user/${id}/`, {
      method: 'PUT',
      headers,
      body: formData
    });
    return handleApiResponse(response);
  },

  deleteUser: async (id: number) => {
    const response = await fetch(`${API_URL}user/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleApiResponse(response);
  },

  // Company Management
  getCompanyInfo: async () => {
    const response = await fetch(`${API_URL}company/`, {
      headers: getAuthHeaders()
    });
    return handleApiResponse(response);
  },

  addCompanyInfo: async (data: object) => {
    const response = await fetch(`${API_URL}company/`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return handleApiResponse(response);
  },

  updateCompanyInfo: async (id: number, data: object) => {
    const response = await fetch(`${API_URL}company/${id}/`, {
      method: 'PUT',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return handleApiResponse(response);
  },

  deleteCompanyInfo: async (id: number) => {
    const response = await fetch(`${API_URL}company/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleApiResponse(response);
  }
};