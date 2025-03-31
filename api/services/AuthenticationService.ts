import type AuthUser from "../models/AuthUser";
import { ApiServiceBase } from "./ApiServiceBase";

export default class AuthenticationService extends ApiServiceBase
{
       

    async login(email:string,password:string,remember = true): Promise<any> {
        try {
            console.log("AuthenticationService method: LOGIN Email: ", email, " Password: ", password);
            const loginResponse = await this.call("/login", {
                method: "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-API-Request': 'true'
                },
                body: { email, password, remember },
            });
            //const loginResponseJson = await loginResponse.json();
            console.log("Login Response", loginResponse);
           
            return loginResponse;
        } catch (error) {
            console.error('Error during Login', error);
            throw new Error(error.toString());
        }
    }

    async logout(): Promise<any> {
        console.log("AthenticationService executing method logout:");
        return await this.call(
            "/logout",
            {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
            });
    }

    async register(
        name: string,
        email: string,
        password: string,
        password_confirmation: string
    ): Promise<any> {
        return await this.call("/register", {
            method: "post",
            body: { name, email, password, password_confirmation },
        });
    }

    async passwordForgotten(email: string): Promise<any> {
        console.log("AuthenticationService executing method passwordForgot");
        const passwordForgottenResponse = await this.call(
            "/forgot-password", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: { email },
        });
        console.log(passwordForgottenResponse);
        return passwordForgottenResponse;
    }

    async passwordReset(
        token: string,
        email: string,
        password: string,
        password_confirmation: string
    ): Promise<{ status: string }> {
        console.log('AthenticationService executing passwordRest method: data: ', token, email, password, password_confirmation);
        const passwordResetResponse = await this.call(
            "/reset-password", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: { email, token, password, password_confirmation },
            }
        );
        console.log(passwordResetResponse);
        return passwordResetResponse;
    }

    async user(): Promise<AuthUser> {
        console.log("AuthenticationService method: USER");
        const userResponse = await this.call("/user/get/user", {
            method:'get'
        });
        //const userResponseJson = await userResponse.json();
        console.log("user Response", userResponse);
        return userResponse;
    }
}