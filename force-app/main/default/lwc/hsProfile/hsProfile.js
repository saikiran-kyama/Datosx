import { LightningElement } from 'lwc';

export default class HsProfile extends LightningElement {
    // Health System data
    healthSystem = {
        hsId: 'HS-001',
        hsName: 'Lakeside Health',
        status: 'Active',
        annualPatientVolume: '120,000',
        state: 'Texas',
        city: 'Houston',
        contact: 'Dr. Michael Stone',
        email: 'michael.stone@lakesidehealth.com',
        phone: '+1 713-555-0101'
    };

    // CVP Team data
    cvpTeam = {
        name: 'James Mitchell',
        email: 'jmitchell@dxhealth.com',
        phone: '+1 415-555-0208',
        avatarUrl: 'https://orgfarm-4f811fcf7a-dev-ed.develop.lightning.force.com/resource/1766053176000/avatars/2.svg.jpg'
    };

    // Handle add contact
    handleAddContact() {
        console.log('Add Contact clicked');
        // TODO: Open Add Contact Modal
    }

    // Handle inline edit
    handleInlineEdit(event) {
        const field = event.currentTarget.dataset.field;
        const section = event.currentTarget.dataset.section;
        console.log('Edit clicked for field:', field, 'section:', section);
        // TODO: Open Edit Modal
    }

    // Handle edit DX team
    handleEditDxTeam() {
        console.log('Edit DX Team clicked');
        // TODO: Open Edit DX Team Modal
    }
}