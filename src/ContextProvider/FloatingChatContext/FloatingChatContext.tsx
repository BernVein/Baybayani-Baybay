import { createContext, useContext, useState, ReactNode } from "react";

interface FloatingChatContextType {
	isOpen: boolean;
	openChat: () => void;
	closeChat: () => void;
	toggleChat: () => void;
}

const FloatingChatContext = createContext<FloatingChatContextType | null>(null);

export function FloatingChatProvider({ children }: { children: ReactNode }) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<FloatingChatContext.Provider
			value={{
				isOpen,
				openChat: () => setIsOpen(true),
				closeChat: () => setIsOpen(false),
				toggleChat: () => setIsOpen((prev) => !prev),
			}}
		>
			{children}
		</FloatingChatContext.Provider>
	);
}

export function useFloatingChat() {
	const ctx = useContext(FloatingChatContext);
	if (!ctx)
		throw new Error(
			"useFloatingChat must be used inside FloatingChatProvider",
		);
	return ctx;
}
