import { renderToString } from "react-dom/server";
import { RemixServer } from "remix";
import type { EntryContext } from "remix";

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const url = new URL(request.url)
  if (url.pathname === '/proxy-pls') {

    // if you inspect this URL in the browser or with curl -v, you'll see multiple
    // set-cookie headers: order_form_id and project_id
    const resp = await fetch('https://multiple-set-cookies.bgschiller.repl.co');
    // When we look at them here, they've been combined into a single comma-separated value.
    // Unfortunately, the expire dates also have commas (expires=Fri, 01 Apr 2022 17:09:58 GMT)
    // so there's not a clean way to get the individual header values back.
    console.log('set-cookie headers', resp.headers.get('set-cookie'));
    resp.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'set-cookie') {
        responseHeaders.append(key, value.replace(/domain=multiple-set-cookies\.bgschiller\.repl\.co/g, url.host))
      } else {
        responseHeaders.append(key, value);
      }
    });
    // however, we are able to send down multiple set-cookie headers. This appears separate from
    // the other two. The problem seems to be only when reading
    responseHeaders.append('set-cookie', 'just=for-show');
    return new Response(resp.body, {
      headers: responseHeaders,
      status: resp.status,
      statusText: resp.statusText,
    });
  }

  let markup = renderToString(
    <RemixServer context={remixContext} url={request.url} />
  );

  responseHeaders.set("Content-Type", "text/html");

  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
