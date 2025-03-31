<script setup lang="ts">
    /*
    import { ref, onMounted, nextTick } from 'vue';

    import { SimpleEntityService } from '~/api/services/EntityService'    
    import { showNotification } from '@/utils/notificationService';

    import type Entity from '~/api/models/Entity';
    import type EntityType from '../../api/models/EntityType';
    import type IndividualTitle from '../../api/models/IndividualTitle';
    import type Telephone from '~/api/models/Telephone';
    import type TelephoneType from '~/api/models/TelephoneType';
    import type IntTelDialCode from '~/api/models/IntTelDialCode';
    import type Email from '~/api/models/Email';
    import type Locality from '~/api/models/Locality';
    import type Address from '~/api/models/Address';
    import type Country from '~/api/models/Country';

    import CustomComboBox from '~/components/CustomComboBox.vue';
    import CustomListView from '~/components/CustomListView.vue';

    import EmailFormComponent from '@/components/EmailFormComponent.vue';
    import TelephoneFormComponent from '@/components/TelephoneFormComponent.vue';
    import AddressFormComponent from '@/components/AddressFormComponent.vue';
    import ConfirmDialogue from '@/components/ConfirmDialogue.vue';
    import FloatingMessage from '@/components/FloatingMessage.vue';


    definePageMeta({
        layout: 'entities',
        // name: 'index',
        // alias: 'index',
        title: 'Entities - Entités',
        description: "Liste d'entités",
        navOrder: 1,
        type: 'primary',
        icon: 'i-mdi-home',
        accessLevel: 1,
        charset: 'utf-8',
        // ogImage: 'images/ogImage.png', // url or local images inside public folder, for eg, ~/public/images/ogImage.png
    });
    
    const service = new SimpleEntityService();

    const {
        data: entities,
        pending: pendingEntities,
        error: errorEntities,
        refresh: refreshEntities
    } = await useAsyncData("entity", async () => {
        var tempData = await service.getEntities();
        console.log("MOUNTED entities", tempData.entities);
        return tempData.entities;

    });

    const {
        data: entityTypes,
        pending: pendingEntityTypes,
        error: errorEntityTypes,
        refresh: refreshEntityTypes
    } = await useAsyncData("entity/entityTypes", async () => {
        var tempData = await service.getEntityTypes();
        console.log("MOUNTED entity types", tempData.entityTypes);
        return tempData.entityTypes;
    });


    const {
        data: individualTitles,
        pending: pendingIndividualTitles,
        error: errorIndividualTitles,
        refresh: refreshIndividualTitles
    } = await useAsyncData("entity/individualTitles", async () => {
        var tempData = await service.getIndividualTitles();
        console.log("MOUNTED individualTitles", tempData.titles);
        return tempData.titles;
    });

    const {
        data: countries,
        pending: pendingCountries,
        error: errorCountries,
        refresh: refreshCountries
    } = await useAsyncData("entity/countries", async () => {
        var tempData = await service.getCountries();
        console.log("MOUNTED countries for entities", tempData.Countries);
        return tempData.Countries;
    });

    const {
        data: addressTypes,
        pending: pendingAddressTypes,
        error: errorAddressTypes
    } = await useAsyncData("entity/addressTypes", async () => {
        var tempData = await service.getAddressTypes();
        console.log("MOUNTED address types for entities", tempData.AddressTypes);
        return tempData.AddressTypes;
    });

    const entityStatuses = [
        {
            ID: 0,
            Name: "Inactif"
        },
        {
            ID: 1,
            Name: "Actif"
        }
    ];
    
    const updateEntityMode = ref(false);
    const createEntityMode = ref(false);


    //constants for collecting essential (entities) and auxiliary (entityTypes, individualTitles, countries, addressTypes) data
    const selectedCountryName = ref('');
    const selectedStatusId = ref(2);
    const selectedEntityTypeId = ref(0);
    const selectedLocalityName = ref('');

    const searchQuery = ref('');
    //const selectedEntityType: Ref<EntityType> = ref<EntityType>({ ID: 0, Name: '' });
    //const selectedStatus = ref({ Val: 0, Name: 'Inactif' });
    //const selectedCountry: Ref<Country> = ref<Country>({ ID: 0, Name: '', CountryCode: '', CanAddLocalities: 0 });
    //const selectedLocality: Ref<Locality> = ref<Locality>({ ID: 0, Town: '', ZipCode: '', State: '', ID_Country: 0, Country: { ID: 0, Name: '', CountryCode: '', CanAddLocalities: 0 } });
    

    function resetFilters() {
        //selectedEntityType.value = ({ ID: 0, Name: '' });
        //selectedStatus.value = ({ Val: 0, Name: 'Inactif' });
        //selectedCountry.value = ({ ID: 0, Name: '', CountryCode: '', CanAddLocalities: 0 });
        //selectedLocality.value = ({ ID: 0, Town: '', ZipCode: '', State: '', ID_Country: 0, Country: { ID: 0, Name: '', CountryCode: '', CanAddLocalities: 0 } });
        selectedCountryName.value = '';
        selectedEntityTypeId.value = 0;
        selectedStatusId.value = 2;
        selectedLocalityName.value = '';
        searchQuery.value = '';
    }      
    

    //variable indicating whether a selection of country has been made
    const countriesSelected = ref(false);
    //list of localities selected once a country has been selected
    const localities: Ref<Locality[]> = ref([]);


    async function RefreshEntities() {
        await refreshEntities();
    }


    //function that fetches localities based on country (country.ID)
    async function refreshLocalities(country: string ) {
        console.log(country)
        localities.value = [];              
        var data = await useAsyncData("localities", () => service.getLocalitiesByCountryName(country));
        console.log("Refresh localities raw LOCALITIES list:", data.data.value.localities);
        localities.value = data.data.value.localities;
        console.log("Refresh localities LOCALITIES list:", localities.value);
        //selectedLocality.value = ({ ID: 0, Town: '', ZipCode: '', State: '', ID_Country: 0, Country: { ID: 0, Name: '', CountryCode: '', CanAddLocalities: 0 } });
        selectedLocalityName.value = '';
    }


    //watch function which alters localities list every time a country is selected
    watch(selectedCountryName, async (newValue, oldValue) => {
        console.log("watch selected Country: OLD VALUE -", oldValue);
        console.log("watch selected Country: NEW VALUE -", newValue);
        if (newValue !== null && newValue !== oldValue && newValue!='') {
            refreshLocalities(newValue);
            countriesSelected.value = true;
        } else {
            // If no country is selected, localities list is set to empty
            localities.value = [];
        }
    }, { immediate: true });


    //variable containing a list of entities FILTERED against several parameters: NAME, TYPE, STATUS, COUNTRY, LOCALITY
    const filteredEntities = computed(() => {
        //if (entities.value && entities.value.entities) {
        if (entities.value) {
            console.log("MATCH expressions:", selectedEntityTypeId.value, selectedStatusId.value, selectedCountryName.value, selectedLocalityName.value);
            //return entities.value.entities.filter((entity: Entity) => {
            return entities.value.filter((entity:Entity) => {

                // Filtering by name
                const firstNameF = entity.FirstName?.toLowerCase() ?? "";
                const lastNameF = entity.LastName?.toLowerCase() ?? "";
                const companyNameF = entity.CompanyName?.toLowerCase() ?? "";
                const searchLower = searchQuery.value.toLowerCase();               
                const matchesTitle = firstNameF.includes(searchLower) || lastNameF.includes(searchLower) || companyNameF.includes(searchLower);
                
                let matchesEntityType = true; // Par défaut, on considère que cela correspond
                if (selectedEntityTypeId.value) {
                    matchesEntityType = entity.ID_EntityType === selectedEntityTypeId.value;
                }

                // Filtering by status - active or not
                let matchesStatus = true; // Par défaut, on considère que cela correspond
                if (selectedStatusId.value == 0 || selectedStatusId.value == 1) {
                    matchesStatus = entity.IsActive == selectedStatusId.value;
                }
                
                // Filtering by country
                let matchesCountry = true;
                if (selectedCountryName.value.length > 0) {   
                    console.log(selectedCountryName.value);
                    const countryF = entity.entityCountryForSearch?.toLowerCase() ?? "";
                    const searchCountry = selectedCountryName.value.toLowerCase();
                    matchesCountry = countryF.includes(searchCountry);
                }               

                // Filtering by locality
                let matchesLocality = true;
                if (selectedLocalityName.value.length > 0) {
                    matchesLocality = false;
                    for (let i = 0; i < entity.entityTownForSearch?.length; i++) {
                        const searchLocality = selectedLocalityName.value.toLowerCase();
                        const localityF = entity.entityTownForSearch[i]?.toLowerCase() ?? "";
                        matchesLocality = localityF.includes(searchLocality);
                        if (matchesLocality) {
                            break;
                        }
                    }
                }

                
               // console.log("MATCH expressions:", searchLower, selectedEntityTypeId.value, selectedStatusId.value, selectedCountryName.value, selectedLocalityName.value);
               // console.log("MATCH filters", matchesTitle, matchesEntityType, matchEntityStatus, matchesCountry, matchesLocality);

                // The entity should match all filters to be included in the list

                return matchesTitle && matchesEntityType && matchesStatus && matchesCountry && matchesLocality;
                //return matchesTitle ;
                //return matchesEntityType ;
                //return matchesStatus;
                //return matchesCountry;
                //return matchesLocality;
            });
        }
        return [];
    });


    //selectedEntity const contains all attributes of one entity which is selected from the list
    const selectedEntity: Ref<Entity> = ref<Entity>({
        ID: 0,
        ID_EntityType: 0,
        ID_IndividualTitle: 0,
        CreatedDate: '',
        ModifiedDate: '',
        Notes: '',
        CompanyName: '',
        FirstName: '',
        LastName: '',
        entity_type: { ID: 0, Name: '' },
        individual_title: { ID: 0, Name: '', Abbreviation: '' },
        IsActive: false
    });   


    //group of variables which are used in displaying, creating or updating an entity
    const id_EntityType = ref(0);
    const entityType: Ref<EntityType> = ref<EntityType>({ ID: 0, Name: '' });
    const id_IndividualTitle = ref(0);
    const individualTitle: Ref<IndividualTitle> = ref<IndividualTitle>({ ID: 0, Name: '', Abbreviation: '' });
    const companyName = ref('');
    const firstName = ref('');
    const lastName = ref('');
    const createdDate = ref('-');
    const modifiedDate = ref('-');
    const notes = ref('');
    const isActive = ref(false);

       
    // function itemClick() populates selectedEntity parameters and displays respective form
    function itemClick(item: Entity) {
        resetDetailViewData();
        selectedEntity.value = item;       
        console.log("Selected item", selectedEntity.value);
        entityType.value = item.entity_type!=null ? item.entity_type : ({ ID: 0, Name: '' });
        id_EntityType.value = item.ID_EntityType != null ? item.ID_EntityType:0;
        individualTitle.value = item.individual_title != null ? item.individual_title : ({ ID: 0, Name: '', Abbreviation: '' });
        id_IndividualTitle.value = item.ID_IndividualTitle != null ? item.ID_IndividualTitle:0;
        companyName.value = item.CompanyName ? item.CompanyName:'';
        firstName.value = item.FirstName ? item.FirstName:'';
        lastName.value = item.LastName ? item.LastName : '';
        createdDate.value = item.CreatedDate ? (new Date(item.CreatedDate.slice(0, 16))) : '-';
        modifiedDate.value = item.ModifiedDate ? (new Date (item.ModifiedDate.slice(0, 16))) : '-';
        notes.value = item.Notes ? item.Notes : '';
        isActive.value = item.IsActive;
        updateEntityMode.value = false;
        createEntityMode.value = false;
    }   


    // function editEntity() switches on updateMode, respective entity fields are open for changes
    function editEntity() {
        console.log("before update mode change", updateEntityMode.value);
        updateEntityMode.value = !updateEntityMode.value;
        console.log("after update mode change", updateEntityMode.value);
    }

       
    // function saveEntityUpdate() saves changes to the selected entity and forces entity list to be refreshed
    async function saveEntityUpdate() {
        console.log("Update ENTITY request DATA", selectedEntity.value.ID,
            firstName.value,
            lastName.value,
            companyName.value,
            entityType.value.ID,
            individualTitle.value.ID,
            notes.value,
            isActive.value);
        try {
            const response = await service.updateEntity(
                selectedEntity.value.ID,
                firstName.value,
                lastName.value,
                companyName.value,
                entityType.value.ID,
                individualTitle.value.ID,
                notes.value,
                isActive.value                
            );
            console.log("UPDATE response", response);
            if (response.code != 1) {
                showNotification({
                    title: response.header,
                    message: response.message,
                    code: response.code
                });
                closeDetail();
            } else {

                showNotification({
                    title: response.header,
                    message: response.message,
                    code: response.code,
                    duration: 4500
                });

                if (response.code === 1) {
                    closeDetail();
                }
                closeDetail();
                refreshEntities();
            }
        } catch (err) {
            showNotification({
                title: "Erreur critique",
                message: err,
                code: 4,
                duration: 8000
            });
        }
    }


    
    // function cancelEntityUpdate() switches off update mode for entity and populates respective fields with initial selcted entity attributes
    function cancelEntityUpdate() {
        entityType.value = selectedEntity.value.entity_type;
        id_EntityType.value = selectedEntity.value.ID_EntityType;
        individualTitle.value = selectedEntity.value.individual_title;
        id_IndividualTitle.value = selectedEntity.value.ID_IndividualTitle;
        companyName.value = selectedEntity.value.CompanyName ? selectedEntity.value.CompanyName : '';
        firstName.value = selectedEntity.value.FirstName ? selectedEntity.value.FirstName : '';
        lastName.value = selectedEntity.value.LastName ? selectedEntity.value.LastName : '';
        createdDate.value = selectedEntity.value.CreatedDate ? (new Date(selectedEntity.value.CreatedDate.slice(0, 16))) : '-';
        modifiedDate.value = selectedEntity.value.ModifiedDate ? (new Date(selectedEntity.value.ModifiedDate.slice(0, 16))) : '-';
        notes.value = selectedEntity.value.Notes ? selectedEntity.value.Notes : '';
        isActive.value = selectedEntity.value.IsActive;
        updateEntityMode.value = false;
    }

    function cancelEntityCreate() {
        closeDetail();
        createEntityMode.value = false;
    }

   
    // function closeDetail() evokes another function specializing in hiding details for selected entity and emptying respective variables
    function closeDetail() {        
        resetDetailViewData();
    }

   
    // function resetDetailViewData() hides details for selected entity and empties respective variables
    function resetDetailViewData() {
        updateEntityMode.value = false;
        createEntityMode.value = false;       
        
        emailsShown.value = false;
        selectedEmails.value = [];

        telephonesShown.value = false;
        selectedTelephones.value = [];

        addressesShown.value = false;
        selectedAddresses.value = [];

        //selectedCountryInAddressId.value = 0;
        //selectedRegionInAddressName.value = '';
        //selectedLocalitiesInAddress.value = [];
        //selectedRegionsInAddress.value = [];

        selectedEntity.value = ({
            ID: 0,
            ID_EntityType: 0,
            ID_IndividualTitle: 0,
            CreatedDate: '',
            ModifiedDate: '',
            Notes: '',
            CompanyName: '',
            FirstName: '',
            LastName: '',
            entity_type: { ID: 0, Name: '' },
            individual_title: { ID: 0, Name: '', Abbreviation: '' },
            IsActive: false
        });   
        id_EntityType.value = 0;
        entityType.value = ({ ID: 0, Name: '' });
        id_IndividualTitle.value = 0;
        individualTitle.value = ({ ID: 0, Name: '', Abbreviation: '' });
        companyName.value = '';
        firstName.value = '';
        lastName.value = '';
        createdDate.value = '-';
        modifiedDate.value = '-';
        notes.value = '';
        isActive.value = false;
    }
    
    // function openAddEntityForm() displays entity detail form in createEntity mode
    function openAddEntityForm() {
        console.log("FILTERED ENTITIES", filteredEntities);
        resetDetailViewData();
        createEntityMode.value = true;
    }


    // dialogue for confirming saving changes to entity on creation or update
    const entityConfirmationDialogue: Ref<ConfirmDialogue> = ref<ConfirmDialogue>(null);


    // function saveNewEntity() evokes confirmation dialogues and depending on the MODE - creates new entity or updates exiting one or cancels changes
    async function saveNewEntity(mode:string) {

        console.log(mode, " ENTITY request DATA ", selectedEntity.value.ID, firstName.value, lastName.value, companyName.value, entityType.value.ID, individualTitle.value.ID, notes.value, isActive.value);

        entityConfirmationDialogue.value.showConfirmation({
            title: 'Confirmation',
            message: mode === 'create' ? 'Êtes-vous sûr de vouloir ajouter cette entité?' : mode === 'update' ? 'Êtes-vous sûr de vouloir modifier cette  entité?' : '',
            yesMessage: mode === 'create' ? 'AJOUTER' : mode === 'update' ? 'MODIFIER' : '',
            
            confirmCallback: async () => {
                if (mode === 'create') {
                    const response = await service.createEntity(
                        firstName.value,
                        lastName.value,
                        companyName.value,
                        entityType.value.ID,
                        individualTitle.value.ID,
                        notes.value,
                        isActive.value
                    );
                    console.log("CREATE ENTITY response", response);
                    if (response.code != 1) {
                        showNotification({
                            title: response.header,
                            message: response.message,
                            code: response.code
                        });
                    } else {
                        showNotification({
                            title: response.header,
                            message: response.message,
                            actionMessage: "Ajout non effectué",
                            code: response.code,
                            duration: 4500
                        });

                        if (response.code === 1) {
                            refreshEntities()
                            closeDetail();
                        }
                    }
                    refreshEntities()
                    closeDetail();
                }
                else if (mode === 'update') {                    
                    try {
                        const response = await service.updateEntity(
                            selectedEntity.value.ID,
                            firstName.value,
                            lastName.value,
                            companyName.value,
                            entityType.value.ID,
                            individualTitle.value.ID,
                            notes.value,
                            isActive.value
                        );
                        console.log("UPDATE ENTITY response", response);
                        if (response.code != 1) {
                            showNotification({
                                title: response.header,
                                message: response.message,
                                code: response.code
                            });
                            refreshEntities()
                            closeDetail();
                        } else {

                            showNotification({
                                title: response.header,
                                message: response.message,
                                actionMessage: "Modification non effectuée",
                                code: response.code,
                                duration: 4500
                            });

                            if (response.code === 1) {
                                refreshEntities()
                                closeDetail();
                            }
                            refreshEntities()
                            closeDetail();
                        }
                    } catch (err) {
                        showNotification({
                            title: "Erreur critique",
                            message: err,
                            actionMessage: "Modification non effectuée",
                            code: 4,
                            duration: 8000
                        });
                    }
                }
            },
            cancelCallback: () => { }
        });
    }    


    //===========================================================================================================================================================//
    // ADDRESSES: Variable and functions required for displaying ADDRESSES for a selected entity and for performing CRUD operations on ADDRESSES
    //===========================================================================================================================================================//

    //variables - refs for pop-up elements for addding new ADDRESS or updating selected ADDRESS
    const createAddressFormComponent: Ref<AddressFormComponent> = ref<AddressFormComponent>(null);
    const updateAddressFormComponent: Ref<AddressFormComponent> = ref<AddressFormComponent>(null);


    //variables for ADDRESSes selected for a current entity
    const selectedAddress: Ref<Address> = ref<Address>(null);
    const selectedAddresses: Ref<Address[]> = ref([]);
    const addressesShown = ref(false);


    //what happens when ADDRESS pop-up closes
    const handleAddressEvent = async (addressId: number) => {
        addressesShown.value = false;
    };


    //function makes ADDRESS section visible and fetches addresses for selected entity from DB
    async function showAddresses(entity_id: number) {
        addressesShown.value = !addressesShown.value;
        console.log(addressesShown.value);
        if (addressesShown.value) {
            console.log("Selected entity ID before getting addresses", entity_id);
            var data = await useAsyncData("addresses", () => service.getAddressesByEntityId(entity_id));
            console.log(data.data.value);
            selectedAddresses.value = data.data.value ? data.data.value:[];
            console.log("ADDRESSES selected for a vue page", selectedAddresses.value);
        }
    }   


    //functions which shows concrete ADDRESS on GoogleMap
    function showOnMap(address: Address) {
        if (address.ID_Locality) {
            var addressString = [address.StreetNumber ?? '', address.StreetName ?? '', address.locality?.Town, address.locality?.State, address.locality?.ZipCode].join(' ');
            console.log(addressString);
            var mapRoute = ["http://maps.google.com/?q=", addressString].join('');
            window.open(mapRoute, "_blank");
        }
    }


    //display component to ADD ADDRESS
    function showCreateAddressComponent(ID_Entity: number) {
        var blankAddress: Address = ({
            'ID': 0,          
            'ID_Entity': ID_Entity }) as Address;
        console.log("BLANK Address to be created", blankAddress);       
        createAddressFormComponent.value.setInitialData(blankAddress);
        createAddressFormComponent.value.openForm();
    }


    //display component to UPDATE ADDRESS
    function showUpdateAddressComponent(address: Address) {
        console.log("Address to be UPDATED", address);       
        updateAddressFormComponent.value.setInitialData(address)
        updateAddressFormComponent.value.openForm();
    } 


    //===========================================================================================================================================================//
    // EMAILS: Variable and functions required for displaying EMAILS for a selected entity and then address and for performing CRUD operations on emails
    //===========================================================================================================================================================//

    //variables - refs for pop-up elements for addding new emails or updating selected email
    const createEmailFormComponent: Ref<EmailFormComponent> = ref<EmailFormComponent>(null);
    const updateEmailFormComponent = ref(null);


    //variables for emails selected for a current entity
    const selectedEmails: Ref<Email[]> = ref([]);
    const emailsShown = ref(false);


    //function makes email section visible and fetches emails from DB
    async function showEmails(address_id: number) {
        emailsShown.value = !emailsShown.value;
        if (emailsShown.value) {
            var data = await useAsyncData("emails", () => service.getEmailsByAddressId(address_id));
            console.log("EMAILS obtained for address ID", address_id, data.data.value.emails);
            selectedEmails.value = data.data.value.emails;
            console.log(selectedEmails);
        }        
    }   


    //what happens when pop-up closes
    function handleEmailEvent () {
        emailsShown.value = false;
    };


    //display component to add email
   async function showCreateEmailComponent(ID_Entity: number, ID_Address: number) {
        var ID_AT_EntityAddress = await service.getIdAtEntityAddress(ID_Entity, ID_Address);
        console.log(ID_AT_EntityAddress);
        var blankEmail: Email = ({ 'ID': 0, 'Name': '', 'ID_AT_EntityAddress': ID_AT_EntityAddress.id.ID }) as Email;      
        console.log("Email to be created", blankEmail);
        console.log(createEmailFormComponent.value);
        console.log(createEmailFormComponent === EmailFormComponent);
        console.log(EmailFormComponent);        
        createEmailFormComponent.value.setInitialData(blankEmail);
        createEmailFormComponent.value.openForm();
    }


    //display component to update email
    function showUpdateEmailComponent(email: Email) {
        console.log("EMAIL to be UPDATED", email);
        console.log("Updtae email form component", updateEmailFormComponent);
        updateEmailFormComponent.value.setInitialData(email)
        updateEmailFormComponent.value.openForm();
    }    


    //===========================================================================================================================================================//
    // TELEPHONES: Variable and functions required for displaying TELEPHONES for a selected entity and then address and for performing CRUD operations on TELEPHONES
    //===========================================================================================================================================================//

    //variables - refs for pop-up elements for addding new telephones or updating selected telephone
    const createTelephoneFormComponent: Ref<TelephoneFormComponent> = ref<TelephoneFormComponent>(null);
    const updateTelephoneFormComponent: Ref<TelephoneFormComponent> = ref<TelephoneFormComponent>(null);


    //variables for TELEPHONEs selected for a current entity
    const selectedTelephones: Ref<Telephone[]> = ref([]);
    const telephonesShown = ref(false);
    const showingPhonesFor = ref(0);


    //function makes TELEPHONE section visible and fetches telephones from DB
    async function showTelephones(address_id: number) {
        telephonesShown.value = !telephonesShown.value;
        showingPhonesFor.value = 0;
        if (telephonesShown.value) {
            var data = await useAsyncData("telephones", () => service.getTelephonesByAddressId(address_id));
            showingPhonesFor.value = address_id;
            console.log(data.data.value.telephones);
            selectedTelephones.value = data.data.value.telephones;
            console.log(selectedTelephones);
        }
    }


    //what happens when TELEPHONEs pop-up closes
    function handleTelephoneEvent() {
        telephonesShown.value = false;
    };


    //display component to add TELEPHONE
    async function showCreateTelephoneComponent(ID_Entity: number, ID_Address: number) {        
        var ID_AT_EntityAddress = await service.getIdAtEntityAddress(ID_Entity, ID_Address);
        console.log(ID_AT_EntityAddress);
        var blankTelephone: Telephone = ({'ID_AT_EntityAddress': ID_AT_EntityAddress.id.ID}) as Telephone;
        console.log("Telephone to be created", blankTelephone);        
        createTelephoneFormComponent.value.setInitialData(blankTelephone);
        createTelephoneFormComponent.value.openForm();
    }


    //display component to update TELEPHONE
    function showUpdateTelephoneComponent(telephone: Telephone) {
        console.log("TELEPHONE to be UPDATED", telephone);        
        updateTelephoneFormComponent.value.setInitialData(telephone)
        updateTelephoneFormComponent.value.openForm();

    }


    //=================================================================================================================================//
    // DELETE confirmation dialogue
    //===========================================================================================================================================================//

    //confirmation dialogue to confirm deletion
    const deleteConfirmationDialogue: Ref<ConfirmDialogue> = ref<ConfirmDialogue>(null);


    //open confirmation dialogue and on choosing SUPPRIMER calles delete function for email, telephone, address or entity
    async function openDeleteConfirmationDialog(mode: string, id: number) {
        console.log("open delete confirmation dialogue", mode, id);

        deleteConfirmationDialogue.value.showConfirmation({
            title: 'Confirmation de suppression',
            message: mode === 'email' ? 'Êtes-vous sûr de vouloir supprimer cet email ?' :mode === 'telephone' ? 'Êtes-vous sûr de vouloir supprimer cet téléphone?' :
                mode === 'address' ? 'Êtes-vous sûr de vouloir supprimer cette addresse?' : mode === 'entity' ? 'Êtes-vous sûr de vouloir supprimer cet éntité?' : '',
            yesMessage: 'SUPPRIMER',

            confirmCallback: async () => {
                try {
                    switch (mode) {
                        case 'email': {
                            const response = await service.deleteEmail(id);

                            if (response.code != 1) {
                                showNotification({
                                    title: response.header,
                                    message: response.message,
                                    code: response.code
                                });
                            }
                            else {
                                showNotification({
                                    title: response.header,
                                    message: response.message,
                                    actionMessage: "Suppression non effectuée",
                                    code: response.code,
                                    duration: 4500
                                });

                                if (response.code === 1) {
                                    //showEmails(selectedAddress.value.ID);
                                }
                                
                            }
                            
                            break;
                        }   
                        case 'telephone': {
                            const response = await service.deleteTelephone(id);

                            if (response.code != 1) {
                                showNotification({
                                    title: response.header,
                                    message: response.message,
                                    code: response.code
                                });
                            }
                            else {
                                showNotification({
                                    title: response.header,
                                    message: response.message,
                                    actionMessage: "Suppression non effectuée",
                                    code: response.code,
                                    duration: 4500
                                });

                                if (response.code === 1) {
                                   
                                }
                            }
                            break;
                        }
                        case 'address': {
                            console.log();
                            const response = await service.deleteAddress(id);

                            if (response.code != 1) {
                                showNotification({
                                    title: response.header,
                                    message: response.message,
                                    code: response.code
                                });
                            }
                            else {
                                showNotification({
                                    title: response.header,
                                    message: response.message,
                                    actionMessage: "Suppression non effectuée",
                                    code: response.code,
                                    duration: 4500
                                });

                                if (response.code === 1) {
                                   
                                }
                            }
                            break;
                        }
                        case 'entity': {
                            const response = await service.deleteEntity(id);

                            if (response.code != 1) {
                                showNotification({
                                    title: response.header,
                                    message: response.message,
                                    code: response.code
                                });
                            }
                            else {
                                showNotification({
                                    title: response.header,
                                    message: response.message,
                                    actionMessage: "Suppression non effectuée",
                                    code: response.code,
                                    duration: 4500
                                });

                                if (response.code === 1) {
                                  
                                }
                            }
                            break;
                        }
                        default:
                        // code block
                    }
                    
                } catch (err) {
                    showNotification({
                        title: "Erreur critique",                       
                        message: err.message || "Erreur lors de la suppression de l'article.",
                        actionMessage: "Suppression non effectuée",
                        code: 4
                    });
                }
            },
            cancelCallback: () => { },
        });
        switch (mode) {
            case 'email':                
                emailsShown.value = false;
                break;
            case 'telephone':
                telephonesShown.value = false;
                break;
            case 'address':
                addressesShown.value = false;
            case 'entity':
                refreshEntities();
                closeDetail();
                break;
            default:
                break;
        }
    }
    */
