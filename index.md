# Memory: index.md
Updated: now

Design system: Purple primary (#7C3AED), dark navy sidebar (#1E293B), Plus Jakarta Sans font.
Brand: CareSplit - healthcare financing, split heart logo. CareSplit Pro = provider portal.
Pages: Landing, Onboarding (3-step carousel), AuthChoice (Patient/Hospital), Login, Signup, VerifyOTP, Dashboard (with sidebar layout), Bills, Payment Plans, Manage Plan, Notifications, Transactions, Settings.
Provider pages: ProviderLogin, ProviderRegister, ProviderDashboard, ProviderPatients (under /provider/*).
Routes: /, /onboarding, /auth-choice, /login, /signup, /verify-otp, /dashboard/*, /provider/login, /provider/register, /provider/dashboard/*
Flow: Landing → Get Started → Onboarding → AuthChoice → Patient(signup→OTP→dashboard) or Hospital(provider/login or register→OTP→provider/dashboard)
Patient login skips OTP, goes directly to dashboard.
