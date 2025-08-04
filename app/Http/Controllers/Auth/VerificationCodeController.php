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

        // Send new verification code via Laravel Mail
        try {
            \Log::info('Resend - Mail config - MAILER: ' . config('mail.default'));
            \Log::info('Resend - Mail config - HOST: ' . config('mail.mailers.smtp.host'));
            \Log::info('Resend - Mail config - USERNAME: ' . config('mail.mailers.smtp.username'));
            \Log::info('Resend - Attempting to send verification email to: ' . $user->email . ' with code: ' . $verificationCode);
            
            \Mail::raw("Your new verification code is: {$verificationCode}\n\nThis code expires in 10 minutes.", function ($message) use ($user) {
                $message->to($user->email)
                        ->subject('New Verification Code - Shopping Agent');
            });
            
            \Log::info('Resend - Email sent successfully to: ' . $user->email);
        } catch (\Exception $e) {
            \Log::error('Resend - Email sending failed: ' . $e->getMessage());
        }

        return back()->with('success', 'New verification code sent!');
    }
}
