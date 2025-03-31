<script setup lang="ts">
  
    const props = defineProps({
        dateTime: {
            type: String,
            default: '',
        },
        dateType: {
            type: String,
            default: '',
        },
    })

    const date = computed(() => {
        if (props.dateTime) {
            let convDate = new Date(props.dateTime.slice(0, 16));
            return convDate.toLocaleDateString(undefined, { day: 'numeric' }) + " " +
                convDate.toLocaleDateString(undefined, { month: 'long' }) + " " +
                convDate.toLocaleDateString(undefined, { year: 'numeric' });
        }
        else {
            return '-';
}
    })
    const time = computed(() => {
        if (props.dateTime) {
            let convDate = new Date(props.dateTime.slice(0, 16));
        return convDate.toLocaleTimeString(undefined, { hour: '2-digit' }) + ":" + convDate.toLocaleTimeString(undefined, { minute: '2-digit' });
        }
        else {
            return '-';
        }
    })

</script>

<template>
    <div class="dateBoxClass">
        <p v-if="props.dateType=='created'"> CREÉ:<br/>{{date}}</p>
        <p v-else-if="props.dateType=='modified'"> MODIFIÉ:<br/>{{date}}</p>
        <span class="tooltiptext" v-if="props.dateType=='created'"> Creé le {{date}} à {{time}}</span>
        <span class="tooltiptext" v-else-if="props.dateType=='modified'"> Modifié le {{date}} à {{time}}</span>
    </div>
</template>

<style scoped>
    .dateBoxClass {
        position: relative;
        width: fit-content;
        padding: 2px;
        border-radius: 8px;
        font-size:0.65rem;
        font-weight: bold;
        text-align:center;
        text-shadow: 0px 0px 3px white;
        background-color:lightskyblue;
        color:navy;
    }    

        /* Tooltip text */
        .dateBoxClass .tooltiptext {
            visibility: hidden;
            background-color: #18193a;
            color: white;
            padding: 1px;
            font-weight: normal;
            text-align: center;
            text-shadow: 0px 0px 0px transparent;
            border-radius: 2px;
            border: 1px solid #312c63;
            /* Position the tooltip text */
            position: absolute;
            z-index: 1;
            bottom: 95%;
            right: 1px;
            /*  margin-left: -60px;*/
            /* Fade in tooltip */
            opacity: 0;
            transition: opacity 0.3s;
        }

        /* Show the tooltip text when you mouse over the tooltip container */
        .dateBoxClass:hover .tooltiptext {
            visibility: visible;
            opacity: 1.0;
        }

</style>
