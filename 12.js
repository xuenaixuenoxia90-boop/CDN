export default {
  async fetch(request, env) {
    const url = new URL(request.url);
   
    if (url.pathname.startsWith('/proxy/')) {
      const targetUrl = url.pathname.slice(7) + url.search;
      
      const headers = new Headers(request.headers);
      headers.delete('Referer');
      headers.delete('Origin');
      // headers.delete('User-Agent');   // 如果需要也可以删除

      const proxyRequest = new Request(targetUrl, {
        method: request.method,
        headers: headers,
        body: request.body,
        redirect: 'follow',
      });

      try {
        const response = await fetch(proxyRequest);
        
        const newResponse = new Response(response.body, response);
        
        // 添加 CORS 支持
        newResponse.headers.set('Access-Control-Allow-Origin', '*');
        newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
        newResponse.headers.set('Access-Control-Allow-Headers', '*');
        
        return newResponse;
      } catch (err) {
        return new Response('Proxy Error: ' + err.message, { status: 502 });
      }
    }

    return new Response('Not Found', { status: 404 });
  }
};