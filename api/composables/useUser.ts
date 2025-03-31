import type AuthUser from "../models/AuthUser";

export const useUser = () => {
    const config = useRuntimeConfig();
    const user = useState<AuthUser | null>(config.public.api.userKey, () => null);

    function HasAccess(accessLevel: number) {
        return user.value.role_id <= accessLevel ? true : false;
    }

    return {
        user,
        HasAccess
    };
};
