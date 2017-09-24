module.exports = (markup, state) => {
  return `
  <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Sauce List</title>
        <meta name="description" content="Find the best sauce!">
        <link id="favicon" rel="icon" href="https://cdn.glitch.com/6d516a70-a186-469f-8bca-b3edbf89ca5a%2Ffavicon-96x96.png?1506231386807" type="image/x-icon">
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="/style.css">

        <!-- Global Site Tag (gtag.js) - Google Analytics -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-106867824-1"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments)};
          gtag('js', new Date());

          gtag('config', 'UA-106867824-1');
        </script>
      </head>
      <body>
        <div id='app'>${markup}</div>
        <script>
          window.__PRELOADED_STATE__ = ${
            JSON.stringify(state || {}).replace('/</g', '\\u003c')
          };
        </script>
        <script src='/bundle.js'></script>
      </body>
    </html>
  `
}
