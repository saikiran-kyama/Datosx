import { LightningElement, track } from 'lwc';

export default class Preferences extends LightningElement {
    @track preferences = [
        {
            intSettingsId: 1,
            name: "Grid Length",
            description: "Default Grid Length",
            old_value: "10",
        }
    ];

    @track sortBy = '';
    @track sortDirection = 'asc';

    get sortIcon() {
        return this.sortDirection === 'asc' ? 'utility:arrowup' : 'utility:arrowdown';
    }

    get isSortedBy() {
        return {
            name: this.sortBy === 'name',
            description: this.sortBy === 'description',
            old_value: this.sortBy === 'old_value',
            new_value: this.sortBy === 'new_value'
        };
    }

    handleSort(event) {
        const field = event.currentTarget.dataset.field;
        if (this.sortBy === field) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortBy = field;
            this.sortDirection = 'asc';
        }
        this.sortData();
    }

    sortData() {
        const dataToSort = [...this.preferences];
        dataToSort.sort((a, b) => {
            let aVal = a[this.sortBy] || '';
            let bVal = b[this.sortBy] || '';
            
            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }

            if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
        this.preferences = dataToSort;
    }

    handleInputChange(event) {
        const id = parseInt(event.currentTarget.dataset.id);
        const newValue = event.target.value;
        this.preferences = this.preferences.map(item => {
            if (item.intSettingsId === id) {
                return { ...item, new_value: newValue };
            }
            return item;
        });
    }

    handleSave(event) {
        const id = parseInt(event.currentTarget.dataset.id);
        const item = this.preferences.find(pref => pref.intSettingsId === id);
        console.log('Saving preference:', item);
        // Add your save logic here
        // You can call an Apex method to save the data
    }
}