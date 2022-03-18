# Remix fetch can't read multiple header values

When I use fetch from a server context, I'm able to access the `set-cookie` header. However, the server sent several of them, and they're combined into a single comma-separated value by the time I'm able to read it.

```
set-cookie: order_form_id=12; domain=multiple-set-cookies.bgschiller.repl.co;  expires=Fri, 01 Apr 2022 17:09:58 GMT; path=/
set-cookie: project_id=8; domain=multiple-set-cookies.bgschiller.repl.co; expires=Fri, 01 Apr 2022 17:09:58 GMT; path=/
```

I receive

```
set-cookie: order_form_id=12; domain=multiple-set-cookies.bgschiller.repl.co;  expires=Fri, 01 Apr 2022 17:13:17 GMT; path=/, project_id=8; domain=multiple-set-cookies.bgschiller.repl.co; expires=Fri, 01 Apr 2022 17:13:17 GMT; path=/
```

Unfortunately, I can't just split on commas, as the expire dates also have commas. So there's no clean way to get individual header values.

I'm trying to proxy some routes to another server, so I need to rewrite the cookie domains to match my server and not the origin server. I have a workaround using an express server instead of the remix dev server. But presumable there are other use cases for reading repeated headers as separate entities?
