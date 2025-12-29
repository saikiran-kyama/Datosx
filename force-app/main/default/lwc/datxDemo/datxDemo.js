import { LightningElement } from 'lwc';
import getCurrentUserProfileName from '@salesforce/apex/DatxDemoController.getCurrentUserProfileName';

export default class DatxDemo extends LightningElement {
	greeting = '';

	connectedCallback() {
		this.loadGreeting();
	}

	loadGreeting() {
		getCurrentUserProfileName()
			.then((profileName) => {
				// Map specific profiles to greetings
				switch (profileName) {
					case 'System Administrator':
						this.greeting = 'Hi System';
						break;
					case 'CEO':
						this.greeting = 'Hi CEO';
						break;
					case 'Standard Platform User':
						this.greeting = 'Hi User';
						break;
					default:
						this.greeting = 'Hi ' + (profileName || 'User');
				}
			})
			.catch((error) => {
				// Fall back to a generic greeting on error
				this.greeting = 'Hi User';
				// eslint-disable-next-line no-console
				console.error('Error loading profile name', error);
			});
	}
}