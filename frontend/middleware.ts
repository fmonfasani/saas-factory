import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    const url = req.nextUrl;

    // Get hostname (e.g. 'saasfactory.com' or 'project.saasfactory.com')
    const hostname = req.headers.get('host') || '';

    // Define allowed domains (localhost and production)
    const allowedDomains = ['localhost:3000', 'saasfactory.com'];

    // Check if current hostname is one of the main domains
    const isMainDomain = allowedDomains.some(domain =>
        hostname === domain || hostname.endsWith(`.${domain}`)
    );

    // Extract subdomain
    // logic: if 'project.saasfactory.com', subdomain is 'project'
    // if 'localhost:3000', no subdomain (unless we use *.localhost.me etc)

    // For local development with subdomains, users often use *.localhost.direct or /etc/hosts
    // Here we'll assume standard Vercel-like wildcard behavior

    const currentHost = process.env.NODE_ENV === 'production' && process.env.VERCEL === '1'
        ? hostname.replace(`.saasfactory.com`, '')
        : hostname.replace(`.localhost:3000`, '');

    // If we have a subdomain and it's not 'www' or the main domain itself
    if (
        hostname.includes('.') &&
        !hostname.startsWith('www.') &&
        hostname !== 'localhost:3000' &&
        hostname !== 'saasfactory.com'
    ) {
        // Rewrite logic:
        // project-abc.saasfactory.com -> /sites/project-abc
        const subdomain = hostname.split('.')[0];

        // Allow accessing API routes directly
        if (url.pathname.startsWith('/api') || url.pathname.startsWith('/_next')) {
            return NextResponse.next();
        }

        // Rewrite to the sites page
        // We treat the subdomain as the projectId (or we'd need a slug lookup)
        url.pathname = `/sites/${subdomain}${url.pathname}`;
        return NextResponse.rewrite(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
