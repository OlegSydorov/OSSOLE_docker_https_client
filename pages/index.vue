<script setup lang="ts">
    definePageMeta({
      //  layout: 'default',
      //  name: 'index',
      //  alias: 'index',
        title: 'Home page',
        description: 'Sip, Savor, and Spark Ideas at Cafe Bella Vista!',
        navOrder: 1,
        type: 'primary',
        icon: 'i-mdi-home',
        middleware: 'auth',
        accessLevel: 5,
        // ogImage: 'images/ogImage.png', // url or local images inside public folder, for eg, ~/public/images/ogImage.png
    })

    const staffRep = ref([
        { full: 'Ylber Gaçaferi', short: 'Y' },
        { full: 'Ivan Da Silva Guedes', short: 'I' },
        { full: 'Nicolas Treuthardt', short: 'N' },
        { full: 'Kenny Gaçaferi', short: 'K' },
        { full: 'Monika Lopes', short: 'M' },
        { full: 'Vasko Guimaraes', short: 'V' },
        { full: 'Younes Bagherieh', short: 'Y' },
        { full: 'Oleg Sydorov', short: 'O' },
        { full: "Bienvenue sur 'OSSOLE' - une application sur mesure pour GatexInfo SARL!", short: 'OSSOLE' }
    ]);

    const staff = ref(['Y', 'I', 'N', 'K', 'M', 'V', 'Y', 'O', 'OSSOLE']);

    function changeTxtFull(index:number) {
        staff.value[index] = staffRep.value[index].full;
    }

    function changeTxtShort(index: number) {
        staff.value[index] = staffRep.value[index].short;
    }
</script>
<template>
    <div class="w-100 h-100 flex-r a-center j-center p-10 bg-b10">
        <br />
        <div class="start-container">
            <div class="logo-grid-item-1">
                <div class="start-container-inner" @mouseenter="changeTxtFull(0)" @mouseleave="changeTxtShort(0)">{{staff[0]}}</div>
            </div>
            <div class="logo-grid-item-2">
                <div class="start-container-inner" @mouseenter="changeTxtFull(1)" @mouseleave="changeTxtShort(1)">{{staff[1]}}</div>
            </div>
            <div class="logo-grid-item-3">
                <div class="start-container-inner" @mouseenter="changeTxtFull(2)" @mouseleave="changeTxtShort(2)">{{staff[2]}}</div>
            </div>
            <div class="logo-grid-item-4">
                <div class="start-container-inner" @mouseenter="changeTxtFull(3)" @mouseleave="changeTxtShort(3)">{{staff[3]}}</div>
            </div>
            <div class="logo-grid-item-5">
                <div  class="start-container-inner" @mouseenter="changeTxtFull(8)" @mouseleave="changeTxtShort(8)">{{staff[8]}}</div>
            </div class="logo-grid-item">
            <div class="logo-grid-item-6">
                <div class="start-container-inner" @mouseenter="changeTxtFull(4)" @mouseleave="changeTxtShort(4)">{{staff[4]}}</div>
            </div>
            <div class="logo-grid-item-7">
                <div class="start-container-inner" @mouseenter="changeTxtFull(5)" @mouseleave="changeTxtShort(5)">{{staff[5]}}</div>
            </div>
            <div class="logo-grid-item-8">
                <div class="start-container-inner" @mouseenter="changeTxtFull(6)" @mouseleave="changeTxtShort(6)">{{staff[6]}}</div>
            </div>
            <div class="logo-grid-item-9">
                <div class="start-container-inner" @mouseenter="changeTxtFull(7)" @mouseleave="changeTxtShort(7)">{{staff[7]}}</div>
            </div>
            
            </div>
        </div>
    
</template>
<style scoped></style>
