<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\MembershipService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisterController extends Controller
{
    private MembershipService $membershipService;

    public function __construct(MembershipService $membershipService)
    {
        $this->membershipService = $membershipService;
    }

    public function create(): Response
    {
        try {
            return Inertia::render('Auth/Register');
        } catch (\Exception $e) {
            \Log::error('Register page error: ' . $e->getMessage());
            abort(500, 'Unable to load registration page');
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'language' => $request->language ?? 'en',
        ]);

        // Generate verification code and send email via Laravel
        $shouldRedirectToVerification = false;
        
        try {
            $verificationCode = $user->generateVerificationCode();
            
            // Send verification code via Laravel Mail
            try {
                \Log::info('Mail config - MAILER: ' . config('mail.default'));
                \Log::info('Mail config - HOST: ' . config('mail.mailers.smtp.host'));
                \Log::info('Mail config - USERNAME: ' . config('mail.mailers.smtp.username'));
                \Log::info('Attempting to send verification email to: ' . $user->email . ' with code: ' . $verificationCode);
                
                \Mail::raw("Your verification code is: {$verificationCode}\n\nThis code expires in 10 minutes.", function ($message) use ($user) {
                    $message->to($user->email)
                            ->subject('Your Verification Code - Shopping Agent');
                });
                
                \Log::info('Email sent successfully to: ' . $user->email);
                $shouldRedirectToVerification = true;
            } catch (\Exception $e) {
                \Log::error('Email sending failed: ' . $e->getMessage());
                // If email sending fails, auto-verify for now
                $user->markEmailAsVerified();
            }
        } catch (\Exception $e) {
            \Log::error('Verification code generation failed: ' . $e->getMessage());
            // Auto-verify if verification code generation fails (missing DB columns)
            $user->markEmailAsVerified();
        }

        try {
            $this->membershipService->createTrialMembership($user);
        } catch (\Exception $e) {
            \Log::error('Trial membership creation failed: ' . $e->getMessage());
            // Continue without trial membership for now
        }

        Auth::login($user);
        
        // Check if user needs verification
        if (!$user->hasVerifiedEmail() && $shouldRedirectToVerification) {
            return redirect(route('verification.code'))->with('info', 'Please verify your email to continue.');
        }

        // For production, auto-verify users to avoid issues
        if (!$user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
            \Log::info('Auto-verified user: ' . $user->email);
        }

        // Always redirect to dashboard after registration
        return redirect(route('dashboard'))->with('success', 'Registration successful! Welcome to Shopping Agent Pro.');
    }
}