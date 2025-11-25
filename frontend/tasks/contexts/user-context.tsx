"use client";

import { createContext, ReactNode, use } from "react";

export type UserType = {
	id: string;
	name: string;
	email: string;
};

const UserContext = createContext<UserType | null>(null);

export function useUserContext() {
	const context = use(UserContext);
	if (!context) {
		throw new Error("useTasksContext must be used within UserProvider");
	}
	return context;
}
export default function UserProvider({ children, user }: { children: ReactNode; user: UserType }) {
	return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
