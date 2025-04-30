// src/components/RegisterForm.tsx (Ensuring Style Consistency)
'use client';

import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// LoadingSpinner (保持和 LoginForm 一致)
const LoadingSpinner = ({ color = "#ffffff", size = 20 }: { color?: string; size?: number }) => (
    <svg className="animate-spin" style={{ color: color, height: size, width: size }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

// AppLogo (保持和 LoginForm 一致, 或替换为你自己的)
const AppLogo = () => (
    <svg width="40" height="40" viewBox="0 0 40 49">
        {/* Placeholder Logo Path Data */}
        <path d="M24.23,38.82c-1.38,.05-2.83-.7-4.18-.72-1.4-.02-2.98,.74-4.31,.67-2.6-.13-5.02-1.58-6.78-3.8-3.57-4.47-1.86-11.05,2.1-14.81,1.91-1.81,4.2-2.78,6.48-2.81,1.3-.02,2.81,.76,4.12,.71,1.25-.04,2.93-.78,4.43-.76,2.25,.03,5.11,1.06,6.85,3.69-1.73,1.04-3.3,2.2-4.73,3.51-2.04,1.89-3.18,4.14-3.18,6.81,.01,2.86,1.3,5.3,3.18,6.94,.46,.41,.95,.8,1.46,1.16-1.91,2.27-4.14,3.53-6.69,3.6Z" fill="#888"></path>
        <path d="M30.55,15.39c1.69-2.05,2.67-4.32,2.81-6.69-2.48,.09-5.15,1.52-6.88,3.56-1.59,1.86-2.8,4.22-2.68,6.66,2.73,.23,5.26-1.44,6.75-3.53Z" fill="#888"></path>
    </svg>
);

export default function RegisterForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string; form?: string }>({});

    const validateForm = (): boolean => {
        const newErrors: typeof errors = {};
        let isValid = true;
        if (!name.trim()) { newErrors.name = '请输入姓名'; isValid = false; }
        if (!email.trim()) { newErrors.email = '请输入邮箱地址'; isValid = false; }
        else if (!/\S+@\S+\.\S+/.test(email)) { newErrors.email = '请输入有效的邮箱格式'; isValid = false; }
        if (!password) { newErrors.password = '请输入密码'; isValid = false; }
        else if (password.length < 8) { newErrors.password = '密码长度不能少于8位'; isValid = false; }
        if (!confirmPassword) { newErrors.confirmPassword = '请再次输入密码'; isValid = false; }
        else if (password && password !== confirmPassword) { newErrors.confirmPassword = '两次输入的密码不一致'; isValid = false; }
        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrors(prev => ({ ...prev, form: undefined })); // 只清除表单级错误

        if (validateForm()) {
            setIsLoading(true);
            console.log('注册信息校验通过，准备提交:', { name, email });
            try {
                // --- 模拟后端注册 API 调用 ---
                await new Promise(resolve => setTimeout(resolve, 1500));
                console.log("模拟注册成功！");
                alert("注册成功！将跳转到登录页面。");
                router.push('/login');
                 // --- 模拟结束 ---
            } catch (error: any) {
                 console.error('注册失败:', error);
                 setErrors({ form: error.message || "注册过程中发生错误，请稍后再试。" });
            } finally {
                 setIsLoading(false);
            }
        } else {
            console.log('注册表单校验失败');
        }
    };

    // 优化错误清除逻辑: 清除对应字段和 form 错误
    const clearErrorOnChange = (fieldName: keyof typeof errors) => {
      if (errors[fieldName] || errors.form) {
        setErrors(prev => ({ ...prev, [fieldName]: undefined, form: undefined }));
      }
    };

    // --- JSX Structure with Consistent Styling ---
    return (
        // 1. 卡片容器样式: 与 LoginForm 保持一致 (max-w-sm, rounded-2xl, border, bg-white, p-8, shadow-sm)
        <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            {/* Logo 和标题 */}
            <div className="mb-8 flex flex-col items-center text-center">
                <AppLogo />
                <h1 className="mt-5 text-2xl font-semibold text-gray-900">创建账户</h1>
                <p className="mt-2 text-sm text-gray-600">欢迎加入我们！</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate> {/* 调整 space-y-4 以容纳更多字段 */}
                 {/* Name Input */}
                 <div>
                    <label htmlFor="name" className="sr-only">姓名</label>
                    <input
                        id="name" name="name" type="text" required value={name}
                        onChange={(e) => { setName(e.target.value); clearErrorOnChange('name'); }}
                        // 2. 输入框样式: 与 LoginForm 保持一致
                        className={`block w-full rounded-lg border px-4 py-3 shadow-sm placeholder-gray-400 transition-colors duration-150 focus:outline-none focus:ring-0 ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-gray-500'}`}
                        placeholder="姓名" disabled={isLoading} aria-invalid={!!errors.name} aria-describedby="name-error"
                    />
                    {errors.name && <p id="name-error" className="mt-1.5 text-xs text-red-600">{errors.name}</p>} {/* 调整 mt */}
                </div>

                 {/* Email Input */}
                 <div>
                    <label htmlFor="email-register" className="sr-only">邮箱地址</label>
                    <input
                        id="email-register" name="email" type="email" required value={email}
                        onChange={(e) => { setEmail(e.target.value); clearErrorOnChange('email'); }}
                        className={`block w-full rounded-lg border px-4 py-3 shadow-sm placeholder-gray-400 transition-colors duration-150 focus:outline-none focus:ring-0 ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-gray-500'}`}
                        placeholder="邮箱地址" disabled={isLoading} aria-invalid={!!errors.email} aria-describedby="email-error"
                    />
                    {errors.email && <p id="email-error" className="mt-1.5 text-xs text-red-600">{errors.email}</p>}
                 </div>

                 {/* Password Input */}
                 <div>
                     <label htmlFor="password-register" className="sr-only">密码</label>
                     <input
                         id="password-register" name="password" type="password" required value={password}
                         onChange={(e) => { setPassword(e.target.value); clearErrorOnChange('password'); }}
                         className={`block w-full rounded-lg border px-4 py-3 shadow-sm placeholder-gray-400 transition-colors duration-150 focus:outline-none focus:ring-0 ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-gray-500'}`}
                         placeholder="密码 (至少8位)" disabled={isLoading} aria-invalid={!!errors.password} aria-describedby="password-error"
                     />
                     {errors.password && <p id="password-error" className="mt-1.5 text-xs text-red-600">{errors.password}</p>}
                 </div>

                 {/* Confirm Password Input */}
                 <div>
                     <label htmlFor="confirmPassword" className="sr-only">确认密码</label>
                     <input
                         id="confirmPassword" name="confirmPassword" type="password" required value={confirmPassword}
                         onChange={(e) => { setConfirmPassword(e.target.value); clearErrorOnChange('confirmPassword'); }}
                         className={`block w-full rounded-lg border px-4 py-3 shadow-sm placeholder-gray-400 transition-colors duration-150 focus:outline-none focus:ring-0 ${errors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-gray-500'}`}
                         placeholder="确认密码" disabled={isLoading} aria-invalid={!!errors.confirmPassword} aria-describedby="confirmPassword-error"
                     />
                     {errors.confirmPassword && <p id="confirmPassword-error" className="mt-1.5 text-xs text-red-600">{errors.confirmPassword}</p>}
                 </div>

                 {/* 表单级错误显示 */}
                 {errors.form && (
                    <p className="text-center text-sm text-red-600">{errors.form}</p>
                 )}

                 {/* 3. Submit Button 样式: 与 LoginForm 最终登录按钮保持一致 (bg-gray-800) */}
                 <button
                    type="submit"
                    className={`relative flex w-full justify-center rounded-lg border border-transparent bg-gray-800 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-70 ${isLoading ? 'cursor-not-allowed' : ''}`}
                    disabled={isLoading}
                 >
                    {isLoading ? <LoadingSpinner /> : '创建账户'}
                 </button>

                 {/* 4. Link back to Login 样式: 与 LoginForm 底部链接保持一致 (font-bold text-gray-700) */}
                 <p className="text-center text-sm text-gray-600">
                     已有账户？{' '}
                     <Link href="/login" className="font-bold text-gray-700 hover:text-gray-900 focus:outline-none focus:underline">
                         前往登录
                     </Link>
                 </p>
            </form>
        </div>
    );
}