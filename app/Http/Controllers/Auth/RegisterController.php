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
        return Inertia::render('Auth/Register');
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
        $verificationCode = $user->generateVerificationCode();
        
        // Send verification code via Laravel Mail
        try {
            \Log::info('Attempting to send verification email to: ' . $user->email . ' with code: ' . $verificationCode);
            
            \Mail::raw("Your verification code is: {$verificationCode}\n\nThis code expires in 10 minutes.", function ($message) use ($user) {
                $message->to($user->email)
                        ->subject('Your Verification Code - Shopping Agent');
            });
            
            \Log::info('Email sent successfully to: ' . $user->email);
        } catch (\Exception $e) {
            \Log::error('Email sending failed: ' . $e->getMessage());
            // If email sending fails, auto-verify for now
            $user->markEmailAsVerified();
        }

        $this->membershipService->createTrialMembership($user);

        Auth::login($user);

        return redirect(route('verification.code'))->with('email', $user->email);
    }
}