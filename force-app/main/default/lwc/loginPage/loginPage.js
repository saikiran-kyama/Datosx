import { LightningElement, track } from "lwc";

export default class LoginPage extends LightningElement {
    @track username = "";
    @track password = "";
    @track errorMsg = "";

    login() {
        // Hardcoded login check
        if(this.username === "admin" && this.password === "admin123") {
            sessionStorage.setItem("role", "admin");
            window.location.href = "/app";
        } else if(this.username === "user" && this.password === "user123") {
            sessionStorage.setItem("role", "user");
            window.location.href = "/app";
        } else {
            this.errorMsg = "Invalid username or password";
        }
    }

    handleInput(e) {
        const field = e.target.label.toLowerCase();
        this[field] = e.target.value;
    }
}
