import { LightningElement } from 'lwc';
import { loadStyle } from 'lightning/platformResourceLoader';
import HIDE_LAYOUT from '@salesforce/resourceUrl/HideLayout';

export default class LayoutOverride extends LightningElement {
    connectedCallback() {
        loadStyle(this, HIDE_LAYOUT);
    }
}
