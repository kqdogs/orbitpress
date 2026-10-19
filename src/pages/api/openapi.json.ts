import { openapi } from '../../lib/openapi';
export function GET(){return new Response(JSON.stringify(openapi,null,2),{headers:{'Content-Type':'application/json; charset=utf-8'}});}
