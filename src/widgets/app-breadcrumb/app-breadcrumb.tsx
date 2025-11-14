'use client';

import { Fragment } from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/shared/ui/breadcrumb';
import { usePathname } from 'next/navigation';
import { breadcrumbMap } from './app-breadcrumb.config';

export function AppBreadcrumb() {
  const pathname = usePathname();
  const crumbs = breadcrumbMap[pathname] || [];

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>Home</BreadcrumbItem>

        {crumbs.map((crumb, i) => (
          <Fragment key={crumb}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>{i === crumbs.length - 1 ? <BreadcrumbPage>{crumb}</BreadcrumbPage> : crumb}</BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
