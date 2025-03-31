<script lang="ts" setup>

    import { showNotification } from '@/utils/notificationService';
    import { useAuth } from '~/api/composables/useAuth';

    definePageMeta({
        // layout: 'default',
        // name: 'index',
        // alias: 'index',
        title: 'Mot de passe oublié',
        description: 'Sip, Savor, and Spark Ideas at Cafe Bella Vista!',
        navOrder: 1,
        type: 'primary',
        icon: 'i-mdi-home',
        middleware: 'guest',
        // ogImage: 'images/ogImage.png', // url or local images inside public folder, for eg, ~/public/images/ogImage.png
    })
    const { passwordForgotten } = useAuth();

    const config = useRuntimeConfig();
    const router = useRouter();
    const email = ref('');
    const emailVerified = ref(true);
    const redirectionShow = ref(false);


    interface Credentials {
        email: string;
        password: string;
    }

    const error = ref<string>("");

    async function submit() {
        if (emailCheck(email.value)) {
            emailVerified.value = true;
            try {
                error.value = "";
                console.log(email.value);
                const passwordForgottenResponse = await passwordForgotten(email.value);
                const responseCode = passwordForgottenResponse.code
                console.log(responseCode);
                if (responseCode == 201) {
                    redirectionShow.value = true;
                }
                showNotification({
                    title: "Succes",
                    message: "Un e-mail avec un lien de réinitialisation du mot de passe a été envoyé à votre adresse",
                    code: 2,
                    duration: 6000
                });
                //router.push(config.public.passwordResetUrl);
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
        else {
            emailVerified.value = false;
        }
    }

    function emailCheck(email: string): boolean {
        if (email.endsWith("@gatexinfo.ch")) {
            const emailHeader = email.split('@')[0];
            console.log(emailHeader);
            if (emailHeader.length>64 || emailHeader.length<1) {
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return false;
}
    }



</script>
<template>
    <div class="bg-login">
        <div v-if="redirectionShow==false" class="bg-b9 flex-c a-center j-center br-10 p-10 w-30 h-fit">
            <h1 class="c-w fs-15rem">OSSOLE mot du passe oublié</h1>
            <form @submit.prevent="submit" class="flex-c a-center j-top bg-t w-90 h-fit">
                <label class="w-90 h-fit" for="email">Adresse email</label>
                <input id="email"
                       class="w-90 h-fit br-5 p-2 c-b7 mb-5"
                       :class="{'validation-alert':!emailVerified}"
                       v-model="email"
                       type="text"
                       placeholder="Votre email" 
                       required/>
                <p v-if="emailVerified==false" class="c-alert">Email should be a valid GatexInfo SARL email!</p>
                <div class="flex-r p-2 bg-t">
                    <div class="mid-button h-90 w-40 cursor-g m-2" @click="submit">ENVOYER</div>
                    <div class="mid-button h-90 w-40 cursor-g m-2" @click="navigateTo('/login')">ANNULER</div>
                </div>
            </form>            
        </div>
        <div v-else class="bg-b9 flex-c a-center j-center br-10 p-10 w-30 h-fit">
            <h1 class="c-w fs-15rem">OSSOLE mot du passe oublié</h1>
            <div class="c-font bg-t flex-c a-cneter j-center">
                <p>
                    Un lien pour réinitialiser le mot de passe a été envoyé à l'adresse e-mail que vous avez fournie
                </p>
            </div>
        </div>
    </div>
</template>


<style scoped>
    .custom-content {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: none;
        height: 100vh;
    }

    .reset-password-box {
        padding: 20px;
        background: #312C63;
        border: 1px solid #4A4576;
        border-radius: 10px;
        width: 320px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .title {
        color: #fff;
        margin-bottom: 2rem;
    }

    .input-group {
        width: 100%;
        margin-bottom: 1rem;
    }

        .input-group label {
            display: block;
            color: #CCCCCC;
            margin-bottom: .1rem;
        }

        .input-group input {
            width: 250px;
            padding: .5rem;
            border-radius: 5px;
            border: none;
            margin-bottom: 0.5rem;
        }

    .reset-password-button {
        width: 120px;
        padding: .5rem 2rem;
        cursor: pointer;
        margin-top: 0.1rem;
    }


    .forgot-password {
        color: #4E9CAF;
        text-decoration: none;
        font-size: small;
        margin-left: auto;
        /* Place le lien à l'extrémité droite du conteneur */
    }

    .password-group label {
        color: #CCCCCC;
    }

    .password-group {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        margin-bottom: 0.1rem;
    }

    .button-group {
        display: flex;
        justify-content: space-between;
        /* Sépare les boutons */
        width: 100%;
    }
</style>