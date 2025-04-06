'use client'

import { useState } from "react";
import Header from "../../components/header"
import SearchBar from "../../components/searchbar";
import ProtectedRoute from '../../components/auth/ProtectedRoute';

const machines = [
    { id: 1, name: "آلة A", type: "هيدروليكية" },
    { id: 2, name: "آلة B", type: "كهربائية" },
    { id: 3, name: "آلة C", type: "هوائية" },
  ];
  
  export default function stock(){
    const [filteredMachines, setFilteredMachines] = useState(machines);
  
    const handleSearch = (query: string) => {
      setFilteredMachines(
        machines.filter(
          (machine) =>
            machine.name.includes(query) || machine.type.includes(query)
        )
      );
    };
  

    return(
        <>
          <ProtectedRoute>
            <Header>
                <SearchBar onSearch={(query) => console.log("بحث:", query)} />
            </Header>
          </ProtectedRoute>
        </>
    )
}