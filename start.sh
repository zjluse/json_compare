#!/bin/bash

# 菜单差异可视化工具启动脚本

echo "🚀 启动菜单差异可视化工具..."

# 检查是否存在index.html
if [ ! -f "index.html" ]; then
    echo "❌ 错误：找不到index.html文件"
    exit 1
fi

# 获取当前目录的绝对路径
CURRENT_DIR=$(pwd)
HTML_FILE="file://${CURRENT_DIR}/index.html"

echo "📂 工具位置: ${CURRENT_DIR}"
echo "🌐 正在打开浏览器..."

# 根据操作系统打开浏览器
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open "$HTML_FILE"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    xdg-open "$HTML_FILE"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    # Windows
    start "$HTML_FILE"
else
    echo "⚠️  无法自动打开浏览器，请手动打开以下链接："
    echo "$HTML_FILE"
fi

echo "✅ 工具已启动！"
echo ""
echo "📖 使用说明："
echo "1. 在左右两个输入框中粘贴或上传JSON文件"
echo "2. 点击'加载示例'可以查看演示数据"
echo "3. 系统会自动计算并展示差异结果"
echo "4. 可以导出HTML、JSON、CSV格式的报告"
echo ""
echo "🔧 如有问题，请检查浏览器控制台或联系开发者" 