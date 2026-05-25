import { Directive, Input, OnInit, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { AuthState } from '../../features/auth/state/auth.state';

@Directive({
  selector: '[hasRole]',
  standalone: true
})
export class HasRoleDirective implements OnInit {
  @Input() hasRole = '';

  private templateRef = inject(TemplateRef<unknown>);
  private viewContainer = inject(ViewContainerRef);
  private authState = inject(AuthState);

  ngOnInit(): void {
    const user = this.authState.currentUser();
    if (user?.role === this.hasRole) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
