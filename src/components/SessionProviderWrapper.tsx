//src/components/SessionProviderWrapper.tsx

'use client'; // 非常重要！声明这是一个客户端组件

import { SessionProvider } from "next-auth/react"; // 从 next-auth 导入 SessionProvider
import React from "react"; // 导入 React

// 定义这个组件接收的参数类型，它需要一个 children 属性
interface Props {
  children: React.ReactNode; // children 代表被这个组件包裹的所有内容
}

// 导出一个默认的 React 函数组件
export default function SessionProviderWrapper({ children }: Props) {
  // 这个组件的功能很简单：渲染 NextAuth 的 SessionProvider，并把接收到的 children 放在里面
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}