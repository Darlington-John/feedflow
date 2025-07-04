"use client";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { user_type } from "~/lib/types/user";

interface AuthContextType {
  user: user_type | null;
  setUser: React.Dispatch<React.SetStateAction<user_type | null>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  hasError?: boolean;
  error?: string;
}
export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<user_type | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState("");
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      const setCustomCookie = async () => {
        try {
          const res = await fetch("/api/auth/custom");
          if (!res.ok) {
            console.error("Failed to set custom cookie.");
            return;
          }
        } catch (error) {
          console.error("Error setting custom cookie:", error);
        }
      };

      const dispatch = async () => {
        try {
          const res = await fetch("/api/user");
          if (!res.ok) {
            return;
          }

          window.dispatchEvent(new CustomEvent("userUpdated"));
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      const runFunctionsInOrder = async () => {
        await setCustomCookie();
        await dispatch();
      };

      runFunctionsInOrder().catch((error) => console.error("Error", error));
    }
  }, [session]);
  const clearCookies = () =>
    fetch("/api/auth/clear-cookies", {
      method: "POST",
    }).catch((err) => console.error("Error clearing cookies:", err));

  const pathname = usePathname();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user", {
          credentials: "include",
        });
        const data = await res.json();

        if (!res.ok) {
          clearCookies().catch((error) => console.error("Error", error));
          setUser(null);
          setError(data.error);
          setHasError(true);
          return;
        }

        setUser(data.user);
      } catch (err) {
        clearCookies().catch((error) => console.error(`Error  ${err}`, error));
        setUser(null);
        setError(err as string);
        setHasError(true);
      } finally {
        setLoading(false);
      }
    };

    (async () => {
      await fetchUser().catch((error) => console.error("Error", error));
    })();
    const handleUserUpdated = () => {
      fetchUser().catch((error) => console.error("Error", error));
    };

    window.addEventListener("userUpdated", handleUserUpdated);

    return () => {
      window.removeEventListener("userUpdated", handleUserUpdated);
    };
  }, [pathname]);
  const providerValue = useMemo(
    () => ({
      user,
      loading,
      setUser,
      error,
      setLoading,
      hasError,
    }),
    [user, loading, setUser, setLoading, hasError, error]
  );

  return (
    <AuthContext.Provider value={providerValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("Context must be used within a Provider");
  }
  return context;
};
