import { useAuth } from '~/api/composables/useAuth';
import { useUser } from '~/api/composables/useUser';

export default defineNuxtRouteMiddleware((to, from) => {

    console.log('Middleware executing...');

    const auth = useAuth();
    console.log('Auth:', auth);
    const { isAuthenticated } = auth || {};

    //const { isAuthenticated } = useAuth();
    const config = useRuntimeConfig();

    if (isAuthenticated.value === false) {
        console.log("auth.ts redirecting to LOGIN");
        return navigateTo(config.public.loginUrl, { replace: true });
    }

    const accessLevel = to.meta.accessLevel as number;

    const user = useUser();
    console.log('Auth.ts USER:', user.user.value);

    const { HasAccess } = user || {};
   // const { HasAccess } = useUser();

    if (!HasAccess(accessLevel)) {
        console.log('Accès interdit');
        return navigateTo('/', { replace: true });
    }
});
