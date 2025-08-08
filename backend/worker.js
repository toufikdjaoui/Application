// Cloudflare Worker pour Mode DZ Backend
// Ce worker fait proxy vers votre backend FastAPI hébergé sur un service externe

export default {
  async fetch(request, env) {
    // URL de votre backend FastAPI (changez selon votre service)
    const backendUrl = 'https://mode-dz-backend.onrender.com'; // Ou Vercel, Railway, etc.
    
    const url = new URL(request.url);
    const proxyUrl = backendUrl + url.pathname + url.search;
    
    // Headers CORS
    const corsHeaders = {
      'Access-Control-Allow-Origin': env.CORS_ORIGINS || '*',
      'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS,PUT,DELETE,PATCH',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Requested-With',
      'Access-Control-Max-Age': '86400',
    };
    
    // Gérer les requêtes OPTIONS (preflight)
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }
    
    try {
      // Proxy la requête vers le backend
      const response = await fetch(proxyUrl, {
        method: request.method,
        headers: {
          ...request.headers,
          'Host': new URL(backendUrl).host,
        },
        body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
      });
      
      // Copier la réponse avec headers CORS
      const modifiedResponse = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: {
          ...response.headers,
          ...corsHeaders,
        },
      });
      
      return modifiedResponse;
      
    } catch (error) {
      return new Response(JSON.stringify({
        error: 'Backend service unavailable',
        message: error.message
      }), {
        status: 503,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }
  }
};
