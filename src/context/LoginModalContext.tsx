import { createContext, useContext, useState, ReactNode } from "react";

interface LoginModalContextType {
	isLoginModalOpen: boolean;
	openLoginModal: () => void;
	closeLoginModal: () => void;
}

const LoginModalContext = createContext<LoginModalContextType>({
	isLoginModalOpen: false,
	openLoginModal: () => {},
	closeLoginModal: () => {},
});

export function LoginModalProvider({ children }: { children: ReactNode }) {
	const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

	const openLoginModal = () => setIsLoginModalOpen(true);
	const closeLoginModal = () => setIsLoginModalOpen(false);

	return (
		<LoginModalContext.Provider
			value={{ isLoginModalOpen, openLoginModal, closeLoginModal }}
		>
			{children}
		</LoginModalContext.Provider>
	);
}

export const useLoginModal = () => useContext(LoginModalContext);
