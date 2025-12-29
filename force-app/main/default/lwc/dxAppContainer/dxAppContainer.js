import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import dxAppResource from '@salesforce/resourceUrl/dxApp';

export default class DxAppContainer extends NavigationMixin(LightningElement) {
    @api recordId;
    
    isLoaded = false;
    hasError = false;
    errorMessage = '';
    
    get iframeSrc() {
        // Add cache buster and ensure proper path
        const timestamp = new Date().getTime();
        return `${dxAppResource}/index.html?t=${timestamp}`;
    }

    get showIframe() {
        return !this.hasError;
    }

    connectedCallback() {
        // Listen for messages from iframe
        window.addEventListener('message', this.handleMessage.bind(this));
        
        // Log the resource URL for debugging
        console.log('DX App Resource URL:', dxAppResource);
        console.log('Full iframe src:', this.iframeSrc);
    }

    disconnectedCallback() {
        window.removeEventListener('message', this.handleMessage.bind(this));
    }

    handleMessage(event) {
        // Security: Validate origin if needed
        // if (event.origin !== window.location.origin) return;

        const { action, data } = event.data;

        switch (action) {
            case 'login':
                console.log('User logged in:', data);
                this.handleLogin(data);
                break;
            case 'logout':
                console.log('User logged out');
                this.handleLogout();
                break;
            case 'navigate':
                console.log('Navigation requested:', data);
                this.handleNavigation(data);
                break;
            case 'goToRecord':
                this.navigateToRecord(data.recordId);
                break;
            default:
                console.log('Unknown action:', action);
        }
    }

    handleLogin(data) {
        // Fire event for parent component if needed
        this.dispatchEvent(new CustomEvent('userlogin', {
            detail: data,
            bubbles: true,
            composed: true
        }));
    }

    handleLogout() {
        // Fire event for parent component if needed
        this.dispatchEvent(new CustomEvent('userlogout', {
            bubbles: true,
            composed: true
        }));
    }

    handleNavigation(data) {
        // Fire event for parent component if needed
        this.dispatchEvent(new CustomEvent('appnavigate', {
            detail: data,
            bubbles: true,
            composed: true
        }));
    }

    handleIframeLoad() {
        console.log('DX App iframe loaded successfully');
        this.isLoaded = true;
        this.hasError = false;
    }

    handleIframeError() {
        console.error('DX App iframe failed to load');
        this.hasError = true;
        this.isLoaded = true;
        this.errorMessage = 'The application failed to load. Please check that the static resource is deployed correctly.';
    }

    handleRetry() {
        this.isLoaded = false;
        this.hasError = false;
        this.errorMessage = '';
        // Force re-render by updating the iframe src
        const iframe = this.template.querySelector('iframe');
        if (iframe) {
            iframe.src = this.iframeSrc;
        }
    }

    // Navigate to a Salesforce record from iframe
    navigateToRecord(recordId) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: recordId,
                actionName: 'view'
            }
        });
    }

    // Method to communicate with iframe
    @api
    sendMessageToApp(action, data) {
        const iframe = this.template.querySelector('iframe');
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage({ action, data }, '*');
        }
    }
}
