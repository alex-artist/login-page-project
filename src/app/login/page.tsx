// app/login/page.tsx (或者 src/app/login/page.tsx)

// 导入我们即将创建的登录表单组件
import LoginForm from '@/components/LoginForm'; // Next.js 会自动配置 @/ 指向根目录或 src/

export default function LoginPage() {
  return (
    // 使用 flex 布局让表单在页面垂直水平居中，并设置背景色
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      {/* LoginForm 组件将是页面的主要内容 */}
      <LoginForm />
    </main>
  );
}