// components/LoginForm.tsx (或者 src/components/LoginForm.tsx)
'use client'; // 标记为客户端组件，因为需要用到 state 和事件处理

import React, { useState } from 'react';

export default function LoginForm() {
  // State for input fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // State for holding validation errors (using an object for better organization)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  // --- 校验逻辑 ---
  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};
    let isValid = true;

    // Email validation
    if (!email.trim()) {
      newErrors.email = '请输入邮箱地址';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) { // Simple regex for email format
      newErrors.email = '请输入有效的邮箱格式';
      isValid = false;
    }

    // Password validation
    if (!password) { // Check if password is empty (trim not needed usually for password)
      newErrors.password = '请输入密码';
      isValid = false;
    } else if (password.length < 8) { // Example: Check minimum length
      newErrors.password = '密码长度不能少于8位';
      isValid = false;
    }
    // Add more password complexity rules here if needed

    setErrors(newErrors); // Update the errors state
    return isValid;
  };

  // --- 表单提交处理 ---
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission (page reload)

    // Run validation logic
    if (validateForm()) {
      // If validation passes
      console.log('校验通过，登录信息:', { email, password });
      alert('模拟登录成功！(信息已打印到控制台)');

      // --- TODO: 后续步骤 ---
      // 1. 设置加载状态 (例如，禁用按钮，显示 spinner)
      // 2. 使用 fetch 或 axios 将 email 和 password 发送到后端 API (例如 /api/auth/login)
      // 3. 处理 API 的响应 (成功则跳转或更新状态，失败则在界面显示错误信息 setErrors({ form: '...' }))
      // -----------------------

    } else {
      // If validation fails
      console.log('表单校验失败');
      // Errors are already set by validateForm() and will be displayed
    }
  };

  // --- 清除特定字段的错误信息（当用户开始输入时） ---
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // If there was an email error, clear it when user starts typing
    if (errors.email) {
      setErrors(prevErrors => ({ ...prevErrors, email: undefined }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    // If there was a password error, clear it when user starts typing
    if (errors.password) {
      setErrors(prevErrors => ({ ...prevErrors, password: undefined }));
    }
  };


  // --- JSX: 表单的结构和样式 ---
  return (
    // 使用 Tailwind 添加卡片样式：内边距、背景色、圆角、阴影、最大宽度
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5 rounded-lg bg-white p-8 shadow-xl" noValidate>
      <h2 className="text-center text-2xl font-bold text-gray-800">
        用户登录
      </h2>

      {/* Email Input Field */}
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
          onChange={handleEmailChange} // Use specific handler
          // 根据是否有错误动态添加边框样式
          className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-indigo-500'}`}
          placeholder="you@example.com"
          aria-invalid={!!errors.email} // Accessibility: mark field as invalid if error exists
          aria-describedby="email-error" // Accessibility: link input to its error message
        />
        {/* Conditional rendering for email error message */}
        {errors.email && (
          <p id="email-error" className="mt-1 text-xs text-red-600">
            {errors.email}
          </p>
        )}
      </div>

      {/* Password Input Field */}
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
          onChange={handlePasswordChange} // Use specific handler
          className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-indigo-500'}`}
          placeholder="••••••••"
          aria-invalid={!!errors.password}
          aria-describedby="password-error"
        />
        {/* Conditional rendering for password error message */}
        {errors.password && (
          <p id="password-error" className="mt-1 text-xs text-red-600">
            {errors.password}
          </p>
        )}
        {/* Optional: Add 'Forgot Password?' link here */}
        <div className="mt-1 text-right text-sm">
            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                忘记密码?
            </a>
        </div>
      </div>

      {/* Optional: Add 'Remember Me' checkbox */}
       {/* <div className="flex items-center">
         <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
         <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">记住我</label>
       </div> */}

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-75"
        // You can add a loading state later: disabled={isLoading}
      >
         {/* {isLoading ? '登录中...' : '登录'} */}
         登录
      </button>

      {/* Optional: Add link to Registration page */}
       <p className="mt-4 text-center text-sm text-gray-600">
           还没有账号?{' '}
           <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
               立即注册
           </a>
       </p>
    </form>
  );
}