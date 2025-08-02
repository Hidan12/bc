import { NextResponse } from 'next/server';

export function middleware(request) {
  const forwardedFor = request.headers.get('dominio-proxy') || "dominio.com";
  const response = NextResponse.next();

  if (forwardedFor) {
    response.headers.set('proxy', forwardedFor);
  }

  return response;
}

export const config = {
  matcher: ['/api/sesion'],
};
