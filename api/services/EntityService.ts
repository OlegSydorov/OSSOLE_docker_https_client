import type Country from '../models/Country';
import type Entity from '../models/Entity';
import type EntityType from '../models/EntityType';
import type Address from '../models/Address';
import type Locality from '../models/Locality';
import type Email from '../models/Email';
import type Telephone from '../models/Telephone';
import type IndividualTitle from '../models/IndividualTitle';
import type IntTelDialCode from '../models/IntTelDialCode';
import type TelephoneType from '../models/TelephoneType';
import type AddressType from '../models/AddressType';
import type Message from '../models/Message';
import type Region from '../models/Region';

import { ApiServiceBase } from "./ApiServiceBase";

export default class EntityService  extends ApiServiceBase {

   // protected config = useRuntimeConfig();
  //  protected apiConfig = this.config.public.api;
  //  protected baseUrl = this. apiConfig.baseUrl;
    protected midUrl = "/entity";
    protected getUrl = "/get/";
    protected addUrl = "/add/";
    protected deleteUrl = "/delete/";
    protected updateUrl = "/update/";
    
    //=====================================================================================================//
    //ENTITY crud functions
    //=====================================================================================================//
    public async getEntities(): Promise<Entity[]> {
        //const response = await this.call(this.baseUrl + this.midUrl + this.getUrl + `entities`);
        const response = await this.call(this.midUrl + this.getUrl + `entities`);        

        const jsonData = await response.json()
        console.log("JSON", jsonData);    
        console.log(response);
        return jsonData;
    }

    public async getEntityByID(id: Number): Promise<Entity> {
        //const response = await fetch(this.baseUrl + this.midUrl + this.getUrl + `entityByID / id=${ id }`);       
        const response = await this.call(this.midUrl + this.getUrl + `entityByID / id=${id}`);       
        const jsonData = await response.json()
        console.log("entity by id JSON", jsonData);    
        console.log(response);
        return jsonData;
    }

    async getEntityByLocalityID(
        locality_id: number
    ): Promise<Entity[]> {
        //const response = await fetch(this.baseUrl + this.midUrl + this.getUrl + `entityByLocalityID/locality_id=${locality_id}`);
        const response = await this.call(this.midUrl + this.getUrl + `entityByLocalityID/locality_id=${locality_id}`);
        const jsonData = await response.json()
        console.log("entities by locality id JSON", jsonData);
        console.log(response);
        return jsonData;
    }

    async getEntityByCountryID(
        country_id: number
    ): Promise<Entity[]> {
        //const response = await fetch(this.baseUrl + this.midUrl + this.getUrl + `entityByCountryID/country_id=${country_id}`);
        const response = await this.call(this.midUrl + this.getUrl + `entityByCountryID/country_id=${country_id}`);
        //const jsonData = await response.json()
        //console.log("entities by country id JSON", jsonData);
        console.log(response);
        return response;
    }

    async getEntityByStatus(
        status: number):
        Promise<Entity[]> {
        //const response = await fetch(this.baseUrl + this.midUrl + this.getUrl + `entityByStatus/status=${status}`);
        const response = await this.call(this.midUrl + this.getUrl + `entityByStatus/status=${status}`);
        //const jsonData = await response.json()
        //console.log("entities by status JSON", jsonData);
        console.log(response);
        return response;
    }

    async getEntityByAdminUnit(
        admin_unit: string
    ): Promise<Entity[]> {
        //const response = await fetch(this.baseUrl + this.midUrl + this.getUrl + `entityByAdminUnit/admin_unit=${admin_unit}`);
        const response = await this.call(this.midUrl + this.getUrl + `entityByAdminUnit/admin_unit=${admin_unit}`);
        //const jsonData = await response.json()
        //console.log("entities by admin unit JSON", jsonData);
        console.log(response);
        return response;
    }

    async getEntityByEntityTypeID(
        entity_type_id: number
    ): Promise<Entity[]> {
        //const response = await fetch(this.baseUrl + this.midUrl + this.getUrl + `ntityByEntityTypeID/entity_type_id=${entity_type_id}`);
        const response = await this.call(this.midUrl + this.getUrl + `ntityByEntityTypeID/entity_type_id=${entity_type_id}`);
        //const jsonData = await response.json()
        //console.log("entities by entity id JSON", jsonData);
        console.log(response);
        return response;
    }

    async createEntity(        
        FirstName: string,
        LastName: string,
        CompanyName:string,
        ID_EntityType: number,
        ID_IndividualTitle: number,
        Notes: string,
        IsActive: boolean
    ): Promise<Message> {

        console.log("Data received in the addEntityService", FirstName,LastName,CompanyName,ID_EntityType,ID_IndividualTitle,Notes,IsActive);

        //const url = `${this.baseUrl}${this.midUrl}${this.addUrl}entity/`;
        const url = `${this.midUrl}${this.addUrl}entity/`;

        try {
            const response = await this.call (url,
                {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        FirstName: FirstName,
                        LastName: LastName,
                        CompanyName: CompanyName,
                        ID_EntityType: ID_EntityType,
                        ID_IndividualTitle: ID_IndividualTitle,
                        Notes: Notes,
                        IsActive: IsActive
                    }),
                }
            );
           // const responseJson = await response.json();
            console.log(response);

            if (!response.ok) {
                console.error('Failed to add ENTITY:', response);
                throw new Error(`Add  ENTITY failed: ${response}`);
            }

            //console.log(" ENTITY add response: ", responseJson);
            //return response;
            const message: Message = {
                header: 'Save Invoice method complete without errors',
                message: response,
                code: 200
            }
            return message;
        } catch (error) {
            console.error('Error in ADD ENTITY:', error);
            throw error;
        }
    }

    async deleteEntity(id: number): Promise<Message> {

        console.log("Data received in the delete ENTITY Service", id);
        //const url = `${this.baseUrl}${this.midUrl}${this.deleteUrl}entity/id=${id}`;
        const url = `${this.midUrl}${this.deleteUrl}entity/id=${id}`;
        console.log(url);
        try {

            const response = await this.call(url, {
                headers: { "Content-Type": "application/json" },
                method: 'DELETE'

            });

           // const responseJson = await response.json();

            if (!response.ok) {
               // console.error('Failed to delete ENTITY:', responseJson);
                throw new Error(`Delete ENTITY failed: ${response}`);
            }

            //console.log("ENTITY delete response: ", responseJson);
            const message: Message = {
                header: 'Save Invoice method complete without errors',
                message: response,
                code: 200
            }
            return message;
        } catch (error) {
            console.error('Error in delete ENTITY:', error);
            throw error;
        }
    }

    async updateEntity(
        ID: number,
        FirstName: string,
        LastName: string,
        CompanyName: string,
        ID_EntityType: number,
        ID_IndividualTitle: number,
        Notes: string,
        IsActive: boolean): Promise<Message> {

        console.log("Data received in the update ENTITY Service", ID, FirstName, LastName, CompanyName, ID_EntityType, ID_IndividualTitle, Notes, IsActive);


        //const url = `${this.baseUrl}${this.midUrl}${this.updateUrl}entity/`;
        const url = `${this.midUrl}${this.updateUrl}entity/`;
        try {
            const response = await this.call(url, {
                headers: { "Content-Type": "application/json" },
                method: 'PATCH',
                body: JSON.stringify({
                    ID: ID,
                    FirstName: FirstName,
                    LastName: LastName,
                    CompanyName: CompanyName,
                    ID_EntityType: ID_EntityType,
                    ID_IndividualTitle: ID_IndividualTitle,
                    Notes: Notes,
                    IsActive: IsActive
                }),
            });

           // const responseJson = await response.json();

            if (!response.ok) {
               // console.error('Failed to update ENTITY:', responseJson);
                throw new Error(`Update ENTITY failed: ${response}`);
            }

          //  console.log("ENTITY update response: ", responseJson);
            const message: Message = {
                header: 'Save Invoice method complete without errors',
                message: response,
                code: 200
            }
            return message;
        } catch (error) {
            console.error('Error in update ENTITY:', error);
            throw error;
        }
    }


   //=====================================================================================================//
   // Address CRUD functions
   //=====================================================================================================//
   
    async getAddressesByEntityId(entity_id: number): Promise<Address[]> {
        //const response = await fetch(this.baseUrl + this.midUrl + this.getUrl + `addressesByEntityID/entity_id=${entity_id}`);
        const response = await this.call(this.midUrl + this.getUrl + `addressesByEntityID/entity_id=${entity_id}`);
       // const jsonData = await response.json()
       // console.log("addresses JSON", jsonData);
     //   const addressesData = jsonData.addresses;
       // console.log("addresses JSON", addressesData);
        console.log(response);
        return response;
    }
    
    async createAddress(
        ID_Locality: number,
        ID_Entity: number,
        StreetName: string,
        StreetNumber: string,
        PostalBox: string,
        Notes: string,
        IsMainAddress: boolean,
        AddressTypes:number[]
    ): Promise<Message> {

        console.log("Data received in the addAddressService", ID_Locality, ID_Entity, StreetName, StreetNumber, PostalBox, Notes, IsMainAddress, AddressTypes);

        //const url = `${this.baseUrl}${this.midUrl}${this.addUrl}address/`;
        const url = `${this.midUrl}${this.addUrl}address/`;

        try {
            const response = await this.call(url,
                {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ID_Locality: ID_Locality,
                        ID_Entity: ID_Entity,
                        StreetName: StreetName,
                        StreetNumber: StreetNumber,
                        PostalBox: PostalBox,
                        Notes: Notes,
                        IsMainAddress: IsMainAddress,
                        AddressTypes:AddressTypes
                    }),
                }
            );
          //  const responseJson = await response.json();

            if (!response.ok) {
            //    console.error('Failed to add ADDRESS:', responseJson);
                throw new Error(`Add  ADDRESS failed: ${response}`);
            }

           // console.log(" ADDRESS add response: ", responseJson);
            //return responseJson;
            const message: Message = {
                header: 'Save Invoice method complete without errors',
                message: response,
                code: 200
            }
            return message;
        } catch (error) {
            console.error('Error in addAddress:', error);
            throw error;
        }
    }

    async deleteAddress(id: number): Promise<Message> {

        console.log("Data received in the deleteAddressService", id);
        //const url = `${this.baseUrl}${this.midUrl}${this.deleteUrl}address/id=${id}`;
        const url = `${this.midUrl}${this.deleteUrl}address/id=${id}`;
        console.log(url);
        try {

            const response = await this.call(url, {
                headers: { "Content-Type": "application/json" },
                method: 'DELETE'

            });

           // const responseJson = await response.json();

            if (!response.ok) {
             //   console.error('Failed to delete ADDRESS:', responseJson);
                throw new Error(`Delete ADDRESS failed: ${response}`);
            }

          //  console.log("ADDRESS delete response: ", responseJson);
           // return responseJson;
            const message: Message = {
                header: 'Save Invoice method complete without errors',
                message: response,
                code: 200
            }
            return message;
        } catch (error) {
            console.error('Error in deleteADDRESS:', error);
            throw error;
        }
    }

    async updateAddress(
        ID: number,        
        ID_Locality: number,
        ID_Entity: number,
        StreetName: string,
        StreetNumber: string,
        PostalBox: string,
        Notes: string,
        IsMainAddress: boolean,
        AddressTypes: number[]): Promise<Message> {

        console.log("Data received in the updateAddress Service", ID, ID_Locality, ID_Entity, StreetName, StreetNumber, PostalBox, Notes, IsMainAddress, AddressTypes);

        //const url = `${this.baseUrl}${this.midUrl}${this.updateUrl}address/`;
        const url = `${this.midUrl}${this.updateUrl}address/`;
        try {
            const response = await this.call(url, {
                headers: { "Content-Type": "application/json" },
                method: 'PATCH',
                body: JSON.stringify({
                    ID: ID,
                    ID_Locality: ID_Locality,
                    ID_Entity: ID_Entity,
                    StreetName: StreetName,
                    StreetNumber: StreetNumber,
                    PostalBox: PostalBox,
                    Notes: Notes,
                    IsMainAddress: IsMainAddress,
                    AddressTypes: AddressTypes  
                }),
            });

        //    const responseJson = await response.json();

            if (!response.ok) {
              //  console.error('Failed to update ADDRESS:', responseJson);
                throw new Error(`Update ADDRESS failed: ${response}`);
            }

           // console.log("ADDRESS update response: ", responseJson);
           // return responseJson;
            const message: Message = {
                header: 'Save Invoice method complete without errors',
                message: response,
                code: 200
            }
            return message;
        } catch (error) {
            console.error('Error in update ADDRESS:', error);
            throw error;
        }
    }


    //=====================================================================================================//
    // LOCALITY CRUD functions
    //=====================================================================================================//
    async getLocalities(
        country_id: number
    ): Promise<Locality[]> {
        //const response = await fetch(this.baseUrl + this.midUrl + this.getUrl + `localities/country_id=${country_id}`);
        const response = await this.call(this.midUrl + this.getUrl + `localities/country_id=${country_id}`);
        //const jsonData = await response.json()
        //console.log("localities JSON", jsonData);
        console.log(response);
        return response;
    }

    async getLocalitiesByCountryName(
        countryName: string
    ): Promise<Locality[]> {
        //const response = await fetch(this.baseUrl + this.midUrl + this.getUrl + `localitiesByCountryName/country_name=${countryName}`);
        const response = await this.call(this.midUrl + this.getUrl + `localitiesByCountryName/country_name=${countryName}`);
        //const jsonData = await response.json()
        //console.log("localities JSON", jsonData);
        console.log(response);
        return response;

    }

    async getLocalitiesByRegionName(
        region_name: string
    ): Promise<Locality[]> {
        //const response = await fetch(this.baseUrl + this.midUrl + this.getUrl + `localitiesByRegionName/region_name=${region_name}`);
        const response = await this.call(this.midUrl + this.getUrl + `localitiesByRegionName/region_name=${region_name}`);
        //const jsonData = await response.json()
        //console.log("localities by region JSON", jsonData);
        console.log(response);
        return response;

    }

    async createLocality(
        ZipCode: string,
        Town:string,
        State: string,
        ID_Country: number
    ): Promise<Message> {

        console.log("Data received in the addLocality Service", ZipCode, Town, State, ID_Country);

        //const url = `${this.baseUrl}${this.midUrl}${this.addUrl}locality/`;
        const url = `${this.midUrl}${this.addUrl}locality/`;

        try {
            const response = await this.call(url,
                {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ZipCode: ZipCode,
                        Town: Town,
                        State: State,
                        ID_Country: ID_Country
                    }),
                }
            );
          //  const responseJson = await response.json();

            if (!response.ok) {
             //   console.error('Failed to add LOCALITY:', responseJson);
                throw new Error(`Add  LOCALITY failed: ${response}`);
            }

       //     console.log(" LOCALITY add response: ", responseJson);
         //   return responseJson;
            const message: Message = {
                header: 'Save Invoice method complete without errors',
                message: response,
                code: 200
            }
            return message;
        } catch (error) {
            console.error('Error in add LOCALITY:', error);
            throw error;
        }
    }

    async deleteLocality(id: number): Promise<Message> {

        console.log("Data received in the deleteLocality Service", id);
        //const url = `${this.baseUrl}${this.midUrl}${this.deleteUrl}locality/id=${id}`;
        const url = `${this.midUrl}${this.deleteUrl}locality/id=${id}`;

        console.log(url);
        try {

            const response = await this.call(url, {
                headers: { "Content-Type": "application/json" },
                method: 'DELETE'

            });

          //  const responseJson = await response.json();

            if (!response.ok) {
             //   console.error('Failed to delete LOCALITY:', responseJson);
                throw new Error(`Delete LOCALITY failed: ${response}`);
            }

           // console.log("LOCALITY delete response: ", responseJson);
          //  return responseJson;
            const message: Message = {
                header: 'Save Invoice method complete without errors',
                message: response,
                code: 200
            }
            return message;
        } catch (error) {
            console.error('Error in delete LOCALITY:', error);
            throw error;
        }
    }

    async updateLocality(
        ID: number,
        ZipCode: string,
        Town: string,
        State: string): Promise<Message> {

        console.log("Data received in the updateLOCALITY Service", ID, ZipCode, Town, State);

        //const url = `${this.baseUrl}${this.midUrl}${this.updateUrl}locality/`;
        const url = `${this.midUrl}${this.updateUrl}locality/`;
        try {
            const response = await this.call(url, {
                headers: { "Content-Type": "application/json" },
                method: 'PATCH',
                body: JSON.stringify({
                    ID: ID,
                    ZipCode: ZipCode,
                    Town: Town,
                    State: State
                }),
            });

         //   const responseJson = await response.json();

            if (!response.ok) {
            //    console.error('Failed to update LOCALITY:', responseJson);
                throw new Error(`Update LOCALITY failed: ${response}`);
            }

           // console.log("LOCALITY update response: ", responseJson);
           // return responseJson;
            const message: Message = {
                header: 'Save Invoice method complete without errors',
                message: response,
                code: 200
            }
            return message;
        } catch (error) {
            console.error('Error in update LOCALITY:', error);
            throw error;
        }
    }

   //=====================================================================================================//
   //Telephone CRUD functions
   //=====================================================================================================//

    async getTelephonesByEntityId(entity_id: number): Promise<Telephone[]> {
        //const response = await fetch(this.baseUrl + this.midUrl + this.getUrl + `telephonesByEntityID/entity_id=${entity_id}`);
        const response = await this.call(this.midUrl + this.getUrl + `telephonesByEntityID/entity_id=${entity_id}`);
    //const jsonData = await response.json()
        //console.log("telephones JSON", jsonData);
        console.log(response);
        return response;

}

    async getTelephonesByAddressId(address_id: number): Promise < Telephone[] > {
        //const response = await fetch(this.baseUrl + this.midUrl + this.getUrl + `telephonesByAddressID/address_id=${address_id}`);
        const response = await this.call(this.midUrl + this.getUrl + `telephonesByAddressID/address_id=${address_id}`);
    //const jsonData = await response.json()
      //  console.log("telephones JSON", jsonData);
        console.log(response);
        return response;

    }

    async createTelephone(
        PhoneNumber: string,
        ID_TelephoneType: number,
        ID_IntTelDialCode: number,
        Notes:string,
        ID_AT_EntityAddress: number
    ): Promise<Message> {

        console.log("Data received in the addTelephoneService", PhoneNumber, ID_TelephoneType, ID_IntTelDialCode, Notes, ID_AT_EntityAddress);

        //const url = `${this.baseUrl}${this.midUrl}${this.addUrl}telephone/`;
        const url = `${this.midUrl}${this.addUrl}telephone/`;

        try {
            const response = await this.call(url,
                {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        PhoneNumber: PhoneNumber,
                        ID_TelephoneType: ID_TelephoneType,
                        ID_IntTelDialCode: ID_IntTelDialCode,
                        Notes: Notes,
                        ID_AT_EntityAddress: ID_AT_EntityAddress
                    }),
                }
        );
          //  const responseJson = await response.json();

            if (!response.ok) {
           //     console.error('Failed to add telephone:', responseJson);
                throw new Error(`Add failed: ${response}`);
            }

           // console.log("Telephone add response: ", responseJson);
          //  return responseJson;
            const message: Message = {
                header: 'Save Invoice method complete without errors',
                message: response,
                code: 200
            }
            return message;
        } catch (error) {
            console.error('Error in addTelephone:', error);
            throw error;
        }
    }

    async deleteTelephone(id: number): Promise<Message> {
       
        console.log("Data received in the deleteTelephoneService", id);
       // const url = `${this.baseUrl}${this.midUrl}${this.deleteUrl}telephone/id=${id}`;
        const url = `${this.midUrl}${this.deleteUrl}telephone/id=${id}`;
        console.log(url);
        try {

            const response = await this.call(url, {
                headers: { "Content-Type": "application/json" },
                method: 'DELETE'

            });

            //const responseJson = await response.json();

            if (!response.ok) {
              //  console.error('Failed to delete Telephone:', responseJson);
                throw new Error(`Delete failed: ${response}`);
            }

           // console.log("Telephone delete response: ", responseJson);
           // return responseJson;
            const message: Message = {
                header: 'Save Invoice method complete without errors',
                message: response,
                code: 200
            }
            return message;
        } catch (error) {
            console.error('Error in deleteTelephone:', error);
            throw error;
        }
    }

    async updateTelephone(
        ID: number,
        PhoneNumber: string,
        ID_TelephoneType: number,
        ID_IntTelDialCode: number,
        Notes: string,
        ID_AT_EntityAddress: number): Promise<Message> {

        console.log("Data received in the updateTelephoneService", ID, PhoneNumber,ID_TelephoneType,ID_IntTelDialCode,Notes,ID_AT_EntityAddress);
      //  const url = `${this.baseUrl}${this.midUrl}${this.updateUrl}telephone/`;
        const url = `${this.midUrl}${this.updateUrl}telephone/`;
        try {
            const response = await this.call(url, {
                headers: { "Content-Type": "application/json" },
                method: 'PATCH',
                body: JSON.stringify({
                    ID:ID,
                    PhoneNumber: PhoneNumber,
                    ID_TelephoneType: ID_TelephoneType,
                    ID_IntTelDialCode: ID_IntTelDialCode,
                    Notes: Notes,
                    ID_AT_EntityAddress: ID_AT_EntityAddress
                }),
            });

           // const responseJson = await response.json();

            if (!response.ok) {
             //   console.error('Failed to update telephone:', responseJson);
                throw new Error(`Update failed: ${response}`);
            }

           // console.log("Telephone update response: ", responseJson);
           // return responseJson;
            const message: Message = {
                header: 'Save Invoice method complete without errors',
                message: response,
                code: 200
            }
            return message;
        } catch (error) {
            console.error('Error in updateTelephone:', error);
            throw error;
        }
    }

    //=====================================================================================================//
    //Email CRUD functions
    //=====================================================================================================//

    async getEmailsByEntityId(entity_id: number): Promise<Email[]> {
      //  const response = await fetch(this.baseUrl + this.midUrl + this.getUrl + `emailsByEntityID/entity_id=${entity_id}`);
        const response = await this.call(this.midUrl + this.getUrl + `emailsByEntityID/entity_id=${entity_id}`);
  //      const jsonData = await response.json()
    //    console.log("emails JSON", jsonData);
        console.log(response);
        return response;

    }

    async getEmailsByAddressId(address_id: number): Promise<Email[]> {
       // const response = await fetch(this.baseUrl + this.midUrl + this.getUrl + `emailsByAddressID/address_id=${address_id}`);
        const response = await this.call(this.midUrl + this.getUrl + `emailsByAddressID/address_id=${address_id}`);
        //const jsonData = await response.json()
        //console.log("emails JSON", jsonData);
        console.log(response);
        return response;

    }

    async createEmail(
        Name: string,
        ID_AT_EntityAddress: number
    ): Promise<Message> {
        //var response = await fetch(this.baseUrl + this.midUrl + this.addUrl + 'email/',
        var response = await this.call(this.midUrl + this.addUrl + 'email/',
            {
               method: 'POST',
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({
                   Name: Name,
                   ID_AT_EntityAddress: ID_AT_EntityAddress
                    }),
            }
        );
        console.log("Email create response: ", response);
       // console.log(response);
     //   return response;
        const message: Message = {
            header: 'Save Invoice method complete without errors',
            message: response,
            code: 200
        }
        return message;
    }


    async deleteEmail(id: number): Promise<Message> {

        console.log("Data received in the deleteEmailService", id);
        //const url = `${this.baseUrl}${this.midUrl}${this.deleteUrl}email/id=${id}`;
        const url = `${this.midUrl}${this.deleteUrl}email/id=${id}`;
        console.log(url);
        try {

            const response = await this.call(url, {
                headers: { "Content-Type": "application/json" },
                method: 'DELETE'

            });

         //   const responseJson = await response.json();

            if (!response.ok) {
           //     console.error('Failed to delete email:', responseJson);
                throw new Error(`Delete failed: ${response}`);
            }

           // console.log("Email delete response: ", responseJson);
           // return responseJson;
            const message: Message = {
                header: 'Save Invoice method complete without errors',
                message: response,
                code: 200
            }
            return message;
        } catch (error) {
            console.error('Error in deleteEmail:', error);
            throw error;
        }
    }

    async updateEmail(
        ID: number,
        Name: string,
        ID_AT_EntityAddress: number): Promise<Message> {

        console.log("Data received in the updateEmailService", ID, Name, ID_AT_EntityAddress);
        //const url = `${this.baseUrl}${this.midUrl}${this.updateUrl}email/`;
        const url = `${this.midUrl}${this.updateUrl}email/`;
        try {
            const response = await this.call(url, {
                headers: { "Content-Type": "application/json" },
                method: 'PATCH',
                body: JSON.stringify({
                    ID,
                    Name,
                    ID_AT_EntityAddress,
                }),
            });

           // const responseJson = await response.json();

            if (!response.ok) {
               // console.error('Failed to update email:', responseJson);
                throw new Error(`Update failed: ${response}`);
            }

           // console.log("Email update response: ", responseJson);
          //  return responseJson;
            const message: Message = {
                header: 'Save Invoice method complete without errors',
                message: response,
                code: 200
            }
            return message;
        } catch (error) {
            console.error('Error in updateEmail:', error);
            throw error;
        }
    }


    

    async getIdAtEntityAddress(ID_Entity: number, ID_Address: number) {
        //const response = await fetch(this.baseUrl + this.midUrl + this.getUrl + `IdAtEntityAddress/entity_id=${ID_Entity}/address_id=${ID_Address}`);
        const response = await this.call(this.midUrl + this.getUrl + `IdAtEntityAddress/entity_id=${ID_Entity}/address_id=${ID_Address}`);
        //const jsonData = await response.json()
        //console.log("IdAtEntityAddress JSON", jsonData);
        //return jsonData;
        console.log(response);
        return response;
    }


    //=====================================================================================================//
    //IntTelDialCode CRUD functions
    //=====================================================================================================//

    async getIntTelDialCode(): Promise<IntTelDialCode[]> {
    //    const response = await fetch(this.baseUrl + this.midUrl + this.getUrl + `intTelDialCodes`);
        const response = await this.call(this.midUrl + this.getUrl + `intTelDialCodes`);
      //      const jsonData = await response.json()
     //   console.log("intTelDialCodes JSON", jsonData);
        console.log(response);
        return response;

    }

    async createIntTelDialCode(
        Code: number,
        ID_Country: number,
        Regex:string
    ): Promise<Message> {

        //const url = `${this.baseUrl}${this.midUrl}${this.addUrl}intTelDialCode/`;
        const url = `${this.midUrl}${this.addUrl}intTelDialCode/`;

        try {
            const response = await this.call(url,
                {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        Code: Code,
                        ID_Country: ID_Country,
                        Regex: Regex
                    }),
                }
            );
          //  const responseJson = await response.json();

            if (!response.ok) {
               // console.error('Failed to add IntTelDialCode:', responseJson);
                throw new Error(`Add IntTelDialCode failed: ${response}`);
            }

          //  console.log("IntTelDialCode add response: ", responseJson);
           // return responseJson;
            const message: Message = {
                header: 'Save Invoice method complete without errors',
                message: response,
                code: 200
            }
            return message;

        } catch (error) {
            console.error('Error in add IntTelDialCode:', error);
            throw error;
        }
    }
       
    async deleteIntTelDialCode(id: number): Promise<Message> {

        console.log("Data received in the deleteIntTelDialCodeService", id);
        const url = `${this.midUrl}${this.deleteUrl}intTelDialCode/id=${id}`;
        console.log(url);
        try {

            const response = await this.call(url, {
                headers: { "Content-Type": "application/json" },
                method: 'DELETE'

            });

          //  const responseJson = await response.json();

            if (!response.ok) {
               // console.error('Failed to delete IntTelDialCode:', responseJson);
                throw new Error(`Delete failed: ${response}`);
            }

           // console.log("IntTelDialCode delete response: ", responseJson);
           // return responseJson;
            const message: Message = {
                header: 'Save Invoice method complete without errors',
                message: response,
                code: 200
            }
            return message;
        } catch (error) {
            console.error('Error in delete IntTelDialCode:', error);
            throw error;
        }
    }

    async updateIntTelDialCode(
        ID: number,
        Code: number,
        ID_Country: number,
        Regex:string
    ): Promise<Message> {

        console.log("Data received in the updateIntTelDialCodeService", ID, Code, ID_Country, Regex);
       // const url = `${this.baseUrl}${this.midUrl}${this.updateUrl}intteldialcode/`;
        const url = `${this.midUrl}${this.updateUrl}intteldialcode/`;
        try {
            const response = await this.call(url, {
                headers: { "Content-Type": "application/json" },
                method: 'PATCH',
                body: JSON.stringify({
                    ID,
                    Code,
                    ID_Country,
                    Regex,
                }),
            });

           // const responseJson = await response.json();

            if (!response.ok) {
             //   console.error('Failed to update IntTelDialCode:', responseJson);
                throw new Error(`Update failed: ${response}`);
            }

          //  console.log("IntTelDialCode update response: ", responseJson);
          //  return responseJson;
            const message: Message = {
                header: 'Save Invoice method complete without errors',
                message: response,
                code: 200
            }
            return message;
        } catch (error) {
            console.error('Error in update IntTelDialCode:', error);
            throw error;
        }
    }

    //=====================================================================================================//
    //Functions for getting various collections
    //=====================================================================================================//

    async getEntityTypes(): Promise<EntityType[]> {
       // const response = await fetch(this.baseUrl + this.midUrl + this.getUrl + `entityTypes`);
        const response = await this.call(this.midUrl + this.getUrl + `entityTypes`);
      //  const jsonData = await response.json()
      //  console.log("entity types JSON", jsonData);
        console.log(response);
        return response;

    }
   

    async getIndividualTitles(): Promise<IndividualTitle[]> {
       // const response = await fetch(this.baseUrl + this.midUrl + this.getUrl + `individualTitles`);
        const response = await this.call(this.midUrl + this.getUrl + `individualTitles`);
      //  const jsonData = await response.json()
      //  console.log("individual titles JSON", jsonData);
        console.log(response);
        return response;

    }

    async getTelephoneTypes(): Promise<TelephoneType[]> {
        //const response = await fetch(this.baseUrl + this.midUrl + this.getUrl + `telephoneTypes`);
        const response = await this.call(this.midUrl + this.getUrl + `telephoneTypes`);
       // const jsonData = await response.json()
       // console.log("telephone types JSON", jsonData);
        console.log(response);
        return response;

    }

    async getAddressTypes(): Promise<AddressType[]> {
      //  const response = await fetch(this.baseUrl + this.midUrl + this.getUrl + `addressTypes`);
        const response = await this.call(this.midUrl + this.getUrl + `addressTypes`);
            const jsonData = await response.json()
       // console.log("addressTypes JSON", jsonData);
      //  console.log(response);
        return response;

    }

    async getCountries(): Promise<Country[]> {
       // const response = await fetch(this.baseUrl + this.midUrl + this.getUrl + `countries`);
        const response = await this.call(this.midUrl + this.getUrl + `countries`);
     //   const jsonData = await response.json()
      //  console.log("countries JSON", jsonData);
        console.log(response);
        return response;

    }

    async getRegionsByCountryId(country_id: number): Promise<Region[]> {
       // const response = await fetch(this.baseUrl + this.midUrl + this.getUrl + `regionsByCountryId/country_id=${country_id}`);
        const response = await this.call(this.midUrl + this.getUrl + `regionsByCountryId/country_id=${country_id}`);
       // const jsonData = await response.json()
      //  console.log("states by country JSON", jsonData);
        console.log(response);
        return response;

    } 

}
