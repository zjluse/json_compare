# 部署指南

这个项目可以轻松部署到 Netlify 或 Vercel 等免费静态网站托管平台。

## 🚀 快速部署

### 方法一：Netlify 部署

1. **前往 [Netlify](https://netlify.com)**
2. **点击 "New site from Git"**
3. **选择你的 Git 提供商（GitHub/GitLab/Bitbucket）**
4. **选择这个仓库**
5. **配置构建设置：**
   - Build command: `npm run build`
   - Publish directory: `build`
   - Node version: `18`
6. **点击 "Deploy site"**

### 方法二：Vercel 部署

1. **前往 [Vercel](https://vercel.com)**
2. **点击 "New Project"**
3. **导入你的 Git 仓库**
4. **Vercel 会自动检测到这是一个 React 项目**
5. **点击 "Deploy"**

### 方法三：GitHub Pages 部署

1. **在 GitHub 仓库中启用 GitHub Pages**
2. **添加部署脚本到 package.json：**
   ```json
   {
     "homepage": "https://yourusername.github.io/your-repo-name",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     }
   }
   ```
3. **安装 gh-pages：**
   ```bash
   npm install --save-dev gh-pages
   ```
4. **运行部署命令：**
   ```bash
   npm run deploy
   ```

## 📁 项目结构

```
menu-diff-visualizer/
├── public/                 # 静态资源
│   ├── index.html         # HTML 模板
│   ├── sample-menu-a.json # 示例菜单 A
│   └── sample-menu-b.json # 示例菜单 B
├── src/                   # 源代码
│   ├── components/        # React 组件
│   ├── types/            # TypeScript 类型定义
│   ├── utils/            # 工具函数
│   ├── App.tsx           # 主应用组件
│   └── index.tsx         # 入口文件
├── netlify.toml          # Netlify 配置
├── vercel.json           # Vercel 配置
└── package.json          # 项目配置
```

## 🔧 环境变量

这个项目不需要任何环境变量，可以直接部署。

## 🛠 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm start

# 构建生产版本
npm run build

# 运行测试
npm test
```

## 📦 构建优化

项目已经配置了以下优化：

- **代码分割**: 使用 React.lazy 和 Suspense
- **缓存策略**: 静态资源长期缓存
- **安全头部**: 防止 XSS 和点击劫持
- **压缩**: 自动压缩 CSS 和 JavaScript
- **Tree Shaking**: 移除未使用的代码

## 🌐 自定义域名

### Netlify 自定义域名

1. 在 Netlify 控制台中选择你的站点
2. 点击 "Domain settings"
3. 点击 "Add custom domain"
4. 输入你的域名并按照指示配置 DNS

### Vercel 自定义域名

1. 在 Vercel 控制台中选择你的项目
2. 点击 "Settings" → "Domains"
3. 输入你的域名并按照指示配置 DNS

## 🔍 故障排除

### 常见问题

1. **构建失败**

   - 检查 Node.js 版本是否为 16 或更高
   - 确保所有依赖都已正确安装
   - 查看构建日志中的错误信息

2. **页面刷新后 404**

   - 确保配置了正确的重定向规则
   - 检查 netlify.toml 或 vercel.json 配置

3. **静态资源加载失败**
   - 确保 public 目录中的文件路径正确
   - 检查相对路径是否正确

## 📈 性能监控

部署后，你可以使用以下工具监控网站性能：

- **Google PageSpeed Insights**
- **GTmetrix**
- **WebPageTest**
- **Lighthouse（Chrome DevTools）**

## 🔄 自动部署

两个平台都支持自动部署：

- **推送到主分支时自动部署**
- **Pull Request 预览部署**
- **分支部署**

## 📞 获取帮助

如果遇到部署问题，可以：

1. 查看平台的官方文档
2. 检查构建日志
3. 在 GitHub Issues 中提问
