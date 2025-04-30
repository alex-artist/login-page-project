// src/app/forgot-password/page.tsx

import ForgotPasswordForm from '@/components/ForgotPasswordForm'; // 导入我们即将创建的忘记密码表单组件

export default function ForgotPasswordPage() {
  return (
    // 使用与登录/注册页一致的居中布局
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-12 sm:bg-gray-50">
      <ForgotPasswordForm /> {/* 渲染忘记密码表单组件 */}
    </div>
  );
}