// src/components/ForgotPasswordForm.tsx (Styled Consistently)
'use client';

import React, { useState, FormEvent } from 'react';
import Link from 'next/link'; // 用于链接回登录页面

// LoadingSpinner (确保与 LoginForm 中的定义或导入一致)
const LoadingSpinner = ({ color = "#ffffff", size = 20 }: { color?: string; size?: number }) => {
    return (
        <svg className="animate-spin" style={{ color: color, height: size, width: size }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    );
};

// AppLogo (确保与 LoginForm 中的定义或导入一致)
const AppLogo = () => {
    // 你可以将这里的 div 替换为你实际的 Logo 组件或 Image 标签
    return (
        <svg width="40" height="40" viewBox="0 0 40 49">
            {/* Placeholder Logo Path Data */}
            <path d="M24.23,38.82c-1.38,.05-2.83-.7-4.18-.72-1.4-.02-2.98,.74-4.31,.67-2.6-.13-5.02-1.58-6.78-3.8-3.57-4.47-1.86-11.05,2.1-14.81,1.91-1.81,4.2-2.78,6.48-2.81,1.3-.02,2.81,.76,4.12,.71,1.25-.04,2.93-.78,4.43-.76,2.25,.03,5.11,1.06,6.85,3.69-1.73,1.04-3.3,2.2-4.73,3.51-2.04,1.89-3.18,4.14-3.18,6.81,.01,2.86,1.3,5.3,3.18,6.94,.46,.41,.95,.8,1.46,1.16-1.91,2.27-4.14,3.53-6.69,3.6Z" fill="#888"></path>
            <path d="M30.55,15.39c1.69-2.05,2.67-4.32,2.81-6.69-2.48,.09-5.15,1.52-6.88,3.56-1.59,1.86-2.8,4.22-2.68,6.66,2.73,.23,5.26-1.44,6.75-3.53Z" fill="#888"></path>
        </svg>
    );
};

export default function ForgotPasswordForm() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (!email.trim()) { setError('请输入邮箱地址'); return; }
        else if (!/\S+@\S+\.\S+/.test(email)) { setError('请输入有效的邮箱格式'); return; }

        setIsLoading(true);
        // --- 模拟后端调用 ---
        console.log('请求发送密码重置链接至:', email);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log("模拟发送成功!");
            setSuccessMessage('如果该邮箱地址在我们系统中存在，密码重置说明邮件已发送。请检查您的收件箱（包括垃圾邮件）。');
            setEmail('');
        } catch (error: any) {
            console.error('发送重置邮件失败:', error);
            setError(error.message || "发送邮件时出错，请稍后再试。");
        } finally {
            setIsLoading(false);
        }
        // --- 模拟结束 ---
    };

    return (
        // **卡片容器样式** (与 LoginForm 一致)
        <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
             {/* Logo 和标题 */}
            <div className="mb-8 flex flex-col items-center text-center">
                <AppLogo />
                <h1 className="mt-5 text-2xl font-semibold text-gray-900">忘记密码？</h1>
                <p className="mt-2 text-sm text-gray-600">
                    请输入您的邮箱地址，我们将向您发送重置密码的说明。
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Email Input */}
                 <div>
                    <label htmlFor="email-forgot" className="sr-only">邮箱地址</label>
                    <input
                        id="email-forgot" name="email" type="email" required value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(null); setSuccessMessage(null); }}
                        // **输入框样式** (与 LoginForm 一致)
                        className={`block w-full rounded-lg border px-4 py-3 shadow-sm placeholder-gray-400 transition-colors duration-150 focus:outline-none focus:ring-0 ${error ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-gray-500'}`}
                        placeholder="请输入注册邮箱" disabled={isLoading} aria-invalid={!!error} aria-describedby="forgot-error"
                    />
                </div>

                 {/* 错误或成功消息显示区域 */}
                 <div className="min-h-[20px] text-center text-sm"> {/* 使用 min-h 避免跳动 */}
                     {error && ( <p id="forgot-error" className="text-red-600">{error}</p> )}
                     {successMessage && ( <p className="text-green-600">{successMessage}</p> )}
                 </div>

                 {/* Submit Button */}
                 <button
                    type="submit"
                    // **按钮样式** (与 LoginForm 最终按钮一致)
                    className={`relative flex w-full justify-center rounded-lg border border-transparent bg-gray-800 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-70 ${isLoading ? 'cursor-not-allowed' : ''}`}
                    disabled={isLoading}
                 >
                    {isLoading ? <LoadingSpinner /> : '发送重置链接'}
                 </button>

                 {/* Link back to Login */}
                 <p className="text-center text-sm text-gray-600">
                     记起密码了？{' '}
                     {/* **链接样式** (与 RegisterForm/LoginForm 底部链接一致) */}
                     <Link href="/login" className="font-bold text-gray-700 hover:text-gray-900 focus:outline-none focus:underline">
                         返回登录
                     </Link>
                 </p>
            </form>
        </div>
    );
}