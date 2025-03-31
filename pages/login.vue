<script lang="ts" setup>

    import { showNotification } from '@/utils/notificationService';
    import { useAuth } from '~/api/composables/useAuth';


    definePageMeta({
       //  layout: 'default',
      //  name: 'index',
       // alias: 'index',
        title: 'Login',
        description: 'Login page for unauthenticated users',
        navOrder: 1,
        type: 'primary',
        icon: 'i-mdi-home',
        middleware: 'guest',
        // ogImage: 'images/ogImage.png', // url or local images inside public folder, for eg, ~/public/images/ogImage.png
    })

    interface Credentials {
        email: string;
        password: string;
    }

   const { login, isAuthenticated } = useAuth();
   
    const config = useRuntimeConfig();
    const router = useRouter();

    const credentials: Credentials = reactive({
        email: "",
        password: "",
    });

    const error = ref<string>("");

    async function submit() {
        try {
            error.value = "";
            console.log("Login submit", credentials.email, credentials.password);
            await login(credentials.email, credentials.password, true);
            router.push(config.public.homeUrl);
        } catch (err: any) {
            error.value = err.message as string;

            showNotification({
                title: "Erreur",
                message: error.value,
                code: 4,
                duration: 4000
            });
        }
    }
</script>

<template>
    <div v-if="!isAuthenticated" class="bg-login">
        <div class="bg-b9 flex-c a-center j-center br-10 p-10 w-30 h-fit">
            <h1 class="c-w fs-15rem">OSSOLE login</h1>
            <form @submit.prevent="submit" class="flex-c a-center j-top bg-t w-90 h-fit">

                <label class="w-90 h-fit" for="email">Adresse email</label>
                <input id="email"
                       class="w-90 h-fit br-5 p-2 c-b7 mb-5"
                       v-model="credentials.email"
                       type="text"
                       placeholder="Votre email" />

                <label class="w-90 h-fit" for="password">Mot de passe</label>
                <NuxtLink to="/password-forgotten" class="c-b5 fs-10rem ml-auto">Mot de passe oublié ?</NuxtLink>
                <input id="password"
                       v-model="credentials.password"
                       type="password"
                       placeholder="Votre mot de passe"
                       class="w-90 h-fit br-5 p-2 c-b7 mb-10" />

                <div class="mid-button cursor-g w-90 h-20" @click="submit">SE CONNECTER</div>                
            </form>
        </div>
    </div>
</template>





<style scoped>
   
</style>
