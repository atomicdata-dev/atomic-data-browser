# snowpack-plugin-baseUrl-handler
This snowpack plugin will handle the baseUrl. That means it will make it possible to run several snowpack applications under one domain with help of a proxy passing webserver, such NGINX.

Ex:

```
https://www.mydomain.com/site-a
https://www.mydomain.com/site-b
```

## Usage
Use `%BASE_URL%` as a prefix to every urls that is pointing towards the applications public folder. Ex.

#### index.html
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <link rel="icon" href="%BASE_URL%/favicon.ico" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="%BASE_URL%/_dist_/index.js"></script>
  </body>
</html>

```

#### js
```js
const MyImage = () => <img src="%BASE_URL%/my-image.jpg" />

```

Note: It is not recommended to use this plugin at the same time of usage of baseUrl configuration within the snowpack configuration.

## Configure


#### snowpack.config.js
```js
module.exports = {
  plugins: [
    ["snowpack-plugin-baseurl-handler", {
      exts: [".html", ".js", ".jsx", ".css"], // Add those file extensions you want to be affected by this plugin
      baseUrl: '/my-custom-base-url', // Path where the snowpack app is located within the web server
      debug: true, // Debug output during build process. Default: false.
    }],
  ],
}
```

**Note: The plugin will override baseurl configuration with the value `''` when running in `dev` mode**
