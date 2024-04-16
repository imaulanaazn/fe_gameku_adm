import { useState, useEffect } from "react";

interface UserData {
    id: string;
    roleId: string;
    isRegistered: boolean;
    name: string;
    image: string | null; // Image bisa berupa string atau null
    email: string;
    mobileNumber: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export default UserData;

const useAuth = () => {
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [logoGasskeun, setLogoGasskeun] = useState<string | null>(null);

    const getMe = async () => {
        const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/reseller/me", {
            method: "GET",
            headers: {
                "ngrok-skip-browser-warning": "true",
            },
            credentials: "include",
        });
        const data = await req.json();
        return data;
    };

    const getLogo = async () => {
        const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/v1/config?type=logo", {
            method: "GET",
            headers: {
                "ngrok-skip-browser-warning": "true",
            },
            credentials: "include",
        });
        const data = await req.json();
        return data;
    };

    useEffect(() => {
        const authenticateUser = async () => {
            try {
                const logo = await getLogo();
                const userData = await getMe();
                if (!userData.errorCode) {
                    setUser(userData);
                }

                if (logo.length !== 0) {
                    setLogoGasskeun(logo[0].value);
                }
            } catch (error) {
                console.error("Error authenticating user:", error);
            } finally {
                setLoading(false);
            }
        };

        authenticateUser();
    }, []);

    return { user, loading, logoGasskeun };
};

export { useAuth };
