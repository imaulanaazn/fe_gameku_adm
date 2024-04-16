import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
// import { enqueueSnackbar } from 'notistack'

const withAuth = <P extends Record<string, unknown>>(WrappedComponent: React.ComponentType<P>) => {
    const Wrapper: React.FC<P> = (props) => {
        const router = useRouter();
        const { user, loading } = useAuth();

        useEffect(() => {
            if (!user && !loading) {
                // enqueueSnackbar('Silahkan untuk login terlebih dahulu', { variant: 'error' })
                const params = new URLSearchParams();
                const url = "https://cb2f-114-122-102-206.ngrok-free.app";
                const redirect = `${url}${router.asPath}`;
                params.append("redirect", redirect);
                router.push("/auth/login?" + params);
            }
        }, [user, loading]);

        if (loading) {
            return <p>Loading...</p>;
        }

        return <WrappedComponent {...props} />;
    };

    return Wrapper;
};

export { withAuth };
