import { LightningElement } from 'lwc';

export default class DxMatches extends LightningElement {
    selectedHSId = 'hs1';
    selectedHSName = 'Acme Pharma';
    messagingTab = 'HS';
    messageInput = '';

    hsMatches = [
        { id: 'hs1', name: 'Acme Pharma', matchPercentage: 95, avatar: '/resource/avatars/HS1.png', itemClass: 'd-flex justify-content-between align-items-center mb-3 hs-match-item active' },
        { id: 'hs2', name: 'BioHealth Ltd', matchPercentage: 92, avatar: '/resource/avatars/HS2.png', itemClass: 'd-flex justify-content-between align-items-center mb-3 hs-match-item' },
        { id: 'hs3', name: 'MedSolutions', matchPercentage: 90, avatar: '/resource/avatars/HS3.png', itemClass: 'd-flex justify-content-between align-items-center mb-3 hs-match-item' },
        { id: 'hs4', name: 'Mass General', matchPercentage: 88, avatar: '/resource/avatars/HS4.png', itemClass: 'd-flex justify-content-between align-items-center mb-3 hs-match-item' },
        { id: 'hs5', name: 'UCLA Medical', matchPercentage: 85, avatar: '/resource/avatars/HS5.png', itemClass: 'd-flex justify-content-between align-items-center mb-3 hs-match-item' },
        { id: 'hs6', name: 'UCSF Health', matchPercentage: 83, avatar: '/resource/avatars/ODF.png', itemClass: 'd-flex justify-content-between align-items-center mb-3 hs-match-item' },
        { id: 'hs7', name: 'Stanford Health', matchPercentage: 80, avatar: '/resource/avatars/ODF1.png', itemClass: 'd-flex justify-content-between align-items-center mb-3 hs-match-item' },
        { id: 'hs8', name: 'Duke Health', matchPercentage: 78, avatar: '/resource/avatars/ODF2.png', itemClass: 'd-flex justify-content-between align-items-center mb-3 hs-match-item' },
        { id: 'hs9', name: 'Northwestern', matchPercentage: 76, avatar: '/resource/avatars/ODF3.png', itemClass: 'd-flex justify-content-between align-items-center mb-3 hs-match-item' },
        { id: 'hs10', name: 'Cedars-Sinai', matchPercentage: 75, avatar: '/resource/avatars/HS1.png', itemClass: 'd-flex justify-content-between align-items-center mb-3 hs-match-item' }
    ];

    staticCapabilityGroups = [
        {
            id: 'g_facilities',
            title: 'Facilities Available',
            isOpen: true,
            items: [
                { id: 'fa1', label: 'Academic Medical Center', hs: true, sponsor: false, weight: '1.15%', projectNeeds: true, score: '1.15%' },
                { id: 'fa2', label: 'Ambulatory Surgical Center', hs: true, sponsor: false, weight: '0.86%', projectNeeds: true, score: '0.86%' },
                { id: 'fa3', label: 'Center of Excellence', hs: false, sponsor: false, weight: '1%', projectNeeds: true, score: '0%' },
                { id: 'fa4', label: 'Community Health Clinic', hs: true, sponsor: false, weight: '0.71%', projectNeeds: true, score: '0.71%' },
                { id: 'fa5', label: 'Diagnostic Imaging Center', hs: true, sponsor: false, weight: '0.86%', projectNeeds: true, score: '0.86%' },
                { id: 'fa6', label: 'Emergency Room / Urgent Care', hs: true, sponsor: false, weight: '1%', projectNeeds: true, score: '1%' },
                { id: 'fa7', label: 'Hospice', hs: true, sponsor: false, weight: '0.57%', projectNeeds: true, score: '0.57%' },
                { id: 'fa8', label: 'Nursing Home', hs: true, sponsor: false, weight: '0.71%', projectNeeds: true, score: '0.71%' },
                { id: 'fa9', label: 'Outpatient Clinic', hs: true, sponsor: false, weight: '0.86%', projectNeeds: true, score: '0.86%' },
                { id: 'fa10', label: 'Rehab Center', hs: true, sponsor: false, weight: '0.71%', projectNeeds: true, score: '0.71%' },
                { id: 'fa11', label: 'Research Institution', hs: true, sponsor: false, weight: '1.14%', projectNeeds: true, score: '1.14%' },
                { id: 'fa12', label: 'Other', hs: true, sponsor: false, weight: '0.43%', projectNeeds: true, score: '0.43%' }
            ]
        },
        {
            id: 'g6',
            title: 'Therapeutic Area of Focus',
            isOpen: false,
            items: [
                { id: 'ta1', label: 'Allergy and Immunology', hs: true, sponsor: false, projectNeeds: true, weight: '3%', score: '3%' },
                { id: 'ta2', label: 'Cardiovascular', hs: true, sponsor: false, projectNeeds: true, weight: '1.78%', score: '1.78%' },
                { id: 'ta3', label: 'Chronic Diseases', hs: true, sponsor: false, projectNeeds: true, weight: '2.37%', score: '2.37%' },
                { id: 'ta4', label: 'Dental', hs: true, sponsor: false, projectNeeds: true, weight: '1.18%', score: '1.18%' },
                { id: 'ta5', label: 'Dermatology', hs: true, sponsor: false, projectNeeds: true, weight: '1.78%', score: '1.78%' },
                { id: 'ta6', label: 'Diagnostic Radiology', hs: true, sponsor: false, projectNeeds: true, weight: '1.18%', score: '1.18%' },
                { id: 'ta7', label: 'Emergency Department (ER / ED)', hs: true, sponsor: false, projectNeeds: true, weight: '1.78%', score: '1.78%' },
                { id: 'ta8', label: 'Endocrinology (Diabetes, Thyroid)', hs: true, sponsor: false, projectNeeds: true, weight: '2.37%', score: '2.37%' },
                { id: 'ta9', label: 'ENT / Otolaryngology (Ear, Nose, Throat)', hs: true, sponsor: false, projectNeeds: true, weight: '1.18%', score: '1.18%' },
                { id: 'ta10', label: 'Gastroenterology', hs: true, sponsor: false, projectNeeds: true, weight: '1.78%', score: '1.78%' },
                { id: 'ta11', label: 'Genetic Medicine', hs: true, sponsor: false, projectNeeds: true, weight: '2.37%', score: '2.37%' },
                { id: 'ta12', label: 'Hematology', hs: true, sponsor: false, projectNeeds: true, weight: '2.97%', score: '2.97%' },
                { id: 'ta13', label: 'Infectious Disease', hs: true, sponsor: false, projectNeeds: true, weight: '2.37%', score: '2.37%' },
                { id: 'ta14', label: "Men's Health", hs: true, sponsor: false, projectNeeds: true, weight: '1.18%', score: '1.18%' },
                { id: 'ta15', label: 'Musculoskeletal', hs: true, sponsor: false, projectNeeds: true, weight: '1.78%', score: '1.78%' },
                { id: 'ta16', label: 'Nephrology', hs: true, sponsor: false, projectNeeds: true, weight: '1.78%', score: '1.78%' },
                { id: 'ta17', label: 'Neuroscience', hs: true, sponsor: false, projectNeeds: true, weight: '2.97%', score: '2.97%' },
                { id: 'ta18', label: 'Oncology', hs: true, sponsor: false, projectNeeds: true, weight: '3.57%', score: '3.57%' },
                { id: 'ta19', label: 'Ophthalmology', hs: true, sponsor: false, projectNeeds: true, weight: '1.78%', score: '1.78%' },
                { id: 'ta20', label: 'Pathology', hs: true, sponsor: false, projectNeeds: true, weight: '2.37%', score: '2.37%' },
                { id: 'ta21', label: 'Pediatrics', hs: true, sponsor: false, projectNeeds: true, weight: '2.37%', score: '2.37%' },
                { id: 'ta22', label: 'Physical medicine and rehab', hs: true, sponsor: false, projectNeeds: true, weight: '1.78%', score: '1.78%' },
                { id: 'ta23', label: 'Population Health', hs: true, sponsor: false, projectNeeds: true, weight: '2.37%', score: '2.37%' },
                { id: 'ta24', label: 'Preventative', hs: true, sponsor: false, projectNeeds: true, weight: '1.78%', score: '1.78%' },
                { id: 'ta25', label: 'Primary Care', hs: true, sponsor: false, projectNeeds: true, weight: '2.97%', score: '2.97%' },
                { id: 'ta26', label: 'Psychiatry', hs: true, sponsor: false, projectNeeds: true, weight: '2.37%', score: '2.37%' },
                { id: 'ta27', label: 'Pulmonary', hs: true, sponsor: false, projectNeeds: true, weight: '2.37%', score: '2.37%' },
                { id: 'ta28', label: 'Respiratory', hs: true, sponsor: false, projectNeeds: true, weight: '1.78%', score: '1.78%' },
                { id: 'ta29', label: 'Rheumatology', hs: true, sponsor: false, projectNeeds: true, weight: '2.37%', score: '2.37%' },
                { id: 'ta30', label: 'Surgery', hs: true, sponsor: false, projectNeeds: true, weight: '2.97%', score: '2.97%' },
                { id: 'ta31', label: 'Urology', hs: true, sponsor: false, projectNeeds: true, weight: '1.78%', score: '1.78%' },
                { id: 'ta32', label: "Women's Health", hs: true, sponsor: false, projectNeeds: true, weight: '2.55%', score: '2.55%' },
                { id: 'ta33', label: 'Other', hs: false, sponsor: false, projectNeeds: true, weight: '1%', score: '0%' }
            ]
        },
        {
            id: 'g_format',
            title: 'Innovation format interest',
            isOpen: false,
            items: [
                { id: 'if1', label: 'HCP efficacy', hs: true, sponsor: false, weight: '1.17%', projectNeeds: true, score: '1.17%' },
                { id: 'if2', label: 'Mobile health app', hs: false, sponsor: false, weight: '2%', projectNeeds: true, score: '0%' },
                { id: 'if3', label: 'AI algorithm', hs: true, sponsor: false, weight: '1.71%', projectNeeds: true, score: '1.71%' },
                { id: 'if4', label: 'Wearable device', hs: true, sponsor: true, weight: '1.46%', projectNeeds: true, score: '1.46%' },
                { id: 'if5', label: 'Web application', hs: true, sponsor: false, weight: '1.22%', projectNeeds: true, score: '1.22%' },
                { id: 'if6', label: 'Digital diagnostics', hs: true, sponsor: false, weight: '1.71%', projectNeeds: true, score: '1.71%' },
                { id: 'if7', label: 'Other', hs: true, sponsor: false, weight: '0.73%', projectNeeds: true, score: '0.73%' }
            ]
        },
        {
            id: 'g_enduser',
            title: 'Innovation end user focus',
            isOpen: false,
            items: [
                { id: 'eu1', label: 'Providers', hs: true, sponsor: false, weight: '1.59%', projectNeeds: true, score: '1.59%' },
                { id: 'eu2', label: 'Patients/Consumers', hs: true, sponsor: false, weight: '1.82%', projectNeeds: true, score: '1.82%' },
                { id: 'eu3', label: 'Health Systems', hs: true, sponsor: false, weight: '1.36%', projectNeeds: true, score: '1.36%' },
                { id: 'eu4', label: 'Researchers', hs: true, sponsor: false, weight: '1.14%', projectNeeds: true, score: '1.14%' },
                { id: 'eu5', label: 'Administrators', hs: true, sponsor: false, weight: '0.91%', projectNeeds: true, score: '0.91%' },
                { id: 'eu6', label: 'Payers', hs: true, sponsor: false, weight: '1.14%', projectNeeds: true, score: '1.14%' },
                { id: 'eu7', label: 'Pharma', hs: false, sponsor: false, weight: '1%', projectNeeds: true, score: '0%' },
                { id: 'eu8', label: 'Other', hs: true, sponsor: false, weight: '1.04%', projectNeeds: true, score: '1.04%' }
            ]
        }
    ];

    messagesDataByHS = {
        hs1: {
            hs: [
                { id: 'm1', sender: 'Acme Pharma', text: 'Hello! We are interested in your clinical trial.', isReceived: true, isSent: false, chatClass: 'chat-list mb-3', avatar: '/resource/avatars/HS1.png' },
                { id: 'm2', sender: 'You', text: 'Great! Let us discuss the details.', isReceived: false, isSent: true, chatClass: 'chat-list ms-auto mb-3', avatar: '/resource/avatars/ODF2.png' },
                { id: 'm3', sender: 'Acme Pharma', text: 'We have strong capabilities in Cardiology.', isReceived: true, isSent: false, chatClass: 'chat-list mb-3', avatar: '/resource/avatars/HS1.png' },
                { id: 'm4', sender: 'You', text: 'Perfect! That aligns with our study requirements.', isReceived: false, isSent: true, chatClass: 'chat-list ms-auto mb-3', avatar: '/resource/avatars/ODF2.png' },
                { id: 'm5', sender: 'Acme Pharma', text: 'Let’s discuss this on Monday.', isReceived: true, isSent: false, chatClass: 'chat-list mb-3', avatar: '/resource/avatars/HS1.png' }
            ],
            sponsor: [
                { id: 'sm1', sender: 'Sponsor', text: 'Please review the protocol requirements.', isReceived: true, isSent: false, chatClass: 'chat-list mb-3', avatar: '/resource/avatars/ODF1.png' },
                { id: 'sm2', sender: 'You', text: 'Understood. Will review and get back.', isReceived: false, isSent: true, chatClass: 'chat-list ms-auto mb-3', avatar: '/resource/avatars/ODF.png' }
            ]
        },
        hs2: {
            hs: [
                { id: 'm1', sender: 'Cleveland Clinic', text: 'We would like to participate in this study.', isReceived: true, isSent: false, chatClass: 'chat-list mb-3', avatar: '/resource/avatars/HS2.png' },
                { id: 'm2', sender: 'You', text: 'Excellent! What are your key specialties?', isReceived: false, isSent: true, chatClass: 'chat-list ms-auto mb-3', avatar: '/resource/avatars/ODF2.png' }
            ],
            sponsor: [
                { id: 'sm1', sender: 'Sponsor', text: 'Please review the protocol requirements.', isReceived: true, isSent: false, chatClass: 'chat-list mb-3', avatar: '/resource/avatars/ODF1.png' },
                { id: 'sm2', sender: 'You', text: 'Understood. Will review and get back.', isReceived: false, isSent: true, chatClass: 'chat-list ms-auto mb-3', avatar: '/resource/avatars/ODF.png' }
            ]
        }
    };

    get capabilityGroups() {
        const numeric = (val) => parseFloat(String(val).replace('%', '')) || 0;
        return this.staticCapabilityGroups.map(group => {
            const projectNeedsCount = group.items.filter(item => item.projectNeeds).length;
            const hsCount = group.items.filter(item => item.hs).length;
            const totalWeight = group.items.reduce((sum, item) => sum + numeric(item.weight), 0);
            const totalScore = group.items.reduce((sum, item) => sum + numeric(item.score), 0);
            return {
                ...group,
                projectNeedsCount,
                hsCount,
                weight: totalWeight.toFixed(2) + '%',
                score: totalScore.toFixed(2) + '%'
            };
        });
    }

    get totalProjectNeeds() {
        return this.staticCapabilityGroups.reduce((sum, group) => sum + group.items.filter(item => item.projectNeeds).length, 0);
    }

    get totalHS() {
        return this.staticCapabilityGroups.reduce((sum, group) => sum + group.items.filter(item => item.hs).length, 0);
    }

    get totalWeightPercent() {
        const numeric = (val) => parseFloat(String(val).replace('%', '')) || 0;
        const total = this.staticCapabilityGroups.reduce((sum, group) => sum + group.items.reduce((inner, item) => inner + numeric(item.weight), 0), 0);
        return total.toFixed(2) + '%';
    }

    get totalScorePercent() {
        const numeric = (val) => parseFloat(String(val).replace('%', '')) || 0;
        const total = this.staticCapabilityGroups.reduce((sum, group) => sum + group.items.reduce((inner, item) => inner + numeric(item.score), 0), 0);
        return total.toFixed(2) + '%';
    }

    get currentMessages() {
        const hsId = this.selectedHSId;
        const tab = this.messagingTab === 'Sponsor' ? 'sponsor' : 'hs';
        const data = this.messagesDataByHS[hsId];
        return data ? data[tab] : [];
    }

    handleHSSelect(event) {
        const hsId = event.currentTarget?.dataset?.id;
        if (!hsId) {
            return;
        }
        this.selectedHSId = hsId;
        const selectedHS = this.hsMatches.find(hs => hs.id === hsId);
        if (selectedHS) {
            this.selectedHSName = selectedHS.name;
        }
        this.hsMatches = this.hsMatches.map(hs => ({
            ...hs,
            itemClass: hs.id === hsId
                ? 'd-flex justify-content-between align-items-center mb-3 hs-match-item active'
                : 'd-flex justify-content-between align-items-center mb-3 hs-match-item'
        }));
    }

    toggleDropdown(event) {
        const groupId = event.currentTarget?.dataset?.id;
        if (!groupId) {
            return;
        }
        this.staticCapabilityGroups = this.staticCapabilityGroups.map(group =>
            group.id === groupId ? { ...group, isOpen: !group.isOpen } : group
        );
    }

    handleMessageInput(event) {
        this.messageInput = event.target.value;
    }

    sendMessage() {
        if (!this.messageInput || !this.messageInput.trim()) {
            return;
        }
        const hsId = this.selectedHSId;
        const tab = this.messagingTab === 'Sponsor' ? 'sponsor' : 'hs';
        if (!this.messagesDataByHS[hsId]) {
            this.messagesDataByHS = {
                ...this.messagesDataByHS,
                [hsId]: { hs: [], sponsor: [] }
            };
        }
        const newMessage = {
            id: 'm' + Date.now(),
            sender: 'You',
            text: this.messageInput.trim(),
            isReceived: false,
            isSent: true,
            chatClass: 'chat-list ms-auto mb-3',
            avatar: '/resource/avatars/ODF2.png'
        };
        this.messagesDataByHS[hsId][tab].push(newMessage);
        this.messagesDataByHS = { ...this.messagesDataByHS };
        this.messageInput = '';
    }
}
