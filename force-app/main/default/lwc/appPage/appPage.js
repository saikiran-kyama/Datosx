import { LightningElement } from "lwc";

export default class AppPage extends LightningElement {
    hasRendered = false;

    get role() {
        return sessionStorage.getItem("role");
    }

    get isAdmin() {
        return this.role === "admin";
    }

    get isUser() {
        return this.role === "user";
    }

    get roleLabel() {
        return this.role === "admin" ? "Admin" : "User";
    }

    logout() {
        sessionStorage.clear();
        window.location.href = "/login";
    }

    renderedCallback() {
        if (this.hasRendered) return; // run only once
        this.hasRendered = true;

        if (!this.role) {
            window.location.href = "/login";
        }
    }
}
