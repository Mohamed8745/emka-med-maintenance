"use client";

import { useState } from "react";
import Header from "../../components/header";
import SearchBar from "../../components/searchbar";
import ProtectedRoute from "../../components/auth/ProtectedRoute";

const machines = [
  { id: 1, name: "آلة A", type: "هيدروليكية" },
  { id: 2, name: "آلة B", type: "كهربائية" },
  { id: 3, name: "آلة C", type: "هوائية" },
];

export default function Dashboard() {
  const [filteredMachines, setFilteredMachines] = useState(machines);

  const handleSearch = (query: string) => {
    setFilteredMachines(
      machines.filter(
        (machine) =>
          machine.name.includes(query) || machine.type.includes(query)
      )
    );
  };

  return (
    <ProtectedRoute>
      <Header>
        <SearchBar onSearch={handleSearch} />
      </Header>
      <div style={{ padding: "20px" }}>
        <h2>قائمة الآلات</h2>
        {filteredMachines.length > 0 ? (
          <ul>
            {filteredMachines.map((machine) => (
              <li key={machine.id}>
                {machine.name} - {machine.type}
              </li>
            ))}
          </ul>
        ) : (
          <p>لا توجد آلات مطابقة للبحث.</p>
        )}
      </div>
    </ProtectedRoute>
  );
}