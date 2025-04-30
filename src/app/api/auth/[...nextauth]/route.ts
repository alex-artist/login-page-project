// app/api/auth/[...nextauth]/route.ts (或 src/app/api/auth/[...nextauth]/route.ts)
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';

// --- 模拟数据库用户数据 (和之前类似) ---
const MOCK_USER_EMAIL = "test@example.com";
// 再次确认这里是你生成的哈希值
const MOCK_USER_HASHED_PASSWORD = "$2b$10$your_generated_hash_here"; // <-- 替换成你的哈希值

async function findUserByEmail(email: string) {
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

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // 这个 name 和 credentials 用于 NextAuth 自动生成的登录页面（我们不用这个）
      // 但 id 很重要，我们稍后在 signIn 函数中会用到 ('credentials')
      id: 'credentials', // 指定 Provider 的 ID
      name: 'Credentials',
      credentials: {
        // 定义期望接收的字段，这里只是定义结构，实际验证在 authorize 函数
        email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" }
      },
      // authorize 函数是核心：处理凭证验证逻辑
      async authorize(credentials, req) {
        // credentials 对象会包含前端 signIn 函数传递过来的 email 和 password
        if (!credentials?.email || !credentials?.password) {
          console.log('Authorize: Missing credentials');
          return null; // 必须提供邮箱和密码
        }

        // 1. 查找用户 (用我们之前的模拟函数)
        const user = await findUserByEmail(credentials.email);

        if (!user) {
          // 找不到用户
          console.log(`Authorize: User not found for ${credentials.email}`);
          // 不要返回具体原因给前端，抛出错误让 NextAuth 处理
          throw new Error("邮箱或密码错误");
        }

        // 2. 比较密码 (使用 bcrypt)
        const passwordMatch = await bcrypt.compare(credentials.password, user.hashedPassword);

        if (passwordMatch) {
          // 密码正确，验证成功！
          console.log(`Authorize: Login successful for ${credentials.email}`);
          // 返回用户对象（不包含密码！）
          // 这个返回的对象会被 NextAuth 用来创建 session 或 JWT
          return {
            id: user.id,
            email: user.email,
            name: user.name
            // 你可以添加其他需要的用户信息
          };
        } else {
          // 密码错误
          console.log(`Authorize: Incorrect password for ${credentials.email}`);
          throw new Error("邮箱或密码错误");
        }
      }
    })
    // 你可以添加其他 providers，比如 Google, GitHub 等
    // GoogleProvider({ clientId: process.env.GOOGLE_CLIENT_ID!, clientSecret: process.env.GOOGLE_CLIENT_SECRET! })
  ],

  // --- Session 配置 ---
  session: {
    strategy: "jwt", // 使用 JWT (JSON Web Tokens) 管理 Session，无状态，适合大多数场景
    // maxAge: 30 * 24 * 60 * 60, // Session 有效期 (可选, 默认 30 天)
  },

  // --- 页面配置 (可选但有用) ---
  pages: {
    signIn: '/login', // 指定我们自定义的登录页面路径
    // error: '/auth/error', // 可以指定一个显示错误的页面 (可选)
    // signOut: '/logout', // 可以指定登出后跳转的页面 (可选)
  },

  // --- 回调函数 (Callbacks) (可选，用于自定义行为) ---
  // callbacks: {
  //   async jwt({ token, user }) {
  //     // 如果登录成功 (user 对象存在)，把 user.id 添加到 token 中
  //     if (user) {
  //       token.id = user.id;
  //     }
  //     return token;
  //   },
  //   async session({ session, token }) {
  //     // 把 token 中的 id 添加到 session.user 中，这样前端 useSession 就能拿到 id
  //     if (token && session.user) {
  //       session.user.id = token.id as string;
  //     }
  //     return session;
  //   }
  // },

  // --- 密钥 ---
  // 非常重要！用于加密 JWT 或 Session Cookie
  // 需要一个安全的环境变量
  secret: process.env.NEXTAUTH_SECRET,

  // --- 调试 (开发时可以开启) ---
  // debug: process.env.NODE_ENV === 'development',
};

// 导出 NextAuth 处理函数
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };