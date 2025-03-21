'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
  token: string | null; // Add token state
  setToken: React.Dispatch<React.SetStateAction<string | null>>; // Add setToken function
  passengers: any[]; // Add passengers state
  setPassengers: React.Dispatch<React.SetStateAction<any[]>>; // Add setPassengers function
  selectedFlights: any; // Add selectedFlights state
  setSelectedFlights: any; // Add setSelectedFlights function
  searchData: any;
  setSearchData: any;
}

// Create a context with a default value
const AppContext = createContext<AppContextType | undefined>(undefined); // Create a context with a default value

// Create a provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [passengers, setPassengers] = useState<any[]>([]); 
  const [token, setToken] = useState<string | null>(typeof window !== "undefined" ? localStorage?.getItem('token') : ''); // Initialize token state from local storage
  const [selectedFlights, setSelectedFlights] = useState<any>({});
  const [searchData, setSearchData] = useState<{ origin: string; destination: string; cabinClass: string; isReturn: boolean }>({
    origin: '',
    destination: '',
    cabinClass: '',
    isReturn: false,
  });

  return ( 
    <AppContext.Provider value={{ passengers, setPassengers, selectedFlights, setSelectedFlights, searchData, setSearchData, token, setToken }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the AppContext
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
