// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',

    runtimeConfig: {
        public: {           
            baseUrl: 'https://ossole.gatex.ch/',
            homeUrl: '/',
            loginUrl: '/login',
            passwordForgottenUrl: '/password-forgotten',
            passwordResetUrl: '/password-reset',
            verificationUrl: '/verify-email',
            api: {              
                baseUrl: "https://api.ossole.gatex.ch",
                cookieRequestUrl: "/sanctum/csrf-cookie",
                userUrl: "/api/user",
                userKey: "user",
                csrfCookieName: "XSRF-TOKEN",
                csrfHeaderName: "X-XSRF-TOKEN",
                serverCookieName: "set-cookie",
                redirectUnauthenticated: true,
                redirectUniverified: true,
                timeout: 120_000 // 120 seconds
            },
            apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'https://api.ossole.gatex.ch',
        },
    },

    server: {
        port: 3031, // Port you want Nuxt to listen on
        host: '0.0.0.0', // Allows connections from outside the container (important for Docker)
    },

    devtools: { enabled: true },

    css: [
        '~/assets/css/global.css',
        '~/assets/css/tailwind.css',
    ],

    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },

    ssr: false,

    typescript: {
        tsConfigPath: './tsconfig.json',
        strict: true
    }

})
