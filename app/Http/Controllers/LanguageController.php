<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;

class LanguageController extends Controller
{
    public function switch(Request $request)
    {
        $validated = $request->validate([
            'language' => 'required|in:en,zh',
        ]);

        $language = $validated['language'];
        
        Session::put('locale', $language);
        App::setLocale($language);

        if ($request->user()) {
            $request->user()->update(['language' => $language]);
        }

        return back();
    }
}