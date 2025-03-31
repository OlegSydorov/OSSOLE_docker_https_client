<script setup lang="ts">
    import { ref, onMounted, nextTick } from 'vue';
    import { showNotification } from '@/utils/notificationService';
    import type NinjaOneOrganization from '~/api/models/NinjaOne/NinjaOneOrganization';
    import type NinjaOneLocation from '~/api/models/NinjaOne/NinjaOneLocation';
    import type NinjaOneTicket from '~/api/models/NinjaOne/NinjaOneTicket';
    import type NinjaOneIntervention from '~/api/models/NinjaOne/NinjaOneIntervention';
    import type NinjaOneStatus from '~/api/models/NinjaOne/NinjaOneStatus';
    import type NinjaOneUser from '~/api/models/NinjaOne/NinjaOneUser';
    import ConfirmDialogue from '@/components/ConfirmDialogue.vue';
    import CustomListView from '~/components/CustomListView.vue';
    import FloatingMessage from '@/components/FloatingMessage.vue';
    import {useApi} from '~/api/composables/useApi';
    import {useUser} from '~/api/composables/useUser';

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
    const api=useApi();
    const {user}=useUser();
    const confirmationDialog = ref(null);
    const onHold = ref(true);

    const gridViewSelected = ref(false);
    const tableViewSelected = ref(true);
    const taskTypeSelected = ref('Ticket');

    const searchQuery = ref('');
    const selectedOrganization: Ref<NinjaOneOrganization> = ref<NinjaOneOrganization>({
        ID: 0, Name: '', Description: '', Locations: [],
        Tickets: [], Projects: [],Dev:[], Web:[],
        OnContract: 0,
        TicketCount: 0, TicketClosedCount: 0, TicketInterventionCount: 0, TicketInvoicedInterventionCount: 0, TicketHourCount: 0, TicketInvoicedHourCount: 0, TicketFieldTripCount: 0,
        ProjectCount: 0, ProjectClosedCount: 0, ProjectInterventionCount: 0, ProjectInvoicedInterventionCount: 0, ProjectHourCount: 0, ProjectInvoicedHourCount: 0, ProjectFieldTripCount: 0,
        WebCount: 0, WebClosedCount: 0, WebInterventionCount: 0, WebInvoicedInterventionCount: 0, WebHourCount: 0, WebInvoicedHourCount: 0, WebFieldTripCount: 0,
        DevCount: 0, DevClosedCount: 0, DevInterventionCount: 0, DevInvoicedInterventionCount: 0, DevHourCount: 0, DevInvoicedHourCount: 0, DevFieldTripCount: 0        
    });
    
    const months = ref(["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]);
    const currYear = ref((new Date()).getFullYear());
    const currMonthOrd = ref((new Date()).getMonth());
    const currMonth = ref('');

   const organizations: Ref<NinjaOneOrganization[]> = ref([]);

    onMounted(() => {
        console.log(`the component is now mounted.`);
        currYear.value = (new Date()).getFullYear();
        currMonthOrd.value = (new Date()).getMonth();
        currMonth.value = months.value[Number(currMonthOrd.value)];
        console.log(currMonthOrd.value, currMonth.value, currYear.value);       
        refreshOrganizations();
    })

   // organizations array with tickets and interventions loaded from NinjaOne for current year and month (during DOM mounting)
  /*  const {
        data: organizations,
        pending: pendingOrganizations,
        error: errorOrganizations,
        refresh: refreshOrganizations
    } = await useAsyncData("ninjaOne", async () => {
       onHold.value = true;
        var tempData = await api.invoice.getOrganizationsWithTickets((currYear.value).toString(), (currMonthOrd.value + 1).toString());
               // onHold.value = true;
                console.log("MOUNTED organizations", tempData.organizations);
                onHold.value = false;
                //console.log("ON HOLD GIF ", onHold.value);
                //console.log(onHold.value);
            
        return tempData.organizations;
    });*/

    async function refreshOrganizations() {
        onHold.value = true;
        var tempData = await api.invoice.getOrganizationsWithTickets((currYear.value).toString(), (currMonthOrd.value + 1).toString());
       // console.log("MOUNTED organizations", tempData.organizations);
       // organizations.value = tempData.organizations;
        console.log("MOUNTED organizations", tempData.organizations);
        organizations.value = tempData.organizations;
        onHold.value = false;
    }   

    // save intervention to DB - either create new or update
    // in case of success - update selectedOrganization (counts, tickets/projects and intervention itself) 
    // and update organizations list
    async function updateOrganization(intervention: NinjaOneIntervention)
    {
        try
        {
            const intreventionUpdateResponse = await api.invoice.changeIntervention(intervention);
            console.log("INTERVENTION UPDATE RESPONSE", intreventionUpdateResponse);
            console.log("INTERVENTION UPDATE RESPONSE code", intreventionUpdateResponse.code);
            if (intreventionUpdateResponse.code == 200)
            {
                showNotification({
                    title: intreventionUpdateResponse.header,
                    message: intreventionUpdateResponse.message,
                    code: 1,
                    actionMessage: "Intervention mise à jour",

                });

                if (intervention.IsInvoiced)
                {
                    if (intervention.TicketCode.startsWith('T'))
                    {
                        selectedOrganization.value.TicketInvoicedInterventionCount++;
                        selectedOrganization.value.TicketInvoicedHourCount += intervention.TimeTracked;
                        for (let p of selectedOrganization.value.Tickets)
                        {
                            if (p.Code == intervention.TicketCode)
                            {
                                p.TotalTimeInvoiced += intervention.TimeTracked;
                                for (let int of p.Interventions)
                                {
                                    if (int.ID == intervention.ID)
                                    {
                                        int.IsInvoiced = true;
                                    }
                                }
                            }
                        }
                    }
                    else if (intervention.TicketCode.startsWith('P'))
                    {
                        selectedOrganization.value.ProjectInvoicedInterventionCount++;
                        selectedOrganization.value.ProjectInvoicedHourCount += intervention.TimeTracked;
                        for (let p of selectedOrganization.value.Projects)
                        {
                            if (p.Code == intervention.TicketCode)
                            {
                                p.TotalTimeInvoiced += intervention.TimeTracked;
                                for (let int of p.Interventions)
                                {
                                    if (int.ID == intervention.ID)
                                    {
                                        int.IsInvoiced = true;
                                    }
                                }
                            }
                        }
                    }
                    else if (intervention.TicketCode.startsWith('W')) {
                        selectedOrganization.value.WebInvoicedInterventionCount++;
                        selectedOrganization.value.WebInvoicedHourCount += intervention.TimeTracked;
                        for (let p of selectedOrganization.value.Web) {
                            if (p.Code == intervention.TicketCode) {
                                p.TotalTimeInvoiced += intervention.TimeTracked;
                                for (let int of p.Interventions) {
                                    if (int.ID == intervention.ID) {
                                        int.IsInvoiced = true;
                                    }
                                }
                            }
                        }
                    }
                    else if (intervention.TicketCode.startsWith('D')) {
                        selectedOrganization.value.DevInvoicedInterventionCount++;
                        selectedOrganization.value.DevInvoicedHourCount += intervention.TimeTracked;
                        for (let p of selectedOrganization.value.Dev) {
                            if (p.Code == intervention.TicketCode) {
                                p.TotalTimeInvoiced += intervention.TimeTracked;
                                for (let int of p.Interventions) {
                                    if (int.ID == intervention.ID) {
                                        int.IsInvoiced = true;
                                    }
                                }
                            }
                        }
                    }
                }
                else
                {
                    if (intervention.TicketCode.startsWith('T'))
                    {
                        selectedOrganization.value.TicketInvoicedInterventionCount--;
                        selectedOrganization.value.TicketInvoicedHourCount -= intervention.TimeTracked;
                        for (let p of selectedOrganization.value.Tickets) {
                            if (p.Code == intervention.TicketCode) {
                                p.TotalTimeInvoiced -= intervention.TimeTracked;
                                for (let int of p.Interventions) {
                                    if (int.ID == intervention.ID) {
                                        int.IsInvoiced = false;
                                    }
                                }
                            }
                        }
                    }
                    else if (intervention.TicketCode.startsWith('P')) {
                        selectedOrganization.value.ProjectInvoicedInterventionCount--;
                        selectedOrganization.value.ProjectInvoicedHourCount -= intervention.TimeTracked;
                        for (let p of selectedOrganization.value.Projects) {
                            if (p.Code == intervention.TicketCode) {
                                p.TotalTimeInvoiced -= intervention.TimeTracked;
                                for (let int of p.Interventions) {
                                    if (int.ID == intervention.ID) {
                                        int.IsInvoiced = false;
                                    }
                                }
                            }
                        }
                    }
                    else if (intervention.TicketCode.startsWith('W')) {
                        selectedOrganization.value.WebInvoicedInterventionCount--;
                        selectedOrganization.value.WebInvoicedHourCount -= intervention.TimeTracked;
                        for (let p of selectedOrganization.value.Web) {
                            if (p.Code == intervention.TicketCode) {
                                p.TotalTimeInvoiced -= intervention.TimeTracked;
                                for (let int of p.Interventions) {
                                    if (int.ID == intervention.ID) {
                                        int.IsInvoiced = false;
                                    }
                                }
                            }
                        }
                    }
                    else if (intervention.TicketCode.startsWith('D')) {
                        selectedOrganization.value.DevInvoicedInterventionCount--;
                        selectedOrganization.value.DevInvoicedHourCount -= intervention.TimeTracked;
                        for (let p of selectedOrganization.value.Dev) {
                            if (p.Code == intervention.TicketCode) {
                                p.TotalTimeInvoiced -= intervention.TimeTracked;
                                for (let int of p.Interventions) {
                                    if (int.ID == intervention.ID) {
                                        int.IsInvoiced = false;
                                    }
                                }
                            }
                        }
                    }
                }
                for (let org of organizations.value) {
                    if (org.ID == selectedOrganization.value.ID) {
                        org = selectedOrganization.value;
                    }
                }
                
            } else
            {
                showNotification({
                    title: intreventionUpdateResponse.header,
                    message: intreventionUpdateResponse.message,
                    code: 2,
                    actionMessage: "Sauvegarde non effectué",
                    duration: 1000
                });
            }
        }
        catch (err)
        {
            showNotification({
                title: "Erreur critique",
                message: err,
                actionMessage: "Modification non effectuée",
                code: 4,
                duration: 4000
            });
        }
    }
    type mapT = keyof typeof selectedOrganization.value

    // custom sort organizations depending on which column header is clicked
    function organizationsSort(sortParameter: string = 'none') {
        switch (sortParameter) {
            case "name":
                organizations.value.sort(function (a: NinjaOneOrganization, b: NinjaOneOrganization) {
                    let x = a.Name.toLowerCase();
                    let y = b.Name.toLowerCase();
                    if (x < y) { return -1; }
                    if (x > y) { return 1; }
                    return 0;
                });
                break;
            case "total":
                organizations.value.sort(function (a: NinjaOneOrganization, b: NinjaOneOrganization) {                   
                    return Number(b[hrs.value as mapT]) - Number(a[hrs.value as mapT]);                   
                });
                break;
            case "uninvoiced":
                organizations.value.sort(function (a: NinjaOneOrganization, b: NinjaOneOrganization) {
                    return (Number(b[hrs.value as mapT]) - Number(b[hrsInv.value as mapT])) - (Number(a[hrs.value as mapT]) - Number(a[hrsInv.value as mapT]));  
                });
                break;
            case "invoiced":
                organizations.value.sort(function (a: NinjaOneOrganization, b: NinjaOneOrganization) { 
                    return Number(b[hrsInv.value as mapT]) - Number(a[hrsInv.value as mapT]);
                });
                break;
            case "trip":
                console.log('sort by field trips');
                organizations.value.sort(function (a: NinjaOneOrganization, b: NinjaOneOrganization) {     
                  //  console.log(Number(b[fieldTrips.value as mapT]) - Number(b[fieldTrips.value as mapT]));
                    return Number(b[fieldTrips.value as mapT]) - Number(a[fieldTrips.value as mapT]);
                });              
                break;
            default:
                organizations.value.sort(function (a: NinjaOneOrganization, b: NinjaOneOrganization) {
                    let x = a.Name.toLowerCase();
                    let y = b.Name.toLowerCase();
                    if (x < y) { return -1; }
                    if (x > y) { return 1; }
                    return 0;
                });
                break;
        }
        return organizations;
    }

    //variable containing a list of organizationa FILTERED against several parameters: NAME, TICKET TYPE
    const filteredOrganizations = computed(() => {
        
        if (organizations.value) {
            console.log("MATCH expressions:", taskTypeSelected.value);
            
            return organizations.value.filter((organization: NinjaOneOrganization) => {

                // Filtering by name
                const organizationNameForFiltering = organization.Name.toLowerCase();                
                const searchLower = searchQuery.value.toLowerCase();
                const matchesTitle = organizationNameForFiltering.includes(searchLower);

                // Filtering by ticket type - ticket/project/web/dev
                let matchesTaskType = Number(organization[items.value as mapT]) > 0;

               // console.log("MATCH expressions:", searchLower, ticketViewSelected.value);
                //console.log("MATCH filters", matchesTitle, matchesTicketType);

                // The entity should match all filters to be included in the list
                return matchesTitle && matchesTaskType;
            });
        }
        return [];
    });


    //show next or previous month depending on what user selected and load ninjaOne data for respective month
    function changePeriod(direction: string) {
        onHold.value = true;
        console.log(onHold.value);
        switch (direction) {
            case "forward":
                switch (currMonthOrd.value) {
                    case 11:
                        currMonthOrd.value = 0;
                        currYear.value = currYear.value + 1;
                        break;
                    default:
                        currMonthOrd.value = currMonthOrd.value + 1;
                        currYear.value = currYear.value;
                }
                break;
            case "backward":
                switch (currMonthOrd.value) {
                    case 0:
                        currMonthOrd.value = 11;
                        currYear.value = currYear.value - 1;
                        break;
                    default:
                        currMonthOrd.value = currMonthOrd.value - 1;
                        currYear.value = currYear.value;
                }
                break;
        }

        currMonth.value = months.value[Number(currMonthOrd.value)];
        refreshOrganizations();
        closeDetail();
       
    }   
 
    const detailsShown = ref(false);
    const lineDetailRef = ref({});

    const invoiceCode = ref('');
    type T = keyof typeof lineDetailRef.value;

    //show details section populating it with selected organization data
    function itemClick(item: NinjaOneOrganization, detailRef: number = 0) {
       resetDetailViewData();
   selectedOrganization.value = item;       
   console.log("Selected item", item);
     //   console.log("AuthUser: ", user.value);
        if (gridViewSelected.value) {
            detailsShown.value = true;
        }
        else if (tableViewSelected.value) {

            for (let line in lineDetailRef.value) {
                console.log(line, typeof line, lineDetailRef.value[line as T]);
                lineDetailRef.value[line as T]?.setAttribute('style', 'display: none;');
            }
            const index = taskTypeSelected.value+"_" + detailRef;
            console.log(index);
            lineDetailRef.value[index as T].setAttribute('style', 'display: block;');
        }       
    }   
    
    
    const tableDataView=ref(false);


    function tableItemClick(item: NinjaOneOrganization, detailRef: number = 0){
                     
         
         for (let line in lineDetailRef.value) {             
             console.log(line, typeof line, lineDetailRef.value[line as T]);
             lineDetailRef.value[line as T]?.setAttribute('style', 'display: none;');
         }         
         if (tableDataView.value){
              if (selectedOrganization.value.ID==item.ID){                  
                  resetDetailViewData();                   
                  tableDataView.value=!tableDataView.value;             
              }
              else{                           
                   const index = taskTypeSelected.value+"_" + detailRef;                               
                   console.log(index);                               
                   lineDetailRef.value[index as T].setAttribute('style', 'display: block;');
                  selectedOrganization.value = item;                                   
              }
         }         
         else{
            selectedOrganization.value = item;       
            const index = taskTypeSelected.value+"_" + detailRef;            
            console.log(index);            
            lineDetailRef.value[index as T].setAttribute('style', 'display: block;');
             tableDataView.value=!tableDataView.value;
        }
    }

    const gridDataView=ref(false);


    function gridItemClick(item: NinjaOneOrganization){                
        
        if(gridDataView.value){            
            if (selectedOrganization.value.ID==item.ID){
                resetDetailViewData(); 
                gridDataView.value=!gridDataView.value;
            }
            else{
                selectedOrganization.value = item;                 
            }
        }
        else {                 
            selectedOrganization.value = item;             
            gridDataView.value=!gridDataView.value;
        }        
    }


   
    // close details section
    function closeDetail(detailRef: number=0) {
        resetDetailViewData();
        if (gridViewSelected.value) {
            detailsShown.value = false;
        }
        else if (tableViewSelected.value) {
            let index = taskTypeSelected.value+'_' + detailRef;
            console.log(index);          
            lineDetailRef.value[index as T].setAttribute('style', 'display: none;');
        }        
        invoiceCode.value = '';
    }

    // hide details for selected organization and empty respective variables
    function resetDetailViewData() {
        searchQuery.value = '';
        selectedOrganization.value = ({
            ID: 0, Name: '', Description: '', Locations: [],
            Tickets: [], Projects: [], Dev: [], Web: [],
            OnContract: 0,
            TicketCount: 0, TicketClosedCount: 0, TicketInterventionCount: 0, TicketInvoicedInterventionCount: 0, TicketHourCount: 0, TicketInvoicedHourCount: 0, TicketFieldTripCount: 0,
            ProjectCount: 0, ProjectClosedCount: 0, ProjectInterventionCount: 0, ProjectInvoicedInterventionCount: 0, ProjectHourCount: 0, ProjectInvoicedHourCount: 0, ProjectFieldTripCount: 0,
            WebCount: 0, WebClosedCount: 0, WebInterventionCount: 0, WebInvoicedInterventionCount: 0, WebHourCount: 0, WebInvoicedHourCount: 0, WebFieldTripCount: 0,
            DevCount: 0, DevClosedCount: 0, DevInterventionCount: 0, DevInvoicedInterventionCount: 0, DevHourCount: 0, DevInvoicedHourCount: 0, DevFieldTripCount: 0
        });      
    }

    // copy text of the invoice to clipboard with a view to later pasting it to an external document
    async function copyText(item: NinjaOneOrganization, invoicedOnlyCopy: boolean) {
        console.log(item, taskTypeSelected.value, invoicedOnlyCopy);      
        let stringRes = header.value + ' - ' + currMonth.value + " " + currYear.value + " - Durée totale: ";
        if (invoicedOnlyCopy)
        {
            stringRes = stringRes + hoursPercentageConverter(Number(item[hrsInv.value as mapT])) + "\n";
            //stringRes += "=========================================================================================================================== \n";
            console.log(stringRes, item[hrsInv.value as mapT]);
            for (let ticket of (item[itemArr.value as mapT]) as NinjaOneTicket[]) {
                console.log("TICKET: ", ticket);
                if (ticket.TotalTimeInvoiced > 0) {
                    stringRes += "Date: " + timeConvertU_S(ticket.CreateTime) + " - Durée (minutes): " + hoursConverter(ticket.TotalTimeInvoiced) + " - " + ticket.Summary + " - " + ticket.Code + " \n";
                    for (let intervention of ticket.Interventions) {
                        if (intervention.IsInvoiced) {
                            console.log("invoiced INTERVENTION: ", intervention);
                            //stringRes += "- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - \n";
                            stringRes += intervention.Description + "\n";
                        }
                    }
                }
            }
        }
        // if only NON-INVOICED TICKETS AND INTERVENTIONS are selected
        else
        {
            stringRes = stringRes + hoursPercentageConverter(Number(item[hrs.value as mapT]) - Number(item[hrsInv.value as mapT])) + "\n";
            //stringRes += "========================================================================================================================= \n";
            for (let ticket of (item[itemArr.value as mapT]) as NinjaOneTicket[]) 
            {
                if (ticket.TotalTimeTracked > ticket.TotalTimeInvoiced)
                {
                    stringRes += "Date: " + timeConvertU_S(ticket.CreateTime) + " - Durée (minutes): " +
                            hoursConverter(ticket.TotalTimeTracked - ticket.TotalTimeInvoiced) +
                        " - " + ticket.Summary + " - " + ticket.Code + " \n";
                    for (let intervention of ticket.Interventions)
                    {
                        if (!intervention.IsInvoiced)
                        {
                            console.log("non-invoiced INTERVENTION: ", intervention);
                            //stringRes += "- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - \n";
                            stringRes += intervention.Description + "\n";
                        }
                    }
                }
            }
        }     
     
        await navigator.clipboard.writeText(stringRes);
        console.log(stringRes);
        //alert("Text de facture copié dans le presse-papiers");
    }

    //convert UNIX time to normal time representation and return corresponding string
    function timeConvertU_S(unixTime: number):string {
        let date = new Date(unixTime * 1000);
        let yyyy = date.getFullYear();
        let mm = ('0' + (date.getMonth() + 1)).slice(-2);  // Months are zero based. Add leading 0.
        let dd = ('0' + date.getDate()).slice(-2);     // Add leading 0.
        let hh = date.getHours();
        let min = ('0' + date.getMinutes()).slice(-2);  // Add leading 0.
        return yyyy + '-' + mm + '-' + dd + '  ' + hh + ':' + min;
    }

     //convert seconds to minutes and hours and return a string representation
    function hoursConverter(seconds: number): string {
        let minutes = seconds / 60;
        let hours = minutes >= 60 ? (Math.floor(minutes / 60)) : 0;
        minutes %= 60;
        let rest = minutes % 15;
        let add = rest > 7 ? 15 : 0;
        minutes = minutes - rest + add;

        return hours.toString().length > 2 ? hours + ":" + ('0' + minutes).slice(-2):('0' + hours).slice(-2) +":" + ('0' + minutes).slice(-2);
    }

     //convert seconds to hours in decimal format (VS hours and minutes) and return a string representation
    function hoursPercentageConverter(seconds: number): string {
            let minutes = seconds / 60;
            let hours = minutes >= 60 ? Math.floor(minutes / 60) : 0;
            minutes %= 60;
            let rest = minutes % 15;
            let add = rest > 7 ? 15 : 0;
            minutes = minutes - rest + add;
            switch (minutes) {
                case 15:
                    return hours + ".25";
                case 30:
                    return hours + ".5";
                case 45:
                    return hours + ".75";
                default:
                    return hours + ".0";
            }
    }    
    
    // open dialogue to confirm or cancel invoice change
    async function openConfirmationDialog(intervention: NinjaOneIntervention) {
        console.log("Data received when CHECKBOX changes: ", intervention);
        //console.log("Data prior to be submitted: ", selectedOrganization.value);
        confirmationDialog.value.showConfirmation({
            title: 'Confirmation',
            message: 'Êtes-vous sûr de vouloir enregistrer les modifications?',
            yesMessage: 'ENREGISTRER',
            confirmCallback: async () => {
                try {
                  //  const response = await api.invoice.saveInvoice(selectedOrganization.value, currYear.value, currMonthOrd.value + 1);
                    const response = await api.invoice.changeIntervention(intervention);
                    console.log("CREATE response", response);
                    console.log("CREATE response code", response.code);
                    if (response.code == 200) {
                        showNotification({
                            title: response.header,
                            message: response.message,
                            code: response.code
                        });
                    } else {
                        showNotification({
                            title: response.header,
                            message: response.message,
                            code: response.code,
                            actionMessage: "Sauvegarde non effectué",
                            duration: 4500
                        });
                    }
                    onHold.value = true;
                    refreshOrganizations();
                   // updateOrganization();
                } catch (err) {
                    showNotification({
                        title: "Erreur critique",
                        message: err,
                        actionMessage: "Modiciation non effectuée",
                        code: 4,
                        duration: 8000
                    });
                }
            },
            cancelCallback: () => { }
        });
    }

    // toggle between table and grid views
    function selectFormViewMode() {
        console.log("GridView: ", gridViewSelected.value);
        console.log("TableView: ", tableViewSelected.value);
        tableViewSelected.value = !tableViewSelected.value;
        gridViewSelected.value = !gridViewSelected.value;
        detailsShown.value=false;
    }

    const hrs = ref('TicketHourCount');
    const hrsInv = ref('TicketInvoicedHourCount');
    const items = ref('TicketCount');
    const itemsClosed = ref('TicketClosedCount');
    const interventions = ref('TicketInterventionCount');
    const interventionsInv = ref('TicketInvoicedInterventionCount');
    const fieldTrips = ref('TicketFieldTripCount');
    const itemArr = ref("Tickets");
    const header = ref('Support informatique');

    const hrsToBeInvoiced = computed(() => {
   
        let res = filteredOrganizations.value.reduce((accumulator, item) => accumulator + (item.OnContract==0?Number(item[hrs.value as mapT]):0), 0);
        /*let res = 0;
        filteredOrganizations.value.forEach((item) => {
            res += item.OnContract ? 0 : Number(item[hrs.value as mapT]);
        });*/
        return hoursConverter(res);
    });

    const hrsNotToBeInvoiced = computed(() => {
        return hoursConverter(filteredOrganizations.value.reduce((accumulator, item) => accumulator + (item.OnContract == 1 ? Number(item[hrs.value as mapT]) : 0), 0));
    });

    const ticketHrs = computed(() => {
        return hoursConverter(organizations.value.reduce((accumulator, item) => accumulator + item.TicketHourCount, 0));
    });

    const projectHrs = computed(() => {
        return hoursConverter(organizations.value.reduce((accumulator, item) => accumulator + item.ProjectHourCount, 0));
    });

    const webHrs = computed(() => {
        return hoursConverter(organizations.value.reduce((accumulator, item) => accumulator + item.WebHourCount, 0));
    });

    const devHrs = computed(() => {
        return hoursConverter(organizations.value.reduce((accumulator, item) => accumulator + item.DevHourCount, 0));
    });

    const totalHrs = computed(() => {
        return hoursConverter(organizations.value.reduce((accumulator, item) => accumulator + (item.TicketHourCount + item.ProjectHourCount + item.WebHourCount + item.DevHourCount), 0));
    });
    
    // toggle between ticket, project, WEB and DEV views 
    function selectTaskType(type:string) {        
        taskTypeSelected.value = type;       
        switch (taskTypeSelected.value) {
            case 'Ticket':
                hrs.value = 'TicketHourCount';
                hrsInv.value = 'TicketInvoicedHourCount';
                items.value = 'TicketCount';
                itemsClosed.value = 'TicketClosedCount';
                interventions.value = 'TicketInterventionCount';
                interventionsInv.value = 'TicketInvoicedInterventionCount';
                fieldTrips.value = 'TicketFieldTripCount';
                itemArr.value = 'Tickets';
                header.value = 'Support informatique';
                break;
            case 'Project':
                hrs.value = 'ProjectHourCount';
                hrsInv.value = 'ProjectInvoicedHourCount';
                items.value = 'ProjectCount';
                itemsClosed.value = 'ProjectClosedCount';
                interventions.value = 'ProjectInterventionCount';
                interventionsInv.value = 'ProjectInvoicedInterventionCount';
                fieldTrips.value = 'ProjectFieldTripCount';
                itemArr.value = 'Projects';
                header.value = 'Projet informatique';
                break;
            case 'Web':
                hrs.value = 'WebHourCount';
                hrsInv.value = 'WebInvoicedHourCount';
                items.value = 'WebCount';
                itemsClosed.value = 'WebClosedCountWebInterventionCount';
                interventions.value = 'WebInterventionCount';
                interventionsInv.value = 'WebInvoicedInterventionCount';
                fieldTrips.value = 'WebFieldTripCount';
                itemArr.value = 'Web';
                header.value = 'Projet WEB';
                break;
            case 'Dev':
                hrs.value = 'DevHourCount';
                hrsInv.value = 'DevInvoicedHourCount';
                items.value = 'DevCount';
                itemsClosed.value = 'DevClosedCount';
                interventions.value = 'DevInterventionCount';
                interventionsInv.value = 'DevInvoicedInterventionCount';
                fieldTrips.value = 'DevFieldTripCount';
                itemArr.value = 'Dev';
                header.value = 'Projet de développement logiciel';
                break;
            default:
                hrs.value = 'TicketHourCount';
                hrsInv.value = 'TicketInvoicedHourCount';
                items.value = 'TicketCount';
                itemsClosed.value = 'TicketClosedCount';
                interventions.value = 'TicketInterventionCount';
                interventionsInv.value = 'TicketInvoicedInterventionCount';
                fieldTrips.value = 'TicketFieldTripCount';
                itemArr.value = 'Tickets';
                header.value = 'Support informatique';
                break;
        }
        console.log('TASK TYPE selected: ', taskTypeSelected.value);
        gridDataView.value=false;
        tableDataView.value=false;
        resetDetailViewData(); 
        console.log(lineDetailRef.value);
        //clear all table lines if they were extended and detail view was shown
        for (let line in lineDetailRef.value) {
            lineDetailRef.value[line as keyof typeof lineDetailRef.value].setAttribute('style', 'display: none;');
        }
        console.log(lineDetailRef.value);       
    }

   

</script>


<template>
    <ConfirmDialogue ref="confirmationDialog" />
    <FloatingMessage ref="notification" />

    <div class="content">
        <div v-if="onHold==true" class="pos-z-3 bg-mist flex-c a-center j-center w-100 h-100">
            <div class="bg-secondaryLight p-10 br-10">
                <img src='~/assets/images/on_hold_icon.gif' />
            </div>
        </div>
        <div v-else class="flex-r a-center j-center w-100 bg-t mb-2">
            <div @click="changePeriod('backward')" class="w-25 arrow-right">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="size-8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
            </div>
            <div class="cloud">
                {{currMonth}} {{currYear}}
            </div>
            <div @click="changePeriod('forward')" class="arrow-left">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="size-8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
            </div>
        </div>
        <div class="w-100 h-fit flex-r a-center j-center">
            <div class="tiny-button f-1 h-fit task-detail-item flex-c a-center j-center p-2"
                 @click="refreshOrganizations">

                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                <span class="tooltiptext-r">Actualiser les données</span>
            </div>

            <div class="f-13 bg-red"></div>

            <input v-model="searchQuery" type="text" placeholder="Rechercher un client..."
                   class="f-6 custom-text-input search-entity mb-2 mr-5 p-2 b-lsb">

            <div class="f-8 flex-r a-bottom j-bottom br-5 bg-t mb-2 mr-5">

                <div v-if="taskTypeSelected=='Ticket'"
                     class="cursor-g bg-b6 b-lsb w-20 h-100 p-0 m-0 flex-c  br-l j-top a-top task-detail-item"
                     @click="selectTaskType('Ticket')">
                    <div class="w-100 h-50 flex-r a-center j-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                        </svg>
                        <span class="tooltiptext-l">Tickets selectés</span>

                    </div>
                    <div class="flex-c a-center j-center c-white w-100 h-50 fw-bold fs-10rem">
                        {{ticketHrs}}
                    </div>
                </div>
                <div v-else
                     class="cursor-g bg-t  w-20 h-100 p-0 m-0 flex-c  j-top a-top task-detail-item"
                     @click="selectTaskType('Ticket')">
                    <div class="w-100 h-50 flex-r a-center j-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                        </svg>
                        <span class="tooltiptext-l">Selecter tickets</span>
                    </div>
                    <div class="flex-c a-center j-center c-lsb w-100 h-50 fw-bold fs-08rem">
                        {{ticketHrs}}
                    </div>
                </div>

                <div v-if="taskTypeSelected=='Project'"
                     class="cursor-g bg-b6 b-lsb w-20 h-100 p-0 m-0 flex-c  j-top a-top task-detail-item"
                     @click="selectTaskType('Project')">
                    <div class="w-100 h-50 flex-r a-center j-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <span class="tooltiptext-l">Projets selectés</span>

                    </div>
                    <div class="flex-c a-center j-center c-white w-100 h-50 fw-bold fs-10rem">
                        {{projectHrs}}
                    </div>
                </div>
                <div v-else
                     class="cursor-g bg-t  w-20 h-100 p-0 m-0 flex-c  j-top a-top task-detail-item"
                     @click="selectTaskType('Project')">
                    <div class="w-100 h-50 flex-r a-center j-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <span class="tooltiptext-l">Selecter projets</span>
                    </div>
                    <div class="flex-c a-center j-center c-lsb w-100 h-50 fw-bold fs-08rem">
                        {{projectHrs}}
                    </div>
                </div>

                <div v-if="taskTypeSelected=='Web'"
                     class="cursor-g bg-b6 b-lsb w-20 h-100 p-0 m-0 flex-c  j-top a-top task-detail-item"
                     @click="selectTaskType('Web')">
                    <div class="w-100 h-50 flex-r a-center j-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                        </svg>
                        <span class="tooltiptext-l">WEB selectés</span>

                    </div>
                    <div class="flex-c a-center j-center c-white w-100 h-50 fw-bold fs-10rem">
                        {{webHrs}}
                    </div>
                </div>
                <div v-else
                     class="cursor-g bg-t  w-20 h-100 p-0 m-0 flex-c  j-top a-top task-detail-item"
                     @click="selectTaskType('Web')">
                    <div class="w-100 h-50 flex-r a-center j-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                        </svg>
                        <span class="tooltiptext-l">Selecter WEB</span>
                    </div>
                    <div class="flex-c a-center j-center c-lsb w-100 h-50 fw-bold fs-08rem">
                        {{webHrs}}
                    </div>
                </div>


                <div v-if="taskTypeSelected=='Dev'"
                     class="cursor-g bg-b6 b-lsb w-20 h-100 p-0 m-0 flex-c  j-top a-top br-r task-detail-item"
                     @click="selectTaskType('Dev')">
                    <div class="w-100 h-50 flex-r a-center j-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
                        </svg>
                        <span class="tooltiptext-l">Projets DEV selectés</span>

                    </div>
                    <div class="flex-c a-center j-center c-white w-100 h-50 fw-bold fs-10rem">
                        {{devHrs}}
                    </div>
                </div>
                <div v-else
                     class="cursor-g bg-t  w-20 h-100 p-0 m-0 flex-c  j-top a-top task-detail-item"
                     @click="selectTaskType('Dev')">
                    <div class="w-100 h-50 flex-r a-center j-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
                        </svg>
                        <span class="tooltiptext-l">Selecter projets DEV</span>
                    </div>
                    <div class="flex-c a-center j-center c-lsb w-100 h-50 fw-bold fs-08rem">
                        {{devHrs}}
                    </div>
                </div>


            </div>

            <div class="f-4 flex-r a-bottom j-bottom br-5 bg-t mb-2 mr-5">

                <div v-if="gridViewSelected" class="cursor-g bg-b6 b-lsb w-10 h-100 p-0 m-0 flex-r  br-l j-center a-center task-detail-item" @click="selectFormViewMode">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="white" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                    </svg>
                    <span class="tooltiptext-l">Vue grid selectée</span>
                </div>
                <div v-else-if="!gridViewSelected" class="curor-g bg-t  w-10 h-100 p-0 m-0 flex-r  j-center a-center task-detail-item" @click="selectFormViewMode">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                    </svg>
                    <span class="tooltiptext-l">Selecter vue grid</span>
                </div>
                <div v-if="tableViewSelected" class="cursor-g  bg-b6 b-lsb w-10 h-100 p-0 m-0 flex-r  j-center a-center br-r task-detail-item" @click="selectFormViewMode">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="white" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5" />
                    </svg>
                    <span class="tooltiptext-l">Vue tableau selectée</span>
                </div>
                <div v-else-if="!tableViewSelected" class="cursor-g  bg-t  w-10 h-100 p-0 m-0 flex-r  j-center a-center task-detail-item" @click="selectFormViewMode">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5" />
                    </svg>
                    <span class="tooltiptext-l">Selecter vue tableau</span>
                </div>
            </div>
        </div>
            <div class="flex-r a-top j-top bg-t w-100 h-fit">
                <div class="f-1 fw-bold c-cloud-lsb m-2 b-lsb br-5 p-5">
                    Heures totales pour facturation: {{hrsToBeInvoiced}}
                </div>
                <div class="f-1 fw-bold c-cloud-lsb m-2 b-lsb br-5 p-5">
                    Heures totales sans facturation: {{hrsNotToBeInvoiced}}
                </div>
                <div class="f-2 fw-bold c-cloud-lsb m-2  br-5 p-5">
                </div>
                <div class="f-1 fw-bold bg-b4 c-b8 m-2 br-5 p-5">
                    Touts les types de projets: {{totalHrs}}
                </div>
            </div>
            <div v-if="gridViewSelected" class="global-container">

                <div class="list-container bg-t" v-if="organizations">
                    <CustomListView ref="listView" v-model="selectedOrganization" :items="filteredOrganizations" :allow-selection="true"
                                    :show-details="true" :allow-deselection="false" class="entity-listview">
                        <template v-slot:organizationItem="{ item }">
                            <div class="mb-2 flex-c a-stretch br-5 bg-t" 
                                 :class="{'bg-invoice-complete':item[hrs]==item[hrsInv]}"
                                 @click="gridItemClick(item)">
                                <div v-if="item.OnContract" class="ta-center c-cloud-contract p-2 task-detail-item ">
                                    {{ item.Name }}
                                    <span class="tooltiptext-r-close">Entité: {{item.Name }} <br> AVEC CONTRAT</span>
                                </div>

                                <div v-else class="ta-center c-cloud bg-t p-2 task-detail-item">
                                    {{ item.Name }}
                                    <span class="tooltiptext-r-close">Entité: {{item.Name }} <br> SANS CONTRAT</span>
                                </div>

                                <div class="flex-r j-center a-center bg-t w-100 b-b9i">

                                    <div class="f-1 flex-c j-center a-top bg-t">
                                        <div class="w-100 flex-r j-top a-top ">
                                            <label class="f-1 h-fit ta-bottom p-2 c-shadow">Tickets</label>
                                            <div class="f-1 br-10 ta-center p-2 bg-weak c-w fw-bold  mb-2 task-detail-item">
                                                {{item[itemsClosed]}}/{{item[items]}}
                                                <span class="tooltiptext-l">Ticket-s fermé-s: {{item[itemsClosed]}} sur le total nombre de {{item[items]}} ticket-s pour {{currMonth}} {{currYear}}</span>
                                            </div>
                                        </div>
                                        <div class="w-100 flex-r j-top a-top ">
                                            <label class="f-1 h-fit ta-bottom p-2 c-shadow">Interventions</label>
                                            <div class="f-1 br-10 ta-center p-2 bg-weak c-w fw-bold  mb-2 task-detail-item">
                                                {{item[interventionsInv]}}/{{item[interventions]}}
                                                <span class="tooltiptext-l">
                                                    Interventions facturées: {{item[interventionsInv]}} <br />
                                                    sur le total nombre de {{item[interventions]}} interventions pour {{currMonth}} {{currYear}}
                                                </span>
                                            </div>
                                        </div>
                                        <div class="w-100 flex-r j-top a-top ">
                                            <label class="f-1 h-fit ta-bottom p-2 c-shadow">Heures:Minutes</label>
                                            <div class="f-1 br-10 ta-center p-2 bg-weak c-w fw-bold  mb-2 task-detail-item">
                                                {{hoursConverter(item[hrsInv])}}/{{hoursConverter(item[hrs])}}
                                                <span class="tooltiptext-l">
                                                    Temps facturé: {{hoursConverter(item[hrsInv])}}
                                                    heures:minutes sur total de {{hoursConverter(item[hrs])}} heures:minutes dédié à cette entité pour {{currMonth}} {{currYear}}
                                                </span>
                                            </div>
                                        </div>
                                        <div class="w-100 flex-r j-top a-top ">
                                            <label class="f-1 h-fit ta-bottom p-2 c-shadow">Deplacement(s)</label>
                                            <div class="f-1 br-10 ta-center p-2 bg-weak c-w fw-bold  mb-2 task-detail-item">
                                                x {{item[fieldTrips]}}
                                                <span class="tooltiptext-l">
                                                    Nombre de deplacement(s) pour {{currMonth}} {{currYear}}: {{item[fieldTrips]}}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </CustomListView>
                </div>
                <div v-if="gridDataView" class="w-100 flex-c a-stretch j-top">
                    <div class="w-100 bg-b7 b-lsb br-10 flex-c a-stretch j-top overflow-auto">
                        <div class="flex-r a-bottom j-bottom bg-t">
                            <!--BUTTON for saving non-invoiced interventions as .txt file-->
                            <button v-if="selectedOrganization[hrsInv]!=selectedOrganization[hrs]"
                                    class="tiny-button w-20   h-auto flex-c j-center a-center"
                                    @click="copyText(selectedOrganization, false)"
                                    title="Copier heures non-facturés au clipboard">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z" />
                                </svg>
                            </button>

                            <!--BUTTON for saving invoiced interventions as .txt file-->
                            <button v-if="selectedOrganization[hrsInv]>0"
                                    class="tiny-button w-20 h-auto flex-c j-center a-center"
                                    @click="copyText(selectedOrganization, true)"
                                    title="Copier heures facturées au clipboard">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" />
                                </svg>
                            </button>
                        </div>
                        <div class="w-100 bg-b9 b-b9 flex-c a-stretch j-top overflow-auto b-b10 c-white p-2">
                            <div class="detail-header cursor-g w-100 fw-bold flex-r a-center j-center p-2 task-detail-item"
                                 @click="closeDetail(selectedOrganization.ID)">
                                <p v-if="selectedOrganization[fieldTrips]>0">{{header}} {{currMonth}} {{currYear}} (Deplacements x {{selectedOrganization[fieldTrips]}})</p>
                                <p v-else>{{header}} {{currMonth}} {{currYear}}</p>
                                <span class="tooltiptext">FERMER</span>
                            </div>
                            <div v-for="(item, index) in selectedOrganization[itemArr]"
                                 class="w-100 flex-c a-stretch j-top w-95 h-auto bg-b7 ">
                                <div v-for="(intervention, index) in item.Interventions" :key="`entry-${intervention.ID}`"
                                     class="w-100 h-fit flex-c a-top j-top b-b10">
                                    <div class="flex-r w-100 h-fit a-stretch  j-stretch">
                                        <div class="f-2 b-b10 ta-top p-2">Date: {{timeConvertU_S(intervention.CreateTime)}}</div>
                                        <div class="f-1 b-b10 ta-top p-2">Duré: {{hoursConverter(intervention.TimeTracked)}}</div>
                                        <div class="f-3 b-b10 ta-top p-2">{{item.Summary}}</div>
                                        <div class="f-1 b-b10 ta-top p-2">{{item.Code}}</div>
                                        <div class="f-1 b-b10 flex-r a-center j-center">
                                            <input type="checkbox" v-model="intervention.IsInvoiced"
                                                   @change="updateOrganization(intervention)"
                                                   class="x-2 cursor-g" />
                                            <label>  Facturé</label>
                                        </div>
                                    </div>
                                    <div class="w-100 h-fit b-b10 ta-top p-2">{{intervention.Description}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="h-100 w-100 bg-t" v-if="tableViewSelected">
                <div class="flex-r w-100 a-stretch j-stretch bg-t b-lsb br-t">
                    <div class=" f-4 selector "
                         @click="organizationsSort('name')">
                        Client
                        <!--<span class="tooltiptext-l">Trier par nom de client</span>-->
                    </div>
                    <div class=" f-2 selector "
                         @click="organizationsSort('total')">
                        Heures totales
                        <!--<span class="tooltiptext-l">Trier par nombre des heures totales</span>-->
                    </div>
                    <div class=" f-2 selector "
                         @click="organizationsSort('uninvoiced')">
                        Heures non-facturées
                        <!--<span class="tooltiptext-l">Trier par nombre des heures non-facturées</span>-->
                    </div>
                    <div class=" f-2 selector "
                         @click="organizationsSort('invoiced')">
                        Heures facturées
                        <!--<span class="tooltiptext-l">Trier par nombre des heures facturées</span>-->
                    </div>
                    <div class=" f-2 selector "
                         @click="organizationsSort('trip')">
                        Déplacements
                        <!--<span class="tooltiptext-l">Trier par nombre des heures facturées</span>-->
                    </div>

                    <div class=" f-2 c-cloud-lsb ">Copier heures non-facturées</div>
                    <div class=" f-2 c-cloud-lsb ">Copier heures facturées</div>
                </div>
                <div class="t-container w-100 bg-t flex-c a-top j-stretch">
                    <div class="flex-c a-top w-100 j-center bg-t" v-for="item in filteredOrganizations" :key="item.ID">

                        <div class="flex-r a-stretch j-stretch w-100"
                              :class="{'bg-invoice-complete':item[hrs]==item[hrsInv]}">
                            <div class="f-6 list-line flex-r j-stretch a-stretch" @click="tableItemClick(item, item.ID)">
                                <div v-if="item.OnContract" class="f-2 ta-center c-cloud-contract p-2 task-detail-item ">
                                    {{ item.Name }}
                                    <span class="tooltiptext-r-close">Entité: {{item.Name }} <br> AVEC CONTRAT</span>
                                </div>

                                <div v-else class="f-2 c-cloud p-2 task-detail-item">
                                    {{ item.Name }}
                                    <span class="tooltiptext-r-close">Entité: {{item.Name }} <br> SANS CONTRAT</span>
                                </div>
                                <div class="f-1 task-detail-item flex-r a-center j-center">
                                    {{hoursConverter(item[hrs])}}
                                    <span class="tooltiptext-tab">
                                        Total heures:minutes: {{hoursConverter(item[hrs])}}
                                    </span>
                                </div>
                                <div class="f-1 task-detail-item flex-r a-center j-center">
                                    {{hoursConverter(item[hrs]-item[hrsInv])}}
                                    <span class="tooltiptext-tab">
                                        Heures:Minutes non-facturées: {{hoursConverter(item[hrs]-item[hrsInv])}}
                                    </span>
                                </div>
                                <div class="f-1 task-detail-item flex-r a-center j-center">
                                    {{hoursConverter(item[hrsInv])}}
                                    <span class="tooltiptext-tab">
                                        Heures:Minutes facturées: {{hoursConverter(item[hrsInv])}}
                                    </span>
                                </div>
                                <div class="f-1 task-detail-item flex-r a-center j-center">
                                    <p v-if="item[fieldTrips]>0" class="fw-bold w-100 flex-r a-center j-center">{{item[fieldTrips]}}</p>
                                    <span v-if="item[fieldTrips]>0" class="tooltiptext-tab">
                                        Nombre de déplacements: {{item[fieldTrips]}}
                                    </span>
                                </div>

                            </div>
                            <div class="f-1 flex-r a-center j-center bg-t">
                                <button v-if="item[hrsInv]!=item[hrs]"
                                        class="tiny-button w-fit h-auto flex-c j-center a-center z-2"
                                        @click="copyText(item, false)"
                                        title="Copier heures non-facturées au clipboard">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z" />
                                    </svg>
                                </button>
                            </div>
                            <div class="f-1 flex-r a-center j-center bg-t">
                                <button v-if="item[hrsInv]>0"
                                        class="tiny-button w-fit h-auto flex-c j-center a-center z-2"
                                        @click="copyText(item, true)"
                                        title="Copier heures facturées au clipboard">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div class="d-none w-100 bg-b9 b-b9 flex-c a-stretch j-top overflow-auto b-b10 c-white p-2"
                             :lineDetailId="item.ID"
                             :ref="(el) => (lineDetailRef[taskTypeSelected+'_'+item.ID.toString()] = el)">

                            <div class="detail-header cursor-g w-100 fw-bold flex-r a-center j-center p-2"
                                 @click="closeDetail(item.ID)">
                                <p v-if="selectedOrganization[fieldTrips]>0">{{header}} {{currMonth}} {{currYear}} (Deplacements x {{selectedOrganization[fieldTrips]}})</p>
                                <p v-else>{{header}} {{currMonth}} {{currYear}}</p>
                            </div>

                            <div v-for="(item, index) in selectedOrganization[itemArr]"
                                 class="w-100 flex-c a-stretch j-top w-95 h-auto bg-b7 ">
                                <div v-for="(intervention, index) in item.Interventions" :key="`entry-${intervention.ID}`"
                                     class="w-100 h-fit flex-c a-top j-top b-b10">

                                    <div class="flex-r w-100 h-fit a-stretch  j-stretch">
                                        <div class="f-2 b-b10 ta-top p-2">Date: {{timeConvertU_S(intervention.CreateTime)}}</div>
                                        <div class="f-1 b-b10 ta-top p-2">Duré: {{hoursConverter(intervention.TimeTracked)}}</div>
                                        <div class="f-3 b-b10 ta-top p-2">{{item.Summary}}</div>
                                        <div class="f-1 b-b10 ta-top p-2">{{item.Code}}</div>
                                        <div class="f-1 b-b10 flex-r a-center j-center">
                                            <input type="checkbox" v-model="intervention.IsInvoiced"
                                                   @change="updateOrganization(intervention)"
                                                   class="x-2 cursor-g" />
                                            <label>  Facturé</label>
                                        </div>
                                    </div>

                                    <div class="w-100 h-fit b-b10 ta-top p-2">{{intervention.Description}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
</template>
<style scoped>
    .entity-row-item {
        position: relative;
        display: inline-block;
    }
        /* Tooltip text */
        .entity-row-item .tooltiptext {
            visibility: hidden;
            width: auto;
            height: 100%;
            background-color: lightskyblue;
            color: #596faa;
            text-align: center;
            padding: 5px 0;
            border-radius: 6px;
            /* Position the tooltip text */
            position: absolute;
            z-index: 1;
            bottom: 5%;
            right: 1%;
            /*  margin-left: -60px;*/
            /* Fade in tooltip */
            opacity: 0;
            transition: opacity 0.3s;
        }
        /* Show the tooltip text when you mouse over the tooltip container */
        .entity-row-item:hover .tooltiptext {
            visibility: visible;
            opacity: 0.8;
        }
    .entity-details-container {
        background-color: #394F90; /*#d7eb7c;*/
        border-radius: 5px;
        border: 1px solid white;
    }
    .element-visible {
        display: block;
    }
    .element-invisible {
        display: none;
    }
    .search-container {
        /* Styles du conteneur de recherche */
        width: 100%;
        background-color: #312C63; /*#61fd52*/
        display: flex;
        justify-content: space-between;
        padding: 5px;
        margin-bottom: 10px;
        border-radius: 10px;
        height: 50px;
    }
    .inputs-container {
        width: 100%;
        display: flex;
        gap: 5px;
    }
    .model-list {
        flex: 0 1 auto;
        width: 200px !important;
    }
    .content {
        overflow: hidden;
        height: 80vh;
        display: flex;
        flex-direction: column;
        width: 100%;
    }
    .global-container {
        display: flex;
        flex-grow: 1;
        overflow: hidden;
    }
    .list-container {
        width: 350px;
        flex-shrink: 0;
    }
    .entity-listview {
        height: 100%;
        overflow-x: hidden;
    }
        .entity-listview::-webkit-scrollbar {
            width: 8px;
        }
        .entity-listview::-webkit-scrollbar-thumb {
            background: #959595;
            border-radius: 5px;
        }
        .entity-listview::-webkit-scrollbar-track {
            background-color: none;
            border-radius: 10px;
        }
            .entity-listview::-webkit-scrollbar-track:hover {
                background-color: black;
            }
        .entity-listview::-webkit-scrollbar-corner {
            background-color: white;
        }
        .entity-listview li:last-child {
            border: 1px solid black;
            border-bottom-left-radius: 5px;
            border-bottom-right-radius: 5px;
        }
        .entity-listview li:first-child {
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
        }
    .entityArticle-details-container {
        background-color: #394F90; /*#d7eb7c;*/
        margin-right: 5px;
        flex-grow: 1;
        width: calc(100% - 50px);
        border-radius: 5px;
        margin-left: 5px;
        overflow-y: auto;
    }
    .search-entity {
        max-width: 300px;
    }
    .search-article-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 5px;
        background-color: #312C63; /*#61fd52*/
        margin: 5px;
        padding: 5px;
        border-radius: 5px;
    }
    .inputs-article-container {
        display: flex;
        align-items: center;
        gap: 5px;
        flex-grow: 1;
    }
    .article-title {
        margin: 10px;
        text-align: center;
        font-size: x-large;
        color: white;
    }
    .table-container {
        display: flex;
        flex-direction: column;
        width: auto;
        margin: 10px;
        color: white;
    }
    .table-header,
    .table-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .table-header {
        background-color: #312C63; /*#61fd52*/
        border-top-right-radius: 5px;
        border-top-left-radius: 5px;
        font-weight: bold;
    }
    .header-item,
    .row-item {
        flex: 2;
        text-align: center;
        padding: 10px 0;
    }
    .row-item-buttons {
        display: flex;
        justify-content: center;
        gap: 5px;
        align-items: center;
    }
    .table-body {
        overflow-y: auto;
        height: 100%;
    }
    .entity-row-item {
        width: 340px;
        padding: 10px;
    }

 
</style>
