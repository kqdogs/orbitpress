import {vi} from 'vitest';
/** Mock external DNS, retain the real URL / IP / redirect validation under test. */
export function mockImportFetch(source:typeof fetch){
 const fetcher=vi.fn(source);
 vi.stubGlobal('fetch',vi.fn((input:Parameters<typeof fetch>[0],init?:RequestInit)=>{
  const url=new URL(String(input));
  if(['cloudflare-dns.com','dns.alidns.com'].includes(url.hostname))return Promise.resolve(Response.json({Status:0,Answer:url.searchParams.get('type')==='A'?[{type:1,data:'93.184.216.34'}]:[]}));
  return fetcher(input,init);
 }));return fetcher;
}