</script>


<template>
    <EmailFormComponent ref="createEmailFormComponent" mode="create" :onEmailEvent="handleEmailEvent" />
    <EmailFormComponent ref="updateEmailFormComponent" mode="update" :onEmailEvent="handleEmailEvent" />

    <TelephoneFormComponent ref="createTelephoneFormComponent" mode="create" :countryOptions="countries" :onTelephoneEvent="handleTelephoneEvent" />
    <TelephoneFormComponent ref="updateTelephoneFormComponent" mode="update" :countryOptions="countries" :onTelephoneEvent="handleTelephoneEvent" />

    <AddressFormComponent ref="createAddressFormComponent" mode="create" :countryOptions="countries" :addressTypeOptions="addressTypes" :onAddressEvent="handleAddressEvent" />
    <AddressFormComponent ref="updateAddressFormComponent" mode="update" :countryOptions="countries" :addressTypeOptions="addressTypes" :onAddressEvent="handleAddressEvent" />

    <ConfirmDialogue ref="entityConfirmationDialogue" />
    <ConfirmDialogue ref="deleteConfirmationDialogue" />

    <FloatingMessage ref="notification"/>
    <div class="content">
        <div class="search-container">
            <div class="inputs-container">
                <!--Input element for searching for entities based on their names-->
                <input v-model="searchQuery" type="text" placeholder="Rechercher un client..."
                       class="custom-text-input search-entity">

                <button class="blue-button" @click="RefreshEntities()" v-if="!pendingEntities">
                    <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14"
                         data-testid="Icon::bold/interface-arrows-synchronize" height="1em" width="1em" class="">
                        <path d="M14 10.18l-.5-1.92a.76.76 0 00-.91-.55l-1.93.49a.75.75 0 00-.56.61.77.77 0 00.36.76l.36.21a.28.28 0 01.12.18.25.25 0 01-.07.2A5.47 5.47 0 017 12a5.05 5.05 0 01-4.72-3.29.74.74 0 00-1-.44.74.74 0 00-.44 1A6.56 6.56 0 007 13.52a7 7 0 005.24-2.64.25.25 0 01.32-.05l.3.18a.79.79 0 00.39.11.75.75 0 00.73-.94zM1.41 6.29l1.93-.49a.75.75 0 00.56-.61.77.77 0 00-.36-.76l-.31-.18a.28.28 0 01-.12-.18.27.27 0 01.07-.21A5.47 5.47 0 017 2a5.05 5.05 0 014.72 3.31.75.75 0 101.4-.52A6.56 6.56 0 007 .48a7.07 7.07 0 00-5.19 2.67.25.25 0 01-.32.05L1.14 3A.76.76 0 00.3 3a.77.77 0 00-.3.82l.5 1.92a.76.76 0 00.73.57z">
                        </path>
                    </svg>
                </button>
                <!--Custom elements for searching for entities based on their type, status, country and locality (the latter onle once a country has been selected)-->
                <CustomComboBox :options="entityTypes" v-model="selectedEntityTypeId" option-value-key="ID"
                                option-text-key="Name" placeholder="Type d'entité..." class="form-control model-list" />
                <CustomComboBox :options="entityStatuses" v-model="selectedStatusId" option-value-key="ID"
                                option-text-key="Name" placeholder="Statut..." class="form-control model-list" />
                <CustomComboBox :options="countries" v-model="selectedCountryName" option-value-key="Name"
                                option-text-key="Name" placeholder="Pays..." class="form-control model-list" />
                <CustomComboBox v-if="countriesSelected":options="localities" v-model="selectedLocalityName" option-value-key="Town"
                                option-text-key="Town" placeholder="Ville/Village..." class="form-control model-list" />
                <!--Button that resets search filters-->
                <button class="blue-button" @click="resetFilters">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-clear-all" width="24" height="24"
                         viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                         stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M8 6h12" />
                        <path d="M6 12h12" />
                        <path d="M4 18h12" />
                    </svg>
                    Réinitialiser les filtres
                </button>

            </div>
        </div>
        <div class="global-container">
            <!--<div class="list-container" v-if="entities && entities.entities">-->
            <!--Section with a button for adding new elements and a custom list element containing references to all found (or filtered) entities-->
            <div class="list-container" v-if="filteredEntities">
                <button class="tiny-button bg-b6 w-full fs-15rem fw-bold" @click="openAddEntityForm" title="Ajouter une entité">+</button>
                <CustomListView ref="listView" v-model="selectedEntity" :items="filteredEntities" :allow-selection="true"
                                :show-details="true" :allow-deselection="false" class="entity-listview">
                    <template v-slot:entityItem="{ item }">
                        <div class="entity-row-item" @click="itemClick(item)">
                            <p v-if="item.FirstName && item.LastName">{{ item.FirstName }} {{ item.LastName }}</p>
                            <p v-else>{{ item.CompanyName }}</p>
                            <span class="tooltiptext">{{item.entityCountryForSearch}}, {{item.entityTownForSearch}}, {{item.entityAdressesForSearch}}</span>
                        </div>
                    </template>
                </CustomListView>
            </div>

            <!--Section for displaying information for one selected entity or for adding a new entity-->
            <div class="bg-b7 br-5 w-full flex-c a-top h-full overflow-auto" v-if="selectedEntity.ID!=0 || createEntityMode">
                <div class="bg-b7 b-b3 br-5 mb-2 flex-c a-top w-full p-2">
                    <!--Button stock referring to selected entity-->
                    <div class="flex-r b-t w-full j-bottom" v-if="!createEntityMode">
                        <!--BUTTONS for editing selected entity-->
                        <button class="tiny-button w-auto h-auto flex-r j-center a-center"
                                :class="{'bg-b4':updateEntityMode}"
                                @click="editEntity()"
                                title="Editer l'entité">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                            </svg>
                        </button>
                        <!--BUTTONS for deleting selected entity-->
                        <button class="tiny-button w-auto h-auto flex-r j-center a-center" @click="openDeleteConfirmationDialog('entity', selectedEntity.ID)" title="Supprimer l'entité">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                        </button>
                        <!--Custom button which closes details section for selected entity and flushes respective variables -->
                        <button class="tiny-button w-auto h-auto flex-r j-center a-center" @click="closeDetail" title="Masquer les détails">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>

                    </div>

                    <div class="flex-r b-t w-full j-bottom" v-else>
                        <!--BUTTON for adding newly created entity-->
                        <button class="tiny-button w-auto h-auto flex-r j-center a-center" @click="saveNewEntity('create')" title="Ajouter une entité">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                            </svg>
                        </button>
                        <!--BUTTON for cancelling adding entity and closing the form -->
                        <button class="tiny-button w-auto h-auto flex-r j-center a-center" @click="cancelEntityCreate()" title="Annuler l'ajouté'">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>

                    </div>

                    <div class="flex-r b-t w-full h-20 a-top mb-2">
                        <!--Display ISACTIVE for selected entity-->
                        <div class="flex-c f-1 b-t a-top">
                            <label class="detail-label">ACTIVE</label>
                            <input type="checkbox"
                                   v-bind:disabled="!updateEntityMode && !createEntityMode"
                                   v-model="isActive">
                        </div>
                        <!--Display TYPE for selected entity as an input for DISPLAY mode-->
                        <div v-if="!updateEntityMode && !createEntityMode" class="flex-c f-2 b-t f-3 ">
                            <label class="detail-label ml-5">TYPE</label>
                            <input class="detail-input  ml-2 pl-2"
                                   disabled
                                   placeholder="Type de l'enterprise ou personne particulière"
                                   v-model="entityType.Name" />
                        </div>
                        <!--Display TYPE for selected entity as select for CREATE or UPDATE mode-->
                        <div v-else class="flex-c f-2 b-t f-3">
                            <label class="detail-label w-60 ml-5">TYPE</label>
                            <select class="detail-input w-75 ml-2 mr-5 pl-2"
                                    v-model="entityType"
                                    required>
                                <option v-for="(item, key) in entityTypes" :value="item">
                                    {{item.Name}}
                                </option>
                            </select>

                        </div>
                        <!--If entity type is selected (not equal to 0) and is a private person, display/update/add individual title, first and last name-->
                        <div v-if="entityType.ID==1" class="flex-r a-top b-t f-4">
                            <!--Display INDIVIDUAL TITLE for selected entity-->
                            <div v-if="!updateEntityMode && !createEntityMode" class="flex-c f-2 b-t f-3 ">
                                <label class="detail-label w-60 ml-5">TITRE DE CIVILITÉ</label>
                                <input class="detail-input ml-2 pl-2"
                                       disabled
                                       placeholder="Titre de civilité manquant"
                                       v-model="individualTitle.Name" />
                            </div>
                            <div v-else class="flex-c f-2 b-t f-3">
                                <label class="detail-label w-60 ml-5">TITRE DE CIVILITÉ</label>
                                <select class="detail-input  ml-2 mr-5 pl-2"
                                        v-model="individualTitle"
                                        required>
                                    <option v-if="ID_IndividualTitle==0">Choisir titre de civilité...</option>
                                    <option v-for="(item, key) in individualTitles" :value="item">
                                        {{item.Name}}
                                    </option>
                                </select>
                            </div>
                            <!--Display FIRST NAME for selected entity-->
                            <div class="flex-c b-t f-3">
                                <label class="detail-label w-60 ml-5">PRENOM</label>
                                <input class="detail-input w-90 ml-2 pl-2 ta-center"
                                       v-bind:disabled="!updateEntityMode && !createEntityMode"
                                       placeholder="Prenom de personne particulière..."
                                       v-model="firstName"
                                       required />
                            </div>
                            <!--Display LAST NAME for selected entity-->
                            <div class="flex-c b-t f-3">
                                <label class="detail-label w-60 ml-5">NOM</label>
                                <input class="detail-input w-90 ml-2 pl-2 ta-center"
                                       v-bind:disabled="!updateEntityMode && !createEntityMode"
                                       placeholder="Nom de personne particulière..."
                                       v-model="lastName"
                                       required />
                            </div>

                        </div>
                        <!--If entity type is selected (not equal to 0) and is an enterprise, display/update/add COMPANY name-->
                        <div v-if="entityType.ID==2 || entityType.ID==3" class="flex-c b-t f-4">
                            <!--Display COMPANY NAME for selected entity-->
                            <label class="detail-label w-60 ml-5">NOM D'ENTERPRISE</label>
                            <input class="detail-input w-90 ml-2 pl-2"
                                   v-bind:disabled="!updateEntityMode && !createEntityMode"
                                   placeholder="Nom de l'enterprise..."
                                   v-model="companyName"
                                   required />

                        </div>
                        <!--If the entity is just displayed (NOT created or updated), show when it was added and when last modified-->
                        <div v-if="!updateEntityMode && !createEntityMode" class="flex-c f-3 b-t j-top">
                            <!--Display CREATED DATE for selected entity-->
                            <label class="detail-label w-60 ml-5">AJOUTÉ POUR LA PREMIERE FOIS</label>
                            <input class="detail-input w-90 ml-2 pl-2"
                                   disabled
                                   v-bind:value="createdDate" />
                            <!--Display MODIFIED DATE for selected entity-->
                            <label class="detail-label w-60 ml-5">DERNIÈRE MODIFICATION</label>
                            <input class="detail-input w-90 ml-2 pl-2"
                                   disabled
                                   v-bind:value="modifiedDate" />

                        </div>
                    </div>
                    <!--Display NOTES for one selected entity-->
                    <div class="flex-r b-t w-full a-top">
                        <div class="f-13 flex-c b-t j-top">
                            <label class="detail-label w-60 ml-5">NOTES</label>
                            <textarea class="detail-input w-full h-auto" v-bind:disabled="!updateEntityMode && !createEntityMode" v-model="notes">{{notes}}</textarea>
                        </div>
                        <!--Buttons for saving or discarding update changes for entities-->
                        <div v-if="updateEntityMode" class="f-1 flex-c a-bottom j-bottom b-t p-2">
                            <button class="tiny-button w-10 h-auto flex-r j-center a-center mb-2" @click="saveNewEntity('update')" title="Enregistrer les modifications">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                                </svg>
                            </button>

                            <button class="tiny-button w-10 h-auto flex-r j-center a-center" @click="cancelEntityUpdate" title="Annuler les modifications">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                </div>



                <!--Display ADDRESSES for one selected entity-->
                <div v-if="!createEntityMode" class="bg-b7 b-b3 br-5 mb-2 flex-c w-full a-top p-2">
                    <div class="f-1 flex-r a-top mb-2">
                        <button class="tiny-button w-10 flex-r j-center a-center" @click="showAddresses(selectedEntity.ID)">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path v-if="addressesShown" stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                                <path v-else stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                            </svg>
                        </button>
                        <label class="detail-label w-40 ml-5 a-center">ADDRESSE(S)</label>
                    </div>
                    <div v-if="addressesShown" class="f-2 w-full">
                        <div v-for="(address, index) in selectedAddresses" :key="`entry-${address.ID}`" class="mb-2">
                            <div class="flex-r a-top mb-2">
                                <!--Showing address elements-->
                                <div class="f-13 flex-c a-top ">
                                    <div class="flex-r a-top">
                                        <div class="f-2 flex-c a-top">
                                            <label class="detail-label w-90">ADDRESSE PRINCIPAL</label>
                                            <input class="detail-input ml-5"
                                                   type="checkbox"
                                                   disabled
                                                   v-bind:checked="address.IsMainAddress"/>
                                        </div>
                                        <div class="f-3 flex-c a-top bg-t w-auto">
                                            <label class="detail-label  ml-2">TYPE</label>
                                            <div class="f-3 flex-r a-top " v-for="(type, index) in address.address_types" :key="`entry-${type.ID}`">
                                                <input type="checkbox" value="type.Name" checked disabled>
                                                <label class="detail-label  ml-2">{{type.Name}}</label><br>
                                            </div>
                                        </div>
                                        <div class="f-3 flex-c a-top">
                                            <label class="detail-label  ml-2">PAYS</label>
                                            <input class="detail-input  w-90" v-bind:value="address.locality?.country.Name" disabled />
                                        </div>
                                        <div class="f-3 flex-c a-top">
                                            <label class="detail-label  ml-2">RÉGION</label>
                                            <input class="detail-input w-90" v-bind:value="address.locality?.State" disabled />
                                        </div>
                                        <div class="f-3 flex-c a-top">
                                            <label class="detail-label  ml-2">LOCALITÉ</label>
                                            <input class="detail-input  w-90" v-bind:value="address.locality?.Town" disabled />
                                        </div>
                                        <div class="f-3 flex-c a-top">
                                            <label class="detail-label  ml-2">CODE POSTAL</label>
                                            <input class="detail-input  w-90" v-bind:value="address.locality?.ZipCode" disabled />
                                        </div>
                                        <div class="f-3 flex-c a-top">
                                            <label class="detail-label ml-2">RUE</label>
                                            <input class="detail-input w-90" v-bind:value="address.StreetName" placeholder="Chemin..." disabled />
                                        </div>
                                        <div class="f-1 flex-c a-top">
                                            <label class="detail-label ml-2">NUMERO</label>
                                            <input class="detail-input w-90" v-bind:value="address.StreetNumber" placeholder="Numéro de bâtiment..." disabled />
                                        </div>
                                        <div class="f-2 flex-c  a-top">
                                            <label class="detail-label ml-2">BOITE POSTAL</label>
                                            <input class="detail-input  w-90" v-bind:value="address.PostalBox" placeholder="Bôite postale..." disabled />
                                        </div>
                                    </div>

                                    <div class="w-full flex-c a-top ">
                                        <label class="detail-label  ml-5">REMARQUES</label>
                                        <textarea class="detail-input w-90 ta-top" v-bind:disabled="!updateMode" placeholder="Remarques...">{{address.Notes}}</textarea>
                                    </div>

                                </div>
                                <!--Button stock for showing locality on the map, updating or deleting address-->
                                <div class="f-1 flex-c  a-top ">
                                    <button class="tiny-button  w-10 h-auto flex-r j-center a-center" @click="showOnMap(address)" title='Afficher sur la carte'>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                        </svg>
                                    </button>
                                    <button class="tiny-button  w-10 h-auto flex-r j-center a-center" @click="showUpdateAddressComponent(address)" title="Editer l'address">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                        </svg>
                                    </button>
                                    <button class="tiny-button w-10 h-auto flex-r j-center a-center" @click="openDeleteConfirmationDialog('address', address.ID)" title="Supprimer l'address">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                    </button>
                                </div>

                            </div>

                            <!--Display TELEPHONES for one selected address-->
                            <div class="bg-b7 b-b3 br-5 mb-2 f-4 flex-c a-top  w-full p-2">
                                <div class="flex-r  a-top mb-2">
                                    <button class="tiny-button w-10 flex-r j-center a-center" @click="showTelephones(address.ID)">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                            <path v-if="telephonesShown && showingPhonesFor==address.ID" stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                                            <path v-else stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                        </svg>
                                        <!--<path v-if="telephonesShown" d="M0 14 L7 0 L14 14" class="line-class"></path> <path v-else d="M0 0 L7 14 L14 0" class="line-class"></path>-->
                                    </button>
                                    <label class="detail-label w-40 ml-5 a-center">TÉLÉPHONE(S)</label>
                                </div>
                                <div v-if="telephonesShown && showingPhonesFor==address.ID" class="mb-2 w-full">
                                    <div v-for="(telephone, index) in selectedTelephones" :key="`entry-${index}`" class="flex-c a-top mb-2 ">
                                        <div class="w-full flex-r a-top">
                                            <input class="detail-input w-20" v-bind:value="telephone.telephone_type.Name" v-bind:disabled="!updateMode" />
                                            <input class="detail-input  w-20" v-bind:value="telephone.international_code.Code" v-bind:disabled="!updateMode" />
                                            <input class="detail-input  w-30" v-bind:value="telephone.PhoneNumber" v-bind:disabled="!updateMode" />
                                            <button class="tiny-button w-auto h-auto flex-r j-center a-center" @click="showUpdateTelephoneComponent(telephone)" title="Editer le téléphone">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">


                                                    <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                                </svg>
                                            </button>
                                            <button class="tiny-button w-auto h-auto flex-r j-center a-center" @click="openDeleteConfirmationDialog('telephone', telephone.ID)" title="Supprimer le téléphone">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <button v-if="selectedTelephones " class="tiny-button w-10 h-auto flex-r j-center a-center" @click="showCreateTelephoneComponent(selectedEntity.ID, address.ID)" title="Ajouter un nouvel téléphone">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 25 25" stroke-width="1.5" stroke="currentColor" class="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                        </svg>
                                    </button>
                                    <div v-if="!selectedTelephones" class="flex-c a-top j-center">
                                        <input class="detail-input w-90 mb-2"
                                               disabled
                                               value="Aucun téléphone à afficher" />
                                        <button class="tiny-button w-10 h-auto flex-r j-center a-center" @click="showCreateTelephoneComponent(selectedEntity.ID, address.ID)" title="Ajouter un nouvel téléphone">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 25 25" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                            </svg>
                                        </button>
                                    </div>

                                </div>
                            </div>
                            <!--Display EMAILS for one selected entity-->
                            <div class="bg-b7 b-b3 mb-2 br-5 p-2">
                                <div class="flex-r a-top mb-2 w-full ">
                                    <button class="tiny-button w-10 flex-r j-center a-center" @click="showEmails(address.ID)">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                            <path v-if="emailsShown" stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                                            <path v-else stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                        </svg>
                                    </button>
                                    <label class="detail-label w-40 ml-5 a-center">EMAIL(S)</label>
                                </div>
                                <div v-if="emailsShown" class="">
                                    <div v-for="(email, index) in selectedEmails" :key="`entry-${index}`" class="mb-2">
                                        <div class="w-full flex-r a-top ">
                                            <input class="detail-input  w-50" v-bind:value="email.Name" v-bind:disabled="!updateMode" />
                                            <button class="tiny-button w-auto h-auto flex-r j-center a-center" @click="showUpdateEmailComponent(email)" title="Editer l'email">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                                </svg>
                                            </button>
                                            <button class="tiny-button w-auto h-auto flex-r j-center a-center" @click="openDeleteConfirmationDialog('email', email.ID)" title="Supprimer l'email">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <button v-if="selectedEmails" class="tiny-button w-10 h-auto flex-r j-center a-center" @click="showCreateEmailComponent(selectedEntity.ID, address.ID)" title="Ajouter un nouvel email">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 25 25" stroke-width="1.5" stroke="currentColor" class="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                        </svg>
                                    </button>
                                    <div v-if="!selectedEmails" class="flex-c a-top j-center">
                                        <input class="detail-input w-90 mb-2"
                                               disabled
                                               value="Aucun email à afficher" />
                                        <button class="tiny-button w-10 h-auto flex-r j-center a-center" @click="showCreateEmailComponent(selectedEntity.ID, address.ID)" title="Ajouter un nouvel email">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 25 25" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!--Template to show when address is not there-->
                        <!--button to add new address to selected Entity, calls an addressPopUp component-->
                        <div v-if="selectedAddresses.length>0" class="f-1 flex-c  a-center mb-2">
                            <button class="tiny-button  w-10 h-auto flex-r j-center a-center" @click="showCreateAddressComponent(selectedEntity.ID)" title="Ajouter une nouvelle adresse">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 25 25" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                </svg>
                            </button>
                        </div>
                        <div v-else class="flex-c a-top mb-2 w-full bg-t">
                            <input class="detail-input w-50 h-auto mb-2"
                                   disabled
                                   value="Aucun addresse à afficher" />
                            <!--button to add new address to selected Entity, calls an addressPopUp component-->
                            <button class="tiny-button  w-10 h-auto flex-r j-center a-center" @click="showCreateAddressComponent(selectedEntity.ID)" title="Ajouter une nouvelle adresse">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 25 25" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                </svg>
                            </button>
                        </div>


                    </div>
                        <div>
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
        border:1px solid white;
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
        height: calc(100vh - 150px);
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
     
        height: calc(100vh - 280px);
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
    

    .details-right-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 50%;
        padding: 10px;
    }

    .details-left-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 50%;
        padding: 10px;
    }

    .details-left-inner-container {
        width: 100%;
        max-width: 400px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .detail-row {
        display: flex;
        justify-content: flex-start;
        width: 100%;
        margin-bottom: 5px;
    }

 
    .detail-value {
        text-align: left;
    }

    .licence-serial-number {
        width: 400px;
        height: 130px;
        overflow-y: auto;
        background-color: rgba(000, 000, 000, 0.2);
        padding: 5px;
        border: 1px solid black;
    }

    .licence-serial-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px;
    }

    .left-license-serial-container {
        flex: 3;
        text-align: center;
    }

    .right-license-serial-container {
        flex: 1;
        text-align: center;
        border-left: 1px solid black;
    }

    .licence-serial-title {
        text-align: center;
        font-weight: bold;
        margin-right: 40px;
    }

    .licence-serial-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px;
    }

    .licence-serial-buttons-container {
        display: flex;
        flex-direction: column;
        gap: 5px;
        margin-left: 10px;
    }
</style>
