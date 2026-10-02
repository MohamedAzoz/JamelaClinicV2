import { inject, Service } from '@angular/core';
import { IdentityService } from './identity-service';

@Service()
export class RoleCheck {
  private readonly identityService = inject(IdentityService);

  hasRole(roles: string[]): boolean {
    const currentRole = this.identityService.userRole();
    if (!currentRole) {
      return false;
    }
    return roles.includes(currentRole);
  }
}
