import { useEffect, useState } from 'react';
import { Alert, Button, Card, Input, InputOTP, Label, TextField } from '@heroui/react';
import { requestOtp, verifyOtp } from './authApi';

type Step = 'username' | 'otp';
type Message = { text: string; isError: boolean } | null;

const OTP_LENGTH = 6;
const DEFAULT_COOLDOWN = 60;

// Trang đăng nhập cho auth gate (netlify/edge-functions/auth-gate.js): username → mã OTP qua email.
const LoginPage = () => {
    const [step, setStep] = useState<Step>('username');
    const [username, setUsername] = useState('');
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState<Message>(null);
    const [isBusy, setIsBusy] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setTimeout(() => setCooldown(c => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [cooldown]);

    const handleRequestOtp = async () => {
        if (!username.trim()) {
            setMessage({ text: 'Enter your username.', isError: true });
            return;
        }
        setIsBusy(true);
        setMessage({ text: 'Sending code…', isError: false });
        try {
            const result = await requestOtp(username.trim());
            if (result.status === 429) {
                setStep('otp');
                setMessage({ text: 'A code was sent recently. Check your inbox or wait before resending.', isError: true });
                setCooldown(result.data.retryAfter ?? DEFAULT_COOLDOWN);
                return;
            }
            if (!result.data.ok) {
                setMessage({ text: "Couldn't send the code. Try again later.", isError: true });
                return;
            }
            setStep('otp');
            setOtp('');
            setMessage(null);
            setCooldown(DEFAULT_COOLDOWN);
        } catch {
            setMessage({ text: 'Network error. Try again.', isError: true });
        } finally {
            setIsBusy(false);
        }
    };

    const handleVerify = async (code: string) => {
        if (!/^\d{6}$/.test(code)) {
            setMessage({ text: 'Enter the 6-digit code.', isError: true });
            return;
        }
        setIsBusy(true);
        setMessage({ text: 'Verifying…', isError: false });
        try {
            const result = await verifyOtp(username.trim(), code);
            if (result.data.ok) {
                setMessage({ text: 'Signed in. Redirecting…', isError: false });
                window.location.replace('/');
                return;
            }
            if (result.data.error === 'expired') {
                setMessage({ text: 'This code expired or had too many wrong attempts. Request a new one.', isError: true });
            } else if (result.data.attemptsLeft) {
                setMessage({ text: `Wrong code. ${result.data.attemptsLeft} attempt(s) left.`, isError: true });
            } else {
                setMessage({ text: 'Wrong code.', isError: true });
            }
            setOtp('');
        } catch {
            setMessage({ text: 'Network error. Try again.', isError: true });
        } finally {
            setIsBusy(false);
        }
    };

    const handleChangeUsername = () => {
        setStep('username');
        setMessage(null);
    };

    return (
        <main className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-sm gap-5 p-6">
                <div className="flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-accent font-display text-base font-black text-accent-foreground">
                        CV
                    </div>
                    <div>
                        <h1 className="font-display text-xl leading-tight font-black tracking-tight">CV Builder</h1>
                        <p className="text-xs text-muted">TinTin · EdenX</p>
                    </div>
                </div>

                {step === 'username' ? (
                    <form
                        className="flex flex-col gap-4"
                        onSubmit={e => {
                            e.preventDefault();
                            handleRequestOtp();
                        }}
                    >
                        <TextField fullWidth autoFocus value={username} onChange={setUsername} isDisabled={isBusy}>
                            <Label>Username</Label>
                            <Input autoComplete="username" />
                        </TextField>
                        <Button type="submit" fullWidth isPending={isBusy}>Send code</Button>
                    </form>
                ) : (
                    <form
                        className="flex flex-col gap-4"
                        onSubmit={e => {
                            e.preventDefault();
                            handleVerify(otp);
                        }}
                    >
                        <div className="flex flex-col gap-1">
                            <Label>Verification code</Label>
                            <p className="text-sm text-muted">
                                If the username is correct, a {OTP_LENGTH}-digit code has been sent to the registered email. It expires in 5 minutes.
                            </p>
                        </div>
                        <InputOTP
                            maxLength={OTP_LENGTH}
                            value={otp}
                            onChange={setOtp}
                            onComplete={handleVerify}
                            isDisabled={isBusy}
                            autoFocus
                        >
                            <InputOTP.Group>
                                <InputOTP.Slot index={0} />
                                <InputOTP.Slot index={1} />
                                <InputOTP.Slot index={2} />
                            </InputOTP.Group>
                            <InputOTP.Separator />
                            <InputOTP.Group>
                                <InputOTP.Slot index={3} />
                                <InputOTP.Slot index={4} />
                                <InputOTP.Slot index={5} />
                            </InputOTP.Group>
                        </InputOTP>
                        <Button type="submit" fullWidth isPending={isBusy}>Verify</Button>
                        <div className="flex justify-between gap-3">
                            <Button size="sm" variant="ghost" isDisabled={isBusy || cooldown > 0} onPress={handleRequestOtp}>
                                {cooldown > 0 ? `Resend code (${cooldown}s)` : 'Resend code'}
                            </Button>
                            <Button size="sm" variant="ghost" isDisabled={isBusy} onPress={handleChangeUsername}>
                                Change username
                            </Button>
                        </div>
                    </form>
                )}

                {message && (
                    <Alert status={message.isError ? 'danger' : 'default'}>
                        <Alert.Indicator />
                        <Alert.Content>
                            <Alert.Description>{message.text}</Alert.Description>
                        </Alert.Content>
                    </Alert>
                )}
            </Card>
        </main>
    );
};

export default LoginPage;
