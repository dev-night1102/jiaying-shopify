<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Error - Shopping Agent</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 40px; 
            text-align: center; 
            background: #f8fafc;
        }
        .container {
            max-width: 500px;
            margin: 0 auto;
            padding: 40px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .error { color: #e3342f; }
        .btn {
            display: inline-block;
            padding: 12px 24px;
            background: #3490dc;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            margin-top: 20px;
        }
        .btn:hover { background: #2779bd; }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="error">Temporary Error</h1>
        <p>{{ $message ?? 'Something went wrong. Please try again.' }}</p>
        @if(isset($link) && isset($linkText))
            <a href="{{ $link }}" class="btn">{{ $linkText }}</a>
        @else
            <a href="/" class="btn">Go to Home</a>
        @endif
    </div>
</body>
</html>