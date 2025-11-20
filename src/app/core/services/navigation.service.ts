import {inject, Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {AuthService} from "./auth.service";
import {GROUP_PERMISSIONS, Permission} from "../../shared/enums/permission";

export interface IMenuItem {
    id?: string;
    title?: string;
    description?: string;
    type: string;       // Possible values: link/dropDown/extLink
    name?: string;      // Used as display text for item and title for separator type
    state?: string;     // Router state
    icon?: string;      // Material icon name
    tooltip?: string;   // Tooltip text
    disabled?: boolean; // If true, item will not be appeared in sidenav.
    sub?: IChildItem[]; // Dropdown items
    badges?: IBadge[];
    active?: boolean;
}
export interface IChildItem {
    id?: string;
    parentId?: string;
    type?: string;
    name: string;       // Display text
    state?: string;     // Router state
    icon?: string;
    sub?: IChildItem[];
    active?: boolean;
    disabled?: boolean;
}

interface IBadge {
    color: string;      // primary/accent/warn/hex color codes(#fff000)
    value: string;      // Display text
}

interface ISidebarState {
    sidenavOpen?: boolean;
    childnavOpen?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class NavigationService {
    public sidebarState: ISidebarState = {
        sidenavOpen: true,
        childnavOpen: false
    };
    selectedItem: IMenuItem;

    protected authSrv: AuthService = inject(AuthService);

    constructor() {
    }

    defaultMenu: IMenuItem[] = [
        {
            name: 'dashboard',
            type: 'link',
            icon: 'i-Bar-Chart',
            state: '/dashboard'
        },
        {
            name: 'services',
            type: 'link',
            icon: 'i-Shop-4',
            state: 'transactions/services'
        },
        {
            name: 'history',
            type: 'dropDown',
            icon: 'i-Money-2',
            sub: [
                { icon: 'i-Business-Man', name: 'my_history', state: 'transactions/history/agent', type: 'link' },
                { icon: 'i-Business-Mens', name: 'history_agency', state: 'transactions/history/agency', type: 'link', disabled: !this.authSrv.hasPermission(Permission.HISTORY_AGENCY_VIEW) },
                { icon: 'i-University1', name: 'history_global', state: 'transactions/history/all', type: 'link', disabled: !this.authSrv.hasPermission(Permission.HISTORY_CASHIER_VIEW) },
            ]
        },
        {
            name: 'reporting',
            type: 'link',
            icon: 'i-Statistic',
            state: 'reporting',
            disabled: !this.authSrv.hasPermission(Permission.REPORT_VIEW)
        },
        {
            name: 'management',
            type: 'dropDown',
            icon: 'i-Management',
            disabled: !this.authSrv.hasAnyPermission([...GROUP_PERMISSIONS.MANAGEMENT]),
            sub: [
                { icon: 'i-Token-', name: 'operation_review', state: 'management/operation-review', type: 'link', disabled: !this.authSrv.hasPermission(Permission.FUNDS_TRANSFER_VIEW)  },
                { icon: 'i-Financial', name: 'transfer_fund', state: 'management/transfer-fund', type: 'link', disabled: !this.authSrv.hasPermission(Permission.FUNDS_TRANSFER_VIEW)  },
                { icon: 'i-Business-ManWoman', name: 'agents', state: 'management/agents/all', type: 'link', disabled: !this.authSrv.hasPermission(Permission.CASHIER_ALL_VIEW) },
                { icon: 'i-Business-ManWoman', name: 'my_agents', state: 'management/agency/agents', type: 'link', disabled: !this.authSrv.hasPermission(Permission.CASHIER_VIEW) },
                { icon: 'i-University1', name: 'agencies', state: 'management/agencies', type: 'link', disabled: !this.authSrv.hasPermission(Permission.AGENCY_VIEW) },
                { icon: 'i-Lock-User', name: 'role_profile', state: 'management/role-and-profile', type: 'link', disabled: !this.authSrv.hasPermission(Permission.ROLE_VIEW) },
            ]
        },
    ];


    // sets iconMenu as default;
    menuItems = new BehaviorSubject<IMenuItem[]>(this.defaultMenu);
    // navigation component has subscribed to this Observable
    menuItems$ = this.menuItems.asObservable();

    // You can customize this method to supply different menu for
    // different user type.
    // publishNavigationChange(menuType: string) {
    //   switch (userType) {
    //     case 'admin':
    //       this.menuItems.next(this.adminMenu);
    //       break;
    //     case 'user':
    //       this.menuItems.next(this.userMenu);
    //       break;
    //     default:
    //       this.menuItems.next(this.defaultMenu);
    //   }
    // }
}
