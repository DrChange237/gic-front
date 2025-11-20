import {Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import {Permission} from "../enums/permission";
import {AuthService} from "../../core/services/auth.service";

@Directive({
	selector: '[hasPermission]',
	standalone: true,
})
export class HasPermissionDirective {
	@Input() set hasPermission(permission: Permission) {
		if (!this.authSrv.hasPermission(permission)) {
			this.viewContainer.clear();
		} else {
			this.viewContainer.createEmbeddedView(this.templateRef);
		}
	}

	constructor(
		private templateRef: TemplateRef<any>,
		private viewContainer: ViewContainerRef,
		private authSrv: AuthService
	) {}
}
