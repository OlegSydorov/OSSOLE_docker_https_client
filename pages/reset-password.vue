<script lang="ts" setup>
    import { ref } from 'vue';
    import {useRoute, useRouter} from 'vue-router';
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

    const { passwordReset } = useAuth();

    const config = useRuntimeConfig();
    const router = useRouter();
    const route = useRoute();
    const { email, token } = route.query;
    //const { token } = route.query;
    const form = reactive({
        email: email as string,
        token: token as string,
        password: '',
        password_confirmation: ''
    });
    const error = ref<string>("");

     const passwordConfirmationVerified = ref(true);
   //  const emailVerified = ref(true);


   
     async function submit() {         
         if (passwordConfirmationCheck()) {
             passwordConfirmationVerified.value = true;
           //  if (emailCheck(form.email)) {
            //     emailVerified.value = true;
                 try {
                     error.value = "";
                     console.log("password-reset page executing: data: ", form.token, form.email, form.password, form.password_confirmation);
                     console.log(route.query);
                     await passwordReset(form.token, form.email, form.password, form.password_confirmation);                                      
                     showNotification({
                         title: "Succes",
                         message: "Mot de passe réinitialisé avec succès !",
                         code: 2,
                         duration: 6000
                     });
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
            // } else
           //  {
            //     emailVerified.value = false;
           //  }
         }
         else          
         {
             passwordConfirmationVerified.value = false;             
         }         
     }

     function passwordConfirmationCheck(): boolean {         
         return form.password==form.password_confirmation?true:false;                 
     }
     

     /*function emailCheck(email: string): boolean {         
         if (email.endsWith("@gatexinfo.ch")) {
             const emailHeader = email.split('@')[0];
             console.log(emailHeader);             
             if (emailHeader.length>64 || emailHeader.length<1) {                 
                 return false;                 
             }else {                 
                 return true;                 
             }             
         }
         else          
         {             
             return false;             
         }         
     }*/



</script>

<template>
    <div class="bg-login">
        <div class="bg-b9 flex-c a-center j-center br-10 p-10 w-30 h-fit">
            <h1 class="c-w fs-15rem ta-center">
                OSSOLE 
            </h1>
            <h1 class="c-w fs-12rem ta-center mb-2">
                Réinitialisation du mot de passe
            </h1>
          
            <form @submit.prevent="submit" class="flex-c a-center j-top bg-t w-90 h-fit">
                <label class="w-90 h-fit" for="email">Adresse email</label>
        <!--<input id="email"
               class="w-90 h-fit br-5 p-2 c-b7 mb-5"
               :class="{'validation-alert':!emailVerified}"
               v-model="form.email"
               type="text"
               placeholder="Votre email"
               required />
        <p v-if="emailVerified==false" class="c-alert">Email should be a valid GatexInfo SARL email!</p>-->

                <label class="w-90 h-fit" for="password">Nouveau mot de passe</label>
                <input id="password"
                       class="w-90 h-fit br-5 p-2 c-b7 mb-5"
                       :class="{'validation-alert':!passwordConfirmationVerified}"
                       v-model="form.password"
                       type="password"
                       placeholder="Votre mot du passe"
                       required />
                <label class="w-90 h-fit" for="email">Confirmation</label>
                <input id="email"
                       class="w-90 h-fit br-5 p-2 c-b7 mb-5"
                       :class="{'validation-alert':!passwordConfirmationVerified}"
                       v-model="form.password_confirmation"
                       type="password"
                       placeholder="Confirmer votre mot du passe"
                       required />
                <p v-if="passwordConfirmationVerified==false" class="c-alert">Le mot de passe doit être confirmé!</p>


                <div class="flex-r p-2 bg-t">
                    <div class="mid-button h-90 w-40 cursor-g m-2" @click="submit">RÉINITIALISER</div>
                    <div class="mid-button h-90 w-40 cursor-g m-2" @click="navigateTo('/login')">ANNULER</div>
                </div>
            </form>

        </div>
    </div>
    <form @submit.prevent="handleSubmit">
        <input v-model="form.email" type="email" placeholder="Email">
        <input v-model="form.password" type="password" placeholder="Nouveau mot de passe">
        <input v-model="form.password_confirmation" type="password" placeholder="Confirmation">
        <button type="submit">Réinitialiser</button>
    </form>
</template>