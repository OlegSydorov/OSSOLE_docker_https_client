import { type FetchOptions, FetchError } from 'ofetch';
import { appendHeader } from 'h3';
import { splitCookiesString } from 'set-cookie-parser';

import type { ApiServiceContainer } from '~/api/services/ApiServiceContainer';
import type AuthUser from '~/api/models/AuthUser';
import ApiError from '~/api/models/ApiError';

import { useUser } from '~/api/composables/useUser';

import ApplicationService from '~/api/services/ApplicationService';
import AuthenticationService from '~/api/services/AuthenticationService';
import InventoryService from '~/api/services/InventoryService';
import NinjaOneBillingService from '~/api/services/NinjaOneBillingService';
import TaskService from '~/api/services/TaskService';
import EntityService from '~/api/services/EntityService';
import UserService from '~/api/services/UserService';


const SECURE_METHODS = new Set(['get','post', 'delete', 'put', 'patch']);

const UNAUTHENTICATED_STATUSES = new Set([401, 419]);
const UNVERIFIED_USER_STATUS = 409;
const VALIDATION_ERRROR_STATUS = 422;

//export default defineNuxtPlugin(async () => {
export default defineNuxtPlugin(async (nuxtApp) => {
    const event = useRequestEvent();
    const config = useRuntimeConfig();
    const { user } = useUser();
    const apiConfig = config.public.api;

    console.log("client plugin executing ...");

    const httpOptions: FetchOptions = {
        baseURL: apiConfig.baseUrl,
        credentials: 'include',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        retry: false,

        async onRequest({ options, request }) {
       //     console.log('Resolved URL:', request || options.url);
       //     console.log('Base URL:', options.baseURL);

        //    console.log('Intercepting request OPTIONS:', options);
        //    console.log('Intercepting request to:', options.baseURL);
        //    console.log('Method:', options.method);
         //   console.log('Initial headers:', options.headers);


            if (process.server) {
                options.headers = buildServerHeaders(options.headers)
           //     console.log("client.ts executing onRequest method: SERVER options.headers: ", options.headers);
            }

            if (process.client) {
                const method = options.method?.toLocaleLowerCase() ?? ''

                if (!SECURE_METHODS.has(method)) {
                    return
                }

                options.headers = await buildClientHeaders(options.headers);
           //     console.log("client.ts executing onRequest method: CLIENT options.headers: ", options.headers);
            }
        },

        onResponse({ response }) {
            if (process.server) {
                const rawCookieHeader = response.headers.get(apiConfig.serverCookieName)
            //    console.log("onResponse method: rawCookieHeader: ", rawCookieHeader);

                if (rawCookieHeader === null) {
                    return
                }

                const cookies = splitCookiesString(rawCookieHeader)

                for (const cookie of cookies) {
              //      console.log("onResponse method looping through cookies: ", event, apiConfig.serverCookieName, cookie);
                    appendHeader(event, apiConfig.serverCookieName, cookie)
                }
            }
        },

        async onResponseError({ response }) {
            if (
                apiConfig.redirectUnauthenticated &&
                UNAUTHENTICATED_STATUSES.has(response.status)
            ) {
                await navigateTo(config.public.loginUrl)

                return
            }

            if (
                apiConfig.redirectUniverified &&
                response.status === UNVERIFIED_USER_STATUS
            ) {
                await navigateTo(config.public.verificationUrl)

                return
            }

            if (response.status === VALIDATION_ERRROR_STATUS) {
                throw new ApiError(response._data)
            }
        },
    };

    const client: any = $fetch.create(httpOptions);

    function buildServerHeaders(headers: HeadersInit | undefined): HeadersInit {
        const csrfToken = useCookie(apiConfig.csrfCookieName).value;
       // console.log(csrfToken);
        const clientCookies = useRequestHeaders(['cookie'])
      //  console.log(clientCookies);

        return {
            ...headers,
            ...(clientCookies.cookie && clientCookies),
            ...(csrfToken && { [apiConfig.csrfHeaderName]: csrfToken }),
            Referer: config.public.baseUrl,
        };
    }

    async function buildClientHeaders(
        headers: HeadersInit | undefined,
    ): Promise<HeadersInit> {
        await $fetch(apiConfig.cookieRequestUrl, {
            baseURL: apiConfig.baseUrl,
            credentials: 'include',
        })

        const csrfToken = useCookie(apiConfig.csrfCookieName).value
     //   console.log("client.ts executing: buildClientHeaders method: csrf token: ",csrfToken);

        return {
            ...headers,
            ...(csrfToken && { [apiConfig.csrfHeaderName]: csrfToken }),
        };
    }

    async function initUser(getter: () => Promise<AuthUser | null>) {
        try {
            user.value = await getter()

     //       console.log(user.value);
        } catch (err) {
            if (
                err instanceof FetchError &&
                err.response &&
                UNAUTHENTICATED_STATUSES
            ) {
      //          console.warn('[API initUser] User is not authenticated');
            }
        }
    }

    const api: ApiServiceContainer = {
        application: new ApplicationService(client),
        authentication: new AuthenticationService(client),
        inventory: new InventoryService(client),
        invoice: new NinjaOneBillingService(client),
        task: new TaskService(client),
        entity: new EntityService(client),
        userservice: new UserService(client)
    };

    if (process.server && user.value === null) {
        await initUser(() => api.authentication.user());
    }
    nuxtApp.provide('api', api);
   // return { provide: { api } };
})
