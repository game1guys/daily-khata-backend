<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Daily-KHATA</title>
    <link rel="icon" type="image/svg+xml" href="{{ asset('favicon-daily-khata.svg') }}">
    @viteReactRefresh
    @vite(['resources/js/daily-khata-web/main.tsx'])
</head>
<body class="antialiased">
    <div id="root"></div>
</body>
</html>
