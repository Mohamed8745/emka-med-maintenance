"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash, FaPlus, FaTimes, FaUserShield, FaUserCog, FaUserEdit, FaUser, FaBuilding, FaIdCard, FaEnvelope } from "react-icons/fa";
import styles from "../../styles/UserManagement.module.css";
import userManagementService from "../../services/serviceManagement";

type User = {
  id: number;
  first_name: string;
  last_name: string;
  numidentif: string;
  numtel: string;
  email: string;
  role: string;
  image?: string | File;
};

type CompanyInfo = {
  id: number;
  nomuc: string;
  prenomuc: string;
  email: string;
  numidentifuc: string;
};

type Role = {
  value: string;
  label: string;
  icon: React.ReactNode;
};

const UserManagement = () => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showUserForm, setShowUserForm] = useState<boolean>(false);
  const [showCompanyForm, setShowCompanyForm] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingCompany, setEditingCompany] = useState<CompanyInfo | null>(null);

  const [newUser, setNewUser] = useState({
    first_name: '',
    last_name: '',
    numidentif: '',
    numtel: '',
    email: '',
    role: 'Operateur',
    password: '',
    confirmPassword: '',
    
  });

  const [newCompanyInfo, setNewCompanyInfo] = useState({
    nomuc: '',
    prenomuc: '',
    email: '',
    numidentifuc: ''
  });

  const roles: Role[] = [
    { value: 'Admin', label: 'Admin', icon: <FaUserShield /> },
    { value: 'Responsable', label: 'Responsable', icon: <FaUserCog /> },
    { value: 'Magasinier', label: 'Magasinier', icon: <FaUserEdit /> },
    { value: 'Operateur', label: 'Operateur', icon: <FaUser /> },
    { value: 'Technicien', label: 'Technicien', icon: <FaUser /> }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [usersData, companyData] = await Promise.all([
        userManagementService.getUsers(),
        userManagementService.getCompanyInfo()
      ]);
      
      setUsers(usersData || []);
      setCompanyInfo(companyData || []);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to fetch data");
      }
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const createFormData = (data: Record<string, any>): FormData => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }
    });
    return formData;
  };

  const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  const handleCompanyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCompanyInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setNewUser(prev => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const addUser = async () => {
    if (newUser.password !== newUser.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const formData = createFormData({
        ...newUser,
        confirmPassword: undefined
      });

      await userManagementService.addUser(formData);
      setShowUserForm(false);
      resetUserForm();
      await fetchData();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error adding user");
      }
      console.error("Add user error:", err);
    }
  };

  const addCompanyInfo = async () => {
    try {
      await userManagementService.addCompanyInfo({
        nomuc: newCompanyInfo.nomuc,
        prenomuc: newCompanyInfo.prenomuc,
        email: newCompanyInfo.email,
        numidentifuc: newCompanyInfo.numidentifuc
      });
      
      setShowCompanyForm(false);
      resetCompanyForm();
      await fetchData();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error adding company info");
      }
      console.error("Add company error:", err);
    }
  };

  const resetUserForm = () => {
    setNewUser({
      first_name: '',
      last_name: '',
      numidentif: '',
      numtel: '',
      email: '',
      role: 'Operateur',
      password: '',
      confirmPassword: '',
    });
  };

  const resetCompanyForm = () => {
    setNewCompanyInfo({
      nomuc: '',
      prenomuc: '',
      email: '',
      numidentifuc: ''
    });
  };

  const deleteUser = async (id: number) => {
    try {
      await userManagementService.deleteUser(id);
      await fetchData();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error deleting user");
      }
      console.error("Delete user error:", err);
    }
  };

  const deleteCompanyInfo = async (id: number) => {
    try {
      await userManagementService.deleteCompanyInfo(id);
      await fetchData();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error deleting company info");
      }
      console.error("Delete company error:", err);
    }
  };

  const startEditingUser = (user: User) => {
    setEditingUser({ ...user });
  };

  const startEditingCompany = (info: CompanyInfo) => {
    setEditingCompany({ ...info });
  };

  const handleEditUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editingUser) return;
    const { name, value } = e.target;
    setEditingUser(prev => ({ ...prev!, [name]: value }));
  };

  const handleEditCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingCompany) return;
    const { name, value } = e.target;
    setEditingCompany(prev => ({ ...prev!, [name]: value }));
  };

  const saveEditedUser = async () => {
    if (!editingUser) return;

    try {
      const formData = createFormData(editingUser);
      await userManagementService.updateUser(editingUser.id, formData);
      setEditingUser(null);
      await fetchData();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error updating user");
      }
      console.error("Update user error:", err);
    }
  };

  const saveEditedCompany = async () => {
    if (!editingCompany) return;

    try {
      await userManagementService.updateCompanyInfo(editingCompany.id, {
        nomuc: editingCompany.nomuc,
        prenomuc: editingCompany.prenomuc,
        email: editingCompany.email,
        numidentifuc: editingCompany.numidentifuc
      });
      setEditingCompany(null);
      await fetchData();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error updating company info");
      }
      console.error("Update company error:", err);
    }
  };

  const getRoleDisplay = (roleValue: string) => {
    const role = roles.find(r => r.value === roleValue);
    return (
      <span className={styles.roleDisplay}>
        {role?.icon} {role?.label}
      </span>
    );
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;


  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>User Management</h1>
        </header>

        {error && <p className={styles.error}>{error}</p>}

        {/* Floating Forms */}
        {showUserForm && (
          <div className={styles.floatingFormContainer}>
            <div className={styles.floatingForm}>
              <div className={styles.formHeader}>
                <h3>Add User</h3>
                <button className={styles.iconButton} onClick={() => setShowUserForm(false)}>
                  <FaTimes />
                </button>
              </div>
              <div className={styles.formContent}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>First Name</label>
                    <input
                      type="text"
                      name="first_name"
                      placeholder="First Name"
                      value={newUser.first_name}
                      onChange={handleUserInputChange}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="last_name"
                      placeholder="Last Name"
                      value={newUser.last_name}
                      onChange={handleUserInputChange}
                    />
                  </div>
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>ID Card</label>
                    <input
                      type="text"
                      name="numidentif"
                      placeholder="ID Card"
                      value={newUser.numidentif}
                      onChange={handleUserInputChange}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Phone</label>
                    <input
                      type="text"
                      name="numtel"
                      placeholder="Phone"
                      value={newUser.numtel}
                      onChange={handleUserInputChange}
                    />
                  </div>
                </div>
                
                <div className={styles.formGroup}>
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={handleUserInputChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Role</label>
                  <select
                    name="role"
                    value={newUser.role}
                    onChange={handleUserInputChange}
                  >
                    {roles.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Password</label>
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={newUser.password}
                      onChange={handleUserInputChange}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={newUser.confirmPassword}
                      onChange={handleUserInputChange}
                    />
                  </div>
                </div>
                
                <div className={styles.formGroup}>
                  <label>Choose Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                  />
                </div>
                
                <div className={styles.formActions}>
                  <button onClick={addUser}>Register</button>
                  <button className={styles.cancel} onClick={() => setShowUserForm(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showCompanyForm && (
          <div className={styles.floatingFormContainer}>
            <div className={styles.floatingForm}>
              <div className={styles.formHeader}>
                <h3>Add Company Info</h3>
                <button className={styles.iconButton} onClick={() => setShowCompanyForm(false)}>
                  <FaTimes />
                </button>
              </div>
              <div className={styles.formContent}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label><FaBuilding /> Company Name</label>
                    <input
                      type="text"
                      name="nomuc"
                      placeholder="Company Name"
                      value={newCompanyInfo.nomuc}
                      onChange={handleCompanyInputChange}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label><FaUser /> Contact First Name</label>
                    <input
                      type="text"
                      name="prenomuc"
                      placeholder="Contact First Name"
                      value={newCompanyInfo.prenomuc}
                      onChange={handleCompanyInputChange}
                    />
                  </div>
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label><FaEnvelope /> Email</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={newCompanyInfo.email}
                      onChange={handleCompanyInputChange}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label><FaIdCard /> Company ID</label>
                    <input
                      type="text"
                      name="numidentifuc"
                      placeholder="Company ID"
                      value={newCompanyInfo.numidentifuc}
                      onChange={handleCompanyInputChange}
                    />
                  </div>
                </div>
                
                <div className={styles.formActions}>
                  <button onClick={addCompanyInfo}>Save</button>
                  <button className={styles.cancel} onClick={() => setShowCompanyForm(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={styles.sectionsContainer}>
          <section className={styles.companySection}>
            <div className={styles.sectionHeader}>
              <h2>Company Information</h2>
              <button className={styles.iconButton} onClick={() => setShowCompanyForm(!showCompanyForm)}>
                <FaPlus />
              </button>
            </div>

            <table className={styles.table}>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Company Name</th>
                  <th>Contact First Name</th>
                  
                  <th>Company ID</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {companyInfo.map((info) => (
                  <tr key={info.id}>
                    {editingCompany?.id === info.id ? (
                      <>
                        <td>{info.id}</td>
                        <td>
                          <input
                            type="text"
                            name="nomuc"
                            value={editingCompany.nomuc}
                            onChange={handleEditCompanyChange}
                            className={styles.editInput}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="prenomuc"
                            value={editingCompany.prenomuc}
                            onChange={handleEditCompanyChange}
                            className={styles.editInput}
                          />
                        </td>
                        <td>
                          
                        </td>
                        <td>
                          <input
                            type="text"
                            name="numidentifuc"
                            value={editingCompany.numidentifuc}
                            onChange={handleEditCompanyChange}
                            className={styles.editInput}
                          />
                        </td>
                        <td>
                          <button className={styles.iconButton} onClick={saveEditedCompany}>
                            <FaEdit />
                          </button>
                          <button className={styles.iconButton} onClick={() => setEditingCompany(null)}>
                            <FaTimes />
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{info.id}</td>
                        <td>{info.nomuc}</td>
                        <td>{info.prenomuc}</td>
                        
                        <td>{info.numidentifuc}</td>
                        <td>
                          <button className={styles.iconButton} onClick={() => startEditingCompany(info)}>
                            <FaEdit />
                          </button>
                          <button className={styles.iconButton} onClick={() => deleteCompanyInfo(info.id)}>
                            <FaTrash />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className={`${styles.usersSection} ${styles.section}`}>
            <div className={styles.sectionHeader}>
              <h2>User Accounts</h2>
              <button className={styles.iconButton} onClick={() => setShowUserForm(!showUserForm)}>
                <FaPlus />
              </button>
            </div>

            <table className={styles.table}>
              <thead>
                <tr>
                  <th>No</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>ID Card</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    {editingUser?.id === user.id ? (
                      <>
                        <td>{user.id}</td>
                        <td>
                          <input
                            type="text"
                            name="first_name"
                            value={editingUser.first_name}
                            onChange={handleEditUserChange}
                            className={styles.editInput}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="last_name"
                            value={editingUser.last_name}
                            onChange={handleEditUserChange}
                            className={styles.editInput}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="numidentif"
                            value={editingUser.numidentif}
                            onChange={handleEditUserChange}
                            className={styles.editInput}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="numtel"
                            value={editingUser.numtel}
                            onChange={handleEditUserChange}
                            className={styles.editInput}
                          />
                        </td>
                        <td>
                          <input
                            type="email"
                            name="email"
                            value={editingUser.email}
                            onChange={handleEditUserChange}
                            className={styles.editInput}
                          />
                        </td>
                        <td>
                          <select
                            name="role"
                            value={editingUser.role}
                            onChange={handleEditUserChange}
                            className={styles.editInput}
                          >
                            {roles.map((role) => (
                              <option key={role.value} value={role.value}>
                                {role.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <button className={styles.iconButton} onClick={saveEditedUser}>
                            <FaEdit />
                          </button>
                          <button className={styles.iconButton} onClick={() => setEditingUser(null)}>
                            <FaTimes />
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{user.id}</td>
                        <td>{user.first_name}</td>
                        <td>{user.last_name}</td>
                        <td>{user.numidentif}</td>
                        <td>{user.numtel}</td>
                        <td>{user.email}</td>
                        <td>{getRoleDisplay(user.role)}</td>
                        <td>
                          <button className={styles.iconButton} onClick={() => startEditingUser(user)}>
                            <FaEdit />
                          </button>
                          <button className={styles.iconButton} onClick={() => deleteUser(user.id)}>
                            <FaTrash />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;