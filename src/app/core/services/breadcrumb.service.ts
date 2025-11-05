import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, NavigationEnd } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface Breadcrumb {
  label: string;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private readonly _breadcrumbs$ = new BehaviorSubject<Breadcrumb[]>([]);
  readonly breadcrumbs$ = this._breadcrumbs$.asObservable();

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateBreadcrumbs();
      });

    this.updateBreadcrumbs();
  }

  private updateBreadcrumbs() {
    const root = this.router.routerState.snapshot.root;
    const breadcrumbs: Breadcrumb[] = [];
    this.buildBreadcrumbs(root.firstChild!, [], breadcrumbs, new Set());
    this._breadcrumbs$.next(breadcrumbs);
  }

  /**
   * Ajoute récursivement les breadcrumbs à partir de la route active.
   */
  private buildBreadcrumbs(
    route: ActivatedRouteSnapshot,
    pathSegments: string[],
    breadcrumbs: Breadcrumb[],
    seenUrls: Set<string>
  ) {
    if (!route) return;

    const routePart = route.url.map(segment => segment.path);

    if (routePart.length > 0) {
      pathSegments = [...pathSegments, ...routePart];

      const url = '/' + pathSegments.join('/');
      const label = route.data['title'] || this.formatLabel(routePart[routePart.length - 1]);

      if (!seenUrls.has(url)) {
        seenUrls.add(url);
        breadcrumbs.push({ label, url });
      }
    } else if (!pathSegments.length) {
      // Ajout d’un lien "Accueil" pour la racine
      // if (!seenUrls.has('/dashboard')) {
      //   seenUrls.add('/dashboard');
      //   breadcrumbs.push({ label: 'dashboard', url: '/dashboard' });
      // }
    }

    if (route.firstChild) {
      this.buildBreadcrumbs(route.firstChild, pathSegments, breadcrumbs, seenUrls);
    }
  }

  /**
   * Transforme un segment d’URL en label lisible.
   * Ex : "produits-electronique" -> "Produits Electronique"
   */
  private formatLabel(text: string): string {
    return text.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }
}
