import { Component } from '@angular/core';
import { AddReferralDocComponent } from '../refferral-dashboard/referral-documents/add-referral-doc/add-referral-doc.component';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PatientPopComponent } from '../patient-pop/patient-pop.component';
import { ReferralsfilterComponent } from '../referrals/referralsfilter/referralsfilter.component';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ConfirmDialogComponent } from '../refferral-dashboard/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-rcm-document',
  templateUrl: './rcm-document.component.html',
  styleUrl: './rcm-document.component.scss',
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('0.3s ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('0.3s ease-in-out', style({ transform: 'translateX(100%)' }))
      ])
    ])
  ]
})
export class RcmDocumentComponent {


  isRed: boolean = false;
  isMasked: boolean = false;

  openDialog(task: any) {
    const message = task.isMasked
      ? "Are you sure you want to unmask this document?"
      : "Are you sure you want to mask this document?";

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { message, title: "Confirmation" },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        task.isMasked = !task.isMasked;
        task.cardColor = task.isMasked ? 'lightgray' : 'white'; // Change card color after confirmation
      }
    });
  }

  
  showCard: boolean;

  toggleCard() {

    this.showCard = !this.showCard;

    if (!this.showCard) {
      this.showTable = false;
      this.showTable1 = false;
      this.showTable2 = false;
    }
  }


  saveFilters(){}
  dataSource = [
    { workList: 'Total Referrals', volume: 120201 },
    { workList: 'Pending Verification', volume: 1875 },
    { workList: 'Pending Authorization', volume: 3790 },
    { workList: 'Delayed', volume: 9078 },
    { workList: 'Denied', volume: 908 },
    { workList: 'Verified NOT AUTH', volume: 8900 },
    { workList: 'AUTH NOT SCH', volume: 890 },
    { workList: 'SCH NOT Verified', volume: 1987 },
    { workList: 'Total SCH Visits', volume: 190234 },

    { workList: 'Visits Per Referral', volume: 1.58 },
  ];


  dataSource1 = [
    { workList: 'Total SCH Visits', volume: 190234 },
    { workList: 'No Show', volume: 20200 },
    { workList: 'Cancelled', volume: 9201 },
    { workList: 'COM Insurance', volume: 12001 },
    { workList: 'Workers Comp', volume: 2908 },
    { workList: 'Self Pay', volume: 7780 },
    { workList: 'Total Claims', volume: 130001 },
    { workList: 'Claims Per SCH Visits', volume: 0.68 },
  ];

  dataSource2 = [
    { workList: 'Total Claims', volume: 130001 },
    { workList: 'Claims Closed', volume: 110000 },
    { workList: 'Claims Dropped', volume: 12800 },
    { workList: 'Deposit Received', volume: 23902 },
    { workList: 'Claims Settled', volume: 95001 },
    { workList: 'Claims Paid', volume: 80001 },
    { workList: 'Value of Claims', volume: 2902091 },
    { workList: 'Payment Received', volume: 1098121 },
    { workList: 'Fraction Paid By Volume', volume: 0.61 },
    { workList: 'Fraction Paid By Value', volume: 0.38 },
  ];

  showTable: boolean = false;
  showTable1: boolean = false;
  showTable2: boolean = false;

  toggleTable(table: string) {
    if (table === 'table') {
      this.showTable = !this.showTable; // Toggle the state
      this.showTable1 = false; // Ensure other tables are closed
      this.showTable2 = false;
    } else if (table === 'table1') {
      this.showTable1 = !this.showTable1; // Toggle the state
      this.showTable = false;
      this.showTable2 = false;
    } else if (table === 'table2') {
      this.showTable2 = !this.showTable2; // Toggle the state
      this.showTable = false;
      this.showTable1 = false;
    }
  }


  
  referralsFilter(event: MouseEvent): void {

    this.showTable = false;
    this.showTable1 = false;
    this.showTable2 = false;
    
    const buttonRect = (event.target as HTMLElement).getBoundingClientRect();
    const marginRight = -400; // Adjust this value as needed for the left margin
    const dialogPosition = {
      top: `${buttonRect.bottom}px`,
      left: `${buttonRect.left + marginRight}px`, // Add margin to the left
    };

    this.dialog.open(ReferralsfilterComponent, {
      height: 'auto',
      width: '450px',
      position: dialogPosition,
    });
  }

  filterToggle: boolean;
  public currentPage = 0;
  public totalSize = 0;
  filterForm: FormGroup;
  eventTypes: string[] = ['Tim Cook', 'Kim Johnson', 'Maria', 'Sophia Kelly'];
  filteredEventTypes: string[] = [...this.eventTypes];
  selectedEventType: string | null = null;

  isCardView: boolean = true;

  allTasks = [
    {
      name: 'Billing Records',
      providername: 'Lorem IPsum',
      providernameColor: 'green',
      percent: 60,
      color: 'blue',
      innerColor: 'lightblue',
      dueDate: '20-12-2022',
      taskType: 'inProgress',
      icon: 'file_copy',
      isMasked: false,
       cardColor: 'white'
    },
    {
      name: 'Medical Records',
      providername: 'Lorem IPsum',
      providernameColor: 'orange',
      percent: 80,
      color: 'orange',
      innerColor: 'lightorange',
      dueDate: '21-12-2022',
      taskType: 'completed',
      icon: 'insert_drive_file',
      isMasked: false,
       cardColor: 'white'
    },
    {
      name: 'Letter of Protection',
      providername: 'Lorem IPsum',
      providernameColor: 'red',
      percent: 40,
      color: 'red',
      innerColor: 'lightred',
      dueDate: '22-12-2022',
      taskType: 'complaint',
      icon: 'folder_open',
      isMasked: false,
       cardColor: 'white'
    },
    {
      name: 'Medical Records',
      providername: 'Lorem IPsum',
      providernameColor: 'orange',
      percent: 80,
      color: 'orange',
      innerColor: 'lightorange',
      dueDate: '21-12-2022',
      taskType: 'completed',
      icon: 'rule_folder'
    },
    {
      name: 'Letter of Protection',
      providername: 'Lorem IPsum',
      providernameColor: 'red',
      percent: 40,
      color: 'red',
      innerColor: 'lightred',
      dueDate: '22-12-2022',
      taskType: 'complaint',
      icon: 'file_present'
    }
  ];



  // isCardView: boolean = true;
  toggleButtonText() {
    this.isCardView = !this.isCardView;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase(); // Safe casting to HTMLInputElement
    this.filteredEventTypes = this.eventTypes.filter(eventType => eventType.toLowerCase().includes(filterValue));
  }


  constructor(
    public dialog: MatDialog,
    public router: Router,) {

  }

  isNavOpen = true;
  showPost = true;

  items: string[] = [
    'Clinic Notes', 'Denials', 'Verification', 'LOP Request', 'Medical Clearance',
    'Consent', 'Order', 'Referral', 'Pre-Auth', 'LOP', 'WC', 'FMLA',
    'ID & Insur', 'Labs', 'Imaging', 'Other', 'Estimate'
  ];

  selectedItem: string | null = null;

  ngOnInit() {
    this.selectedItem = this.items[0];
    this.selectedItems = this.itemss[0];
  }

  selectItem(item: string): void {
    this.selectedItem = item;
  }

  itemss: string[] = [
    'Finalized Medical Record', 'OUTSIDE BILL', 'Corporate Invoice', 'AOB', 'EOB',
    'Registration', 'Digital Registration', 'HIPAA Release', 'Consents', 'Med Record',
    'OP Report', 'ER-Visit', 'Labs', 'Imaging', 'Clinic Note'
  ];

  selectedItems: string | null = null;


  selectItems(item: string): void {
    this.selectedItems = item;
  }
  toggleNav() {
    this.isNavOpen = !this.isNavOpen;
  }
  // ngOnInit(): void {
  // }


  opencasedialog() {
    this.dialog.open(AddReferralDocComponent, {
      width: "700px",
      height: "auto"
    });
  }

  visitType: string = 'preVisit';  // Default value can be 'preVisit' or 'postVisit'

  onVisitTypeChange(event: any) {
    console.log('Visit Type changed to:', this.visitType); // Optional: Add any logic you need when the toggle changes
  }

  values1 = [
    {
      documentType: 'Lorem IPsum',
      documentTitle: 'Audit Report - Q1',
      uploadFile: 'audit_report_q1.pdf',
      uploadedDate: '10-Dec-2024',
      uploadedBy: 'Corey Williams',
      remarks: 'Reviewed and approved.',
      patientId: '12345678',
      referralId: '87654321',
      visitId: '23456789',
      claimId: '98765432',
      caseId: '34567890',
      locationId: '45678901',
      providerId: '56789012',
      patientName: 'John Doe',
      locationName: 'Location A',
      providerName: 'Dr. Smith'
    },
    {
      documentType: 'Lorem IPsum',
      documentTitle: 'Inspection Checklist',
      uploadFile: 'inspection_checklist.xlsx',
      uploadedDate: '08-Dec-2024',
      uploadedBy: 'Alex Johnson',
      remarks: 'Pending final review.',
      patientId: '23456789',
      referralId: '98765432',
      visitId: '34567890',
      claimId: '87654321',
      caseId: '45678901',
      locationId: '56789012',
      providerId: '67890123',
      patientName: 'Jane Smith',
      locationName: 'Location B',
      providerName: 'Dr. Johnson'
    },
    {
      documentType: 'Lorem IPsum',
      documentTitle: 'Compliance Summary',
      uploadFile: 'compliance_summary.docx',
      uploadedDate: '05-Dec-2024',
      uploadedBy: 'Sophia Brown',
      remarks: 'Submitted for approval.',
      patientId: '34567890',
      referralId: '65432109',
      visitId: '45678901',
      claimId: '76543210',
      caseId: '56789012',
      locationId: '67890123',
      providerId: '78901234',
      patientName: 'Tom Hanks',
      locationName: 'Location C',
      providerName: 'Dr. White'
    },
    {
      documentType: 'Lorem IPsum',
      documentTitle: 'Inspection Checklist',
      uploadFile: 'inspection_checklist.xlsx',
      uploadedDate: '08-Dec-2024',
      uploadedBy: 'Alex Johnson',
      remarks: 'Pending final review.',
      patientId: '45678901',
      referralId: '76543210',
      visitId: '56789012',
      claimId: '65432109',
      caseId: '67890123',
      locationId: '78901234',
      providerId: '89012345',
      patientName: 'Lucy Liu',
      locationName: 'Location D',
      providerName: 'Dr. Green'
    },
    {
      documentType: 'Lorem IPsum',
      documentTitle: 'Compliance Summary',
      uploadFile: 'compliance_summary.docx',
      uploadedDate: '05-Dec-2024',
      uploadedBy: 'Sophia Brown',
      remarks: 'Submitted for approval.',
      patientId: '56789012',
      referralId: '87654321',
      visitId: '67890123',
      claimId: '54321098',
      caseId: '78901234',
      locationId: '89012345',
      providerId: '90123456',
      patientName: 'Emma Watson',
      locationName: 'Location E',
      providerName: 'Dr. Black'
    }
  ];

  open(item: any) {
    this.dialog.open(PatientPopComponent, {
      data: item,
      height: 'auto',
      width: '1200px'
    });
  }

  scrollGrid(side: 'left' | 'right') {
    const ele = document.getElementById('grid-table-container');
    const scrollAmount = 210; // Adjust this value as needed

    if (ele) {
      // Check if ele is not null
      if (side === 'right') {
        ele.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      } else {
        ele.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      }
    }
  }



}



