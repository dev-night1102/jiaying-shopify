<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;

class SetLocale
{
    public function handle(Request $request, Closure $next)
    {
        if ($request->user() && $request->user()->language) {
            $locale = $request->user()->language;
        } elseif (Session::has('locale')) {
            $locale = Session::get('locale');
        } else {
            $locale = config('app.locale');
        }

        App::setLocale($locale);

        return $next($request);
    }
}