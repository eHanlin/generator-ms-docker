<%= appname %>
========================================

## Change Env

*default:*
```bash
gulp env
```

*test:*
```bash
gulp:test
```

*production:*
```bash
gulp:production
```

## Watch

```bash
gulp watch
```

## Build

```bash
gulp
```

<% if ( REQUIRE.S3 ) { %>
## Publish S3

```bash
gulp publish:zip
```
<% } %>
