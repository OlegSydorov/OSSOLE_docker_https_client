<script setup lang="ts">
    import type AuthUser from '~/api/models/AuthUser';
    import type UserRole from '~/api/models/UserRole';
    import {useApi} from '~/api/composables/useApi';
    


    definePageMeta({
        //  layout: 'default',
        //  name: 'index',
        //  alias: 'index',
        title: 'Personnel',
        description: 'Sip, Savor, and Spark Ideas at Cafe Bella Vista!',
        navOrder: 1,
        type: 'primary',
        icon: 'i-mdi-home',
        accessLevel: 4,
        middleware: 'auth',
        // ogImage: 'images/ogImage.png', // url or local images inside public folder, for eg, ~/public/images/ogImage.png
    })

 
    const api = useApi();
 

 const {
     data: users,
     pending: pendingUser,
     error: errorUsers,
     refresh: refreshUsers
 } = await useAsyncData("users", async () => {
     console.log("Sending request to fetch all users");
     var usersResponse = await api.userservice.getAllUsers();

     console.log("MOUNTED users", usersResponse.Users);
     return usersResponse.Users;
 });


</script>
<template>
    <div class="w-100 h-90 p-2 bg-b9">
        <div v-if="users" class="w-100 h-100 br-5 b-secondaryLight p-2 bg-t flex-rw j-top a-top">
            <div v-for="(user, index) in users" :key="`entry-${user.id}`" class="user-box">
                
                    <div v-if="user.role_id==1" class="f-3 bg-red c-shadow m-2 p-2"><br /><p>Monthly accomplished work chart</p><br /></div>
                    <div v-else-if="user.role_id==2" class="f-3 bg-orange c-shadow m-2 p-2"><br /><p>Monthly accomplished work chart</p><br /></div>
                    <div v-else-if="user.role_id==3" class="f-3 bg-blue c-shadow m-2 p-2"><br /><p>Monthly accomplished work chart</p><br /></div>
                    <div v-else-if="user.role_id==4" class="f-3 bg-yellow c-shadow m-2 p-2"><br /><p>Monthly accomplished work chart</p><br /></div>
                    <div v-else-if="user.role_id==5" class="f-3 bg-green c-shadow m-2 p-2"><br /><p>Monthly accomplished work chart</p><br /></div>
                    <div v-else class="bg-grey"></div>
                    <div class="f-1 flex-c a-top j-top">
                        <label >Prenom: <span class="fw-bold">{{user.first_name}}</span></label>
                        <label >Nom: <span class="fw-bold">{{user.last_name}}</span></label>
                        <label >Email: <span class="fw-bold">{{user.email}}</span></label>
                        <label >Role: <span class="fw-bold">{{user.user_role.name}}</span></label>
                    </div>
              
                
            </div>

        </div>
        
    </div>
</template>
<style scoped>
    .user-box {
        width:33%;       
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        align-content: start;
        justify-content: end;
        border: 2px solid #55C4FF;
        padding: 2px;
        margin: 2px;
        color: #94FF00;
    }

        .user-box:hover {
            background-color: #394f90;
            text-shadow: 0px 0px 3px black;
           
        }

        .user-box:active {
            background-color: #394f90;
            text-shadow: 0px 0px 3px black;
            border: 2px solid white;
            color:white;

        }
</style>
