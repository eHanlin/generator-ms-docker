<%= appname %>
========================================

## Change Env

*default:*
```bash
gulp env
```

*test:*
```bash
gulp env:test
```

*production:*
```bash
gulp env:production
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

Publish a backend zip which your project is compressed. And the file will be pushed to aws s3.

```bash
gulp publish:zip
```

Publish static files to aws s3.

```bash
gulp publish:static
```
<% } %>
