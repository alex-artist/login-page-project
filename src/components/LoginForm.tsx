// components/LoginForm.tsx (或者 src/components/LoginForm.tsx)
'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react'; // 保持不变
import { useRouter } from 'next/navigation'; // 保持不变

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  // --- State 改进 ---
  // 1. 添加 isLoading 状态
  const [isLoading, setIsLoading] = useState(false);
  // 2. 扩展 errors state 以包含 form 级别的错误
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});

  // --- 校验逻辑 (保持不变) ---
  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string; form?: string } = {}; // 保留 form 字段，虽然此函数不设置它
    let isValid = true;

    if (!email.trim()) {
      newErrors.email = '请输入邮箱地址';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = '请输入有效的邮箱格式';
      isValid = false;
    }

    if (!password) {
      newErrors.password = '请输入密码';
      isValid = false;
    } else if (password.length < 8) {
      newErrors.password = '密码长度不能少于8位';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // --- 表单提交处理 (核心修改) ---
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => { // 3. 添加 async
    event.preventDefault();
    // 清除之前的表单级错误，保留字段级错误（如果需要）
    setErrors(prev => ({ email: prev.email, password: prev.password }));

    if (validateForm()) {
      setIsLoading(true); // 4. 设置加载状态

      try {
        // 5. 调用 NextAuth 的 signIn 函数
        const result = await signIn('credentials', {
          // 使用 'credentials' 作为 provider ID (确保与你的 NextAuth 配置一致)
          redirect: false, // **非常重要**: 阻止 NextAuth 自动重定向，我们需要手动处理
          email: email,
          password: password,
        });

        // 6. 处理 signIn 的结果
        if (result?.ok) {
          // 登录成功
          console.log('NextAuth signIn 成功!', result);
          // ** 使用 Next.js Router 进行跳转 **
          // 可以跳转到仪表盘或其他受保护页面
          router.push('/dashboard'); // 修改为你希望跳转的目标路径
          // 或者根据 result.url 跳转 (如果 NextAuth 配置了 callbackUrl)
          // if (result.url) router.push(result.url);

        } else {
          // 登录失败
          console.error('NextAuth signIn 失败:', result?.error);
          // 在表单上显示错误信息
          // result.error 通常包含你在 NextAuth authorize 函数中抛出的错误消息
          setErrors(prev => ({ ...prev, form: result?.error || '邮箱或密码错误，请重试。' }));
        }
      } catch (error) {
        // 捕获 signIn 过程中可能发生的意外错误 (例如网络问题)
        console.error('处理登录时发生意外错误:', error);
        setErrors(prev => ({ ...prev, form: '发生未知错误，请稍后重试。' }));
      } finally {
        setIsLoading(false); // 7. 无论成功或失败，取消加载状态
      }
    } else {
      // 验证失败
      console.log('表单校验失败');
      // 字段级错误已由 validateForm 设置
    }
  };

  // --- 清除特定字段错误信息的 Handler (保持不变) ---
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errors.email || errors.form) { // 同时清除字段和表单错误
      setErrors(prevErrors => ({ ...prevErrors, email: undefined, form: undefined }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errors.password || errors.form) { // 同时清除字段和表单错误
      setErrors(prevErrors => ({ ...prevErrors, password: undefined, form: undefined }));
    }
  };

  // --- JSX (改进) ---
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5 rounded-lg bg-white p-8 shadow-xl" noValidate>
      <h2 className="text-center text-2xl font-bold text-gray-800">
        用户登录
      </h2>

      {/* Email Input Field (保持不变，除了 onChange) */}
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
          邮箱地址
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={handleEmailChange} // 使用更新后的 handler
          className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-indigo-500'}`}
          placeholder="you@example.com"
          aria-invalid={!!errors.email}
          aria-describedby="email-error"
          disabled={isLoading} // 8. 在加载时禁用输入
        />
        {errors.email && (
          <p id="email-error" className="mt-1 text-xs text-red-600">
            {errors.email}
          </p>
        )}
      </div>

      {/* Password Input Field (保持不变，除了 onChange) */}
      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
          密码 <span className="text-xs text-gray-500">(至少8位)</span>
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={handlePasswordChange} // 使用更新后的 handler
          className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-indigo-500'}`}
          placeholder="••••••••"
          aria-invalid={!!errors.password}
          aria-describedby="password-error"
          disabled={isLoading} // 8. 在加载时禁用输入
        />
        {errors.password && (
          <p id="password-error" className="mt-1 text-xs text-red-600">
            {errors.password}
          </p>
        )}
        <div className="mt-1 text-right text-sm">
            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                忘记密码?
            </a>
        </div>
      </div>

      {/* 9. 添加表单级错误显示区域 */}
      {errors.form && (
        <p id="form-error" className="text-sm text-red-600 text-center">
            {errors.form}
        </p>
       )}

      {/* Submit Button (改进) */}
      <button
        type="submit"
        className="w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-75"
        disabled={isLoading} // 10. 根据 isLoading 状态禁用按钮
      >
         {isLoading ? '登录中...' : '登录'} {/* 11. 根据 isLoading 状态改变按钮文本 */}
      </button>

       <p className="mt-4 text-center text-sm text-gray-600">
           还没有账号?{' '}
           <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
               立即注册
           </a>
       </p>
    </form>
  );
}