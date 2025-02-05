'use client';

import { Nullable } from '@/interfaces/nullable';
import { ITicket } from '@/interfaces/ticket';
import { IUser } from '@/interfaces/user';
import { createContext, ReactNode, useState } from 'react';

interface IAppContext {
  tickets: ITicket[];
  onTicketAdded: (ticket: ITicket) => void;
  currentUser: Nullable<IUser>;
  setUser: (user: Nullable<IUser>) => void;
}

export const AppContext = createContext<IAppContext>({
  tickets: [],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onTicketAdded: (ticket: ITicket) => {},
  currentUser: null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setUser: (user: Nullable<IUser>) => {},
});

export function AppContextProvider({
  tickets: firstTickets,
  currentUser,
  children,
}: Readonly<{
  currentUser: Nullable<IUser>;
  tickets: ITicket[];
  children: ReactNode;
}>) {
  const [user, setUser] = useState(currentUser);
  const [tickets, setTickets] = useState(firstTickets);

  const onTicketAdded = (ticket: ITicket) => {
    setTickets([...tickets, ticket]);
  };

  const contextValue = {
    tickets,
    onTicketAdded,
    currentUser: user,
    setUser,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}
