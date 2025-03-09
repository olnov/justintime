import { createContext, useState } from 'react';

export const SelectedIdsContext = createContext();

export const SelectedIdsProvider = ({ children }) => {
  const [selectedIds, setSelectedIds] = useState([]);
  return (
    <SelectedIdsContext.Provider value={{ selectedIds, setSelectedIds }}>
      {children}
    </SelectedIdsContext.Provider>
  );
};