// src/app/register/page.tsx

import RegisterForm from '@/components/RegisterForm'; // 导入我们即将创建的注册表单组件

export default function RegisterPage() {
  return (
    // 使用与登录页类似的布局来居中表单
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-12 sm:bg-gray-50">
      <RegisterForm /> {/* 渲染注册表单组件 */}
    </div>
  );
}