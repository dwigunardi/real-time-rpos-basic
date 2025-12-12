'use client';

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';

export default function DashboardBreadcrumb() {
    const pathname = usePathname();
    const pathsegments = pathname.split('/').slice(1);
    return (
        <Breadcrumb>
            <BreadcrumbList>
                {pathsegments.map((path, index) => (
                    <Fragment key={`path-${path}`}>
                        <BreadcrumbItem className="capitalize">
                            {index < pathsegments.length - 1 ? (
                                <BreadcrumbLink
                                    href={`/${pathsegments.slice(0, index + 1).join('/')}`}
                                >
                                    {path}
                                </BreadcrumbLink>
                            ) : (
                                <BreadcrumbPage className='cursor-default'>{path}</BreadcrumbPage>
                            )}
                        </BreadcrumbItem>
                        {index < pathsegments.length - 1 && <BreadcrumbSeparator />}
                    </Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    )
}