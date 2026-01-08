import { LightningElement } from 'lwc';

export default class SponsorProfile extends LightningElement {
    // Sponsor data
    sponsor = {
        sponsorId: 'SP-001',
        sponsorName: 'Pharma Inc',
        status: 'Active',
        state: 'California',
        city: 'San Francisco',
        contact: 'Dr. Sarah Chen',
        email: 'sarah.chen@pharmainc.com',
        phone: '+1 415-555-0101'
    };

    // CVP Team data
    cvpTeam = {
        name: 'James Mitchell',
        email: 'jmitchell@dxhealth.com',
        phone: '+1 415-555-0208',
        avatarUrl: 'https://orgfarm-4f811fcf7a-dev-ed.develop.lightning.force.com/resource/1766053176000/avatars/2.svg.jpg'
    };

    handleAddContact() {
        console.log('Add Contact clicked');
    }

    handleInlineEdit(event) {
        const field = event.currentTarget.dataset.field;
        console.log('Edit clicked for field:', field);
    }

    handleEditDxTeam() {
        console.log('Edit DX Team clicked');
    }
}