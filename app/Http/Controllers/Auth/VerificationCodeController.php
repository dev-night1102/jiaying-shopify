<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class VerificationCodeController extends Controller
{
    public function show()
    {
        return Inertia::render('Auth/VerifyCode', [
            'email' => session('email') ?? Auth::user()->email
        ]);
    }

    public function verify(Request $request)
    {
        $request->validate([
            'code' => 'required|string|size:6'
        ]);

        $user = Auth::user();
        
        if ($user->verifyCode($request->code)) {
            return redirect(route('dashboard'))->with('success', 'Email verified successfully!');
        }

        return back()->withErrors(['code' => 'Invalid or expired verification code.']);
    }

    public function resend()
    {
        $user = Auth::user();
        $verificationCode = $user->generateVerificationCode();

        // Send new verification code via Nodemailer service
        $response = Http::post('http://localhost:3001/send-verification', [
            'email' => $user->email,
            'code' => $verificationCode
        ]);

        return back()->with('success', 'New verification code sent!');
    }
}
