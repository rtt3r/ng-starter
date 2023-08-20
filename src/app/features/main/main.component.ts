import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { KeycloakProfile } from 'keycloak-js';
import { Subject, takeUntil } from 'rxjs';

import { Language, Theme } from './../../shared/models/settings';
import { AuthService } from './../../shared/services/auth.service';
import { SharedModule } from './../../shared/shared.module';
import { CoreStore } from './../../store/core/core.store';
import { CustomersStore } from './../../store/customers/customers.store';
import { RouterStore } from './../../store/router/router.store';
import { SettingsStore } from './../../store/settings';
import { NavItemComponent } from './components/sidebar/nav-item.component';
import { NavComponent } from './components/sidebar/nav.component';
import { NavigationItem, SidebarComponent } from './components/sidebar/sidebar.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    SharedModule,
    SidebarComponent,
    NavComponent,
    NavItemComponent
  ],
  templateUrl: './main.component.html',
  host: { 'class': 'h-screen flex' }
})
export class MainComponent implements OnInit, OnDestroy {
  private $unsub = new Subject();

  private readonly authService: AuthService = inject(AuthService);
  private readonly coreStore: CoreStore = inject(CoreStore);
  private readonly settingsStore: SettingsStore = inject(SettingsStore);
  private readonly customersStore: CustomersStore = inject(CustomersStore);
  private readonly routerStore: RouterStore = inject(RouterStore);

  private user!: KeycloakProfile;

  readonly navigation: NavigationItem[] = [
    { path: '/dashboard', icon: 'layout-dashboard', label: 'ng-starter.navigation.dashboard' }
  ];

  readonly languages: Map<Language, { icon: string, label: string }> = new Map([
    ['pt-br', { icon: 'fi-br', label: 'ng-starter.settings.language.pt-br' }],
    ['en', { icon: 'fi-us', label: 'ng-starter.settings.language.en' }]
  ]);

  readonly themes: { value: Theme; label: string; }[] = [
    { value: 'light', label: 'ng-starter.settings.themes.light' },
    { value: 'dark', label: 'ng-starter.settings.themes.dark' }
  ];

  readonly user$ = this.authService.getLoggedUser();
  readonly sidebar$ = this.coreStore.sidebar$;
  readonly theme$ = this.settingsStore.theme$;
  readonly language$ = this.settingsStore.language$;

  get username() {
    return this.user?.firstName;
  }

  async ngOnInit() {
    this.user = await this.authService.loadUserProfile();

    this.routerStore.routerStateUrl$
      .pipe(
        takeUntil(this.$unsub)
      )
      .subscribe(({ data, queryParams }) => {
        console.log('route data => ', data);
        console.log('route queryParams => ', queryParams);
      });

    this.customersStore.listCustomers();
  }

  ngOnDestroy(): void {
    this.$unsub.next(false);
    this.$unsub.complete();
  }

  onLanguageSelect(language: Language) {
    this.settingsStore.changeLanguage(language);
  }

  onThemeSelect(theme: Theme) {
    this.settingsStore.changeTheme(theme);
  }

  onToggleSidebarStyle() {
    this.coreStore.toggleSidebarStyle();
  }

  onSignOut() {
    this.authService.logout();
  }
}
