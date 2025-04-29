// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt'; // 导入 bcrypt

// --- 模拟数据库用户数据 ---
const MOCK_USER_EMAIL = "test@example.com";
// 重要：把下面这行的 "你的哈希值放这里..." 替换成你刚才生成的那个哈希值！
const MOCK_USER_HASHED_PASSWORD = "$2b$10$6rlHdngGSYJMiMzhvX2STusaO2XPz26Aa9Xt8mt/aO7dtVphoSUCS"; // <-- 粘贴你生成的哈希值!

// 模拟根据邮箱查找用户的函数
async function findUserByEmail(email: string) {
  console.log(`(API模拟) 正在查找邮箱: ${email}`);
  if (email === MOCK_USER_EMAIL) {
    return {
      id: 'user-123',
      email: MOCK_USER_EMAIL,
      hashedPassword: MOCK_USER_HASHED_PASSWORD,
      name: '模拟用户'
    };
  }
  return null;
}
// --- 模拟结束 ---

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
        return NextResponse.json({ message: '邮箱和密码不能为空' }, { status: 400 });
    }

    // 1. 模拟查找用户
    const user = await findUserByEmail(email);

    if (!user) {
      // 用户不存在
      console.log(`(API) 登录失败 - 找不到用户: ${email}`);
      return NextResponse.json({ message: '邮箱或密码错误' }, { status: 401 });
    }

    // 2. 比较输入的密码和存储的哈希密码
    console.log("(API) 正在比较密码...");
    const passwordMatch = await bcrypt.compare(password, user.hashedPassword);

    if (passwordMatch) {
      // 密码匹配 - 登录成功
      console.log(`(API) 登录成功: ${email}`);
      // TODO: 将来这里处理 Session 或 Token
      return NextResponse.json({
          message: 'Login successful!',
          user: { id: user.id, email: user.email, name: user.name }
      }, { status: 200 });

    } else {
      // 密码不匹配
      console.log(`(API) 登录失败 - 密码错误: ${email}`);
      return NextResponse.json({ message: '邮箱或密码错误' }, { status: 401 });
    }

  } catch (error) {
    console.error('(API) 发生错误:', error);
    if (error instanceof SyntaxError) {
        return NextResponse.json({ message: '请求数据格式无效' }, { status: 400 });
    }
    return NextResponse.json({ message: '服务器内部错误' }, { status: 500 });
  }
}