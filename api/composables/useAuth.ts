import { useUser } from '~/api/composables/useUser';
import { useApi } from '~/api/composables/useApi';

export const useAuth = () => {
    console.log("useAuth executing ...");
    const router = useRouter();
    console.log("Router", router);
    const config = useRuntimeConfig();
    console.log("Config", config);

    const { authentication } = useApi();
    console.log("authentication", authentication);

    const { user } = useUser();
    console.log("USER");
    console.log(user);



    const isAuthenticated = computed(() => user.value !== null);
    console.log("USER", user);
    async function fetchUser(): Promise<any> {
        user.value = await authentication.user();
    };

    async function login(email: string, password: string, remember: true): Promise<any> {
        if (isAuthenticated.value === true) {
            return;
        }
        await authentication.login(email, password, remember);

        await fetchUser();

        await router.push(config.public.homeUrl);
    };

    async function register(name: string, email: string, password: string, password_confirmation: string): Promise<any> {
        await authentication.register(name, email, password, password_confirmation);
        await fetchUser();
        await router.push(config.public.homeUrl);
    };
    async function logout(): Promise<any> {
        if (isAuthenticated.value === false) {
            return;
        }
        console.log("useAuth.ts executing: logout method:");
        await authentication.logout();
        user.value = null;
        await router.push(config.public.loginUrl);
    }

    async function passwordForgotten(email: string): Promise<any> {        

        return await authentication.passwordForgotten(email);
    };

    async function passwordReset(
        token: string,
        email: string,
        password: string,
        password_confirmation: string): Promise<any> {
            
        await authentication.passwordReset(token,email,password,password_confirmation);
    }

    return {
        user,
        isAuthenticated,
        login,
        register,
        logout,
        passwordForgotten,
        passwordReset
    };
};
