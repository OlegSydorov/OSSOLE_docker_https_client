<script setup  lang="ts">
    import type AuthUser from '~/api/models/AuthUser';

    import { computed } from 'vue';
    import { useRoute } from 'vue-router';
    import { useAuth } from '~/api/composables/useAuth';
    import { useUser } from '~/api/composables/useUser';
    import { useApi } from '~/api/composables/useApi';


    import LogoutComponent from '~/components/LogoutComponent.vue';
    import UserIcon from '~/components/UserIcon.vue';
   


    //import FloatingMessage from '@/components/Custom/FloatingMessage.vue';
    const route = useRoute();
    const { isAuthenticated, logout } = useAuth();
    const { user, HasAccess } = useUser();
    const api = useApi();

    //const currUser: Ref<AuthUser> = ref<AuthUser>({
    //                                        id: 0,
    //                                        first_name: "Un",
    //                                        last_name: "Known",
    //                                        email: "unknown@unknown.unknown",
    //                                        role_id: 0,
    //                                        created_at: '',
    //                                        modified_at: ''});

    //const isHomeActive = computed(() => route.path.startsWith('/'));
    //const isBillingActive = computed(() => route.path.startsWith('/billing'));
    //const isInventoryActive = computed(() => route.path.startsWith('/inventory'));
    //const isUserActive = computed(() => route.path.startsWith('/user'));
    //const isAdminActive = computed(() => route.path.startsWith('/admin'));

    function handleLogoutEvent() {
        console.log("Logging out ....");
        logout();
    };
    const logoutComponent: Ref<LogoutComponent> = ref<LogoutComponent>(null);

    async function openLogoutComponent() {

        console.log("Open LogoutComponent, USER:", user.value);
        const userRoleResponse = await api.userservice.getRoleById(user.value?.role_id || 0);
        let roleName = userRoleResponse.UserRole.name;
        console.log(roleName);
        logoutComponent.value.setInitialData(user.value,roleName );
        logoutComponent.value.openForm();

    }

</script>

<template>
    <LogoutComponent ref="logoutComponent" :onLogoutEvent="handleLogoutEvent" />

    <div>
        <div v-if="isAuthenticated">

            <header class="bg-header">
                <img class="filler-image" src='~/assets/images/OSSOLE_logo_2.png' />
                <div class="pos-z-3 w-100 flex-r a-center j-center p-10 bg-t">
                    <p class=" f-13 c-font fw-bold fs-30rem bg-t"> OSSOLE</p>
                    <div class="f-1 flex-r a-bottom j-center bg-t">
                        <UserIcon class="h-fit ml-2 cursor-g" :user="user" :mode="'Connecté en tant que'" @click="openLogoutComponent"></UserIcon>
                    </div>
                    

                </div>
                <nav class="bg-t">
                    <div class="flex-r a-stretch j-stretch">

                        <NuxtLink to="/" class="menu-item">PAGE D'ACCUEIL</NuxtLink>

                        <NuxtLink to="/billing" class="menu-item"> FACTURES</NuxtLink>

                        <NuxtLink to='/inventory' class="menu-item">INVENTAIRE</NuxtLink>

                        <NuxtLink to='/clients' class="menu-item">CLIENTS</NuxtLink>

                        <NuxtLink to="/tasks" class="menu-item">TACHES</NuxtLink>

                        <NuxtLink to="/staff" class="menu-item">PERSONNEL</NuxtLink>

                    </div>
                </nav>
            </header>
        </div>
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </div>
</template>
