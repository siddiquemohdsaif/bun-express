-- post.lua
wrk.method = "POST"
wrk.body   = '{"data":"valueaaaaaaaaa"}' -- Your POST data here
wrk.headers["Content-Type"] = "application/json"
