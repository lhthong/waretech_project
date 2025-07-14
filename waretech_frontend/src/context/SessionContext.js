import { createContext, useContext, useState } from "react";

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [expiredSession, setExpiredSession] = useState(false);

  const showExpiredSession = () => setExpiredSession(true);
  const hideExpiredSession = () => setExpiredSession(false);

  return (
    <SessionContext.Provider
      value={{ expiredSession, showExpiredSession, hideExpiredSession }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
