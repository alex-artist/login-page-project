// src/components/LoginForm.tsx (Corrected for JSX Namespace Error)
'use client';

import React, { useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// --- Corrected SVG Component Definitions (removed : JSX.Element) ---

const ArrowRightIcon = () => { // 移除了 : JSX.Element
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
    );
};

const LoadingSpinner = ({ color = "#ffffff", size = 20 }: { color?: string; size?: number }) => { // 移除了 : JSX.Element
    return (
        <svg className="animate-spin" style={{ color: color, height: size, width: size }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    );
};

const AppleLogo = () => { // 移除了 : JSX.Element
    return (
        <svg width="40" height="40" viewBox="0 0 40 49">
            {/* Apple Logo Path Data */}
            <path d="M24.23,38.82c-1.38,.05-2.83-.7-4.18-.72-1.4-.02-2.98,.74-4.31,.67-2.6-.13-5.02-1.58-6.78-3.8-3.57-4.47-1.86-11.05,2.1-14.81,1.91-1.81,4.2-2.78,6.48-2.81,1.3-.02,2.81,.76,4.12,.71,1.25-.04,2.93-.78,4.43-.76,2.25,.03,5.11,1.06,6.85,3.69-1.73,1.04-3.3,2.2-4.73,3.51-2.04,1.89-3.18,4.14-3.18,6.81,.01,2.86,1.3,5.3,3.18,6.94,.46,.41,.95,.8,1.46,1.16-1.91,2.27-4.14,3.53-6.69,3.6Z" fill="#888"></path>
            <path d="M30.55,15.39c1.69-2.05,2.67-4.32,2.81-6.69-2.48,.09-5.15,1.52-6.88,3.56-1.59,1.86-2.8,4.22-2.68,6.66,2.73,.23,5.26-1.44,6.75-3.53Z" fill="#888"></path>
        </svg>
    );
};


// --- LoginForm Component Logic ---
export default function LoginForm() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleEmailCheck = async () => {
        setError(null);
        if (!email || !/\S+@\S+\.\S+/.test(email)) { setError('请输入有效的邮箱地址'); return; }
        setIsLoading(true);
        console.log("模拟检查邮箱:", email);
        await new Promise(resolve => setTimeout(resolve, 700)); // Simulate check
        // ** Replace above simulation with actual backend API call **
        // Example:
        // try {
        //   const response = await fetch('/api/auth/check-email', { method: 'POST', body: JSON.stringify({ email }) });
        //   if (!response.ok) { const data = await response.json(); throw new Error(data.message || '邮箱验证失败'); }
        //   setStep(2); // Proceed only if backend check is ok
        // } catch (err: any) { setError(err.message); } finally { setIsLoading(false); }

        // --- Current simulation ---
        setIsLoading(false);
        setStep(2);
         // --- End simulation ---
    };

    const handleFinalSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        if (!password) { setError('请输入密码'); return; }
        if (password.length < 8) { setError('密码长度不能少于8位'); return; }
        setIsLoading(true);
        try {
            const result = await signIn('credentials', { redirect: false, email, password });
            if (result?.ok) {
                router.push('/dashboard');
            } else {
                setError(result?.error || '邮箱或密码错误，请重试。');
            }
        } catch (err: any) {
            console.error('登录时发生意外错误:', err);
            setError(err.message || '发生未知错误，请稍后重试。');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => { setEmail(e.target.value); if (error) setError(null); };
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => { setPassword(e.target.value); if (error) setError(null); };

    // --- JSX ---
    return (
        <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            {/* Logo and Title */}
            <div className="mb-8 flex flex-col items-center text-center">
                <AppleLogo />
                <h1 className="mt-5 text-2xl font-semibold text-gray-900">
                    {step === 1 ? '可更改标题' : '输入密码'}
                </h1>
                {step === 2 && ( <p className="mt-2 text-sm font-medium text-gray-700">{email}</p> )}
            </div>

            {/* Single form wrapping both steps */}
            <form onSubmit={handleFinalSubmit} className="space-y-5" noValidate>
                {/* Email Input (Always rendered, disabled in step 2) */}
                <div className="relative">
                    <input
                        id="email" name="email" type="email" required value={email} onChange={handleEmailChange}
                        className={`block w-full rounded-lg border px-4 py-3 ${step === 1 ? 'pr-12' : ''} shadow-sm placeholder-gray-400 transition-colors duration-150 focus:outline-none focus:ring-0 ${error && step === 1 ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-gray-500'} ${step === 2 ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
                        placeholder="电子邮箱或电话号码" disabled={isLoading || step === 2} aria-invalid={!!(error && step === 1)} aria-describedby="email-error-msg"
                    />
                    {/* Arrow button (Only in step 1) */}
                    {step === 1 && (
                        <button type="button" onClick={handleEmailCheck} aria-label="下一步"
                                className="absolute inset-y-0 right-0 flex items-center rounded-r-lg px-4 text-gray-500 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50"
                                disabled={isLoading || !email}>
                            {isLoading && step === 1 ? <LoadingSpinner color="#6b7280" size={18} /> : <ArrowRightIcon />}
                        </button>
                    )}
                </div>

                {/* Email error message (Only show in step 1) */}
                {error && step === 1 && ( <p id="email-error-msg" className="text-center text-sm text-red-600">{error}</p> )}

                {/* Password Input Section (Only in step 2) */}
{/* --- 密码输入区域 - 修改后带动画效果 --- */}
{step === 2 && (
                    // ↓↓↓ 添加了这个新的外层 div 来控制动画 ↓↓↓
                    <div
                        className="overflow-hidden transition-[max-height] duration-500 ease-in-out" // 控制动画的类
                        style={{ maxHeight: step === 2 ? '400px' : '0px' }} // 动态高度，展开高度可调整
                    >
                        {/* ↓↓↓ 这是你原来那段代码，现在放在里面，并加了 pt-5 ↓↓↓ */}
                        <div className="space-y-5 pt-5"> {/* 添加 pt-5 增加与上方间距 */}
                            {/* Password Input */}
                            <div className="relative">
                                <input
                                    id="password" name="password" type="password" required value={password} onChange={handlePasswordChange}
                                    className={`block w-full rounded-lg border px-4 py-3 shadow-sm placeholder-gray-400 transition-colors duration-150 focus:border-gray-400 focus:outline-none focus:ring-0 ${error && step === 2 ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-gray-500'}`}
                                    placeholder="密码" disabled={isLoading} aria-invalid={!!(error && step === 2)} aria-describedby="password-error-msg" autoFocus
                                />
                            </div>
                            {/* Password/Login error message (Only show in step 2) */}
                            {error && step === 2 && ( <p id="password-error-msg" className="text-center text-sm text-red-600">{error}</p> )}

                            {/* Final Login Button */}
                            <button type="submit"
                                    className={`relative flex w-full justify-center rounded-lg border border-transparent bg-gray-800 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-70 ${isLoading ? 'cursor-not-allowed' : ''}`}
                                    disabled={isLoading}>
                                {isLoading && step === 2 ? <LoadingSpinner /> : '登录'}
                            </button>

                            {/* Go back link */}
                            <div className='text-center text-sm'>
                                <button type="button" onClick={() => { setStep(1); setError(null); setPassword(''); setIsLoading(false); }} className="font-bold text-gray-700 hover:underline focus:outline-none">
                                    返回修改邮箱
                                </button>
                            </div>
                        </div>
                        {/* ↑↑↑ 原来的内容结束 ↑↑↑ */}
                    </div>
                     /* ↑↑↑ 新的外层 div 结束 ↑↑↑ */
                )}
                {/* --- 密码输入区域结束 --- */}
                {/* Links shown only in step 1 */}
                 {step === 1 && (
                     <div className="space-y-3 pt-2">
                        {/* Remember Me Checkbox */}
                        <div className="flex items-center justify-center">
                            <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">保持我的登录状态</label>
                        </div>
                         {/* Forgot/Create Links */}
                        <div className='text-center text-sm'>
                            <a href="#" className="font-bold text-gray-700 hover:underline">忘记了密码?</a>
                            <span className='mx-1 text-gray-300'>|</span>
                             <a href="/register" className="font-bold text-gray-700 hover:underline">创建账号</a>
                        </div>
                    </div>
                 )}
            </form>
        </div>
    );
}

// 添加一个简单的 CSS 类用于动画 (需要你在 global.css 文件中定义)
/* 在你的 global.css 或 styles.css 中添加:
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}
*/