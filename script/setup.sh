# 清理并安装项目依赖
rm -rf node_modules
# 更新安装package.json中依赖
npm install -dd --legacy-peer-deps

# 启动
npm run start

# 若是没权限执行：chmod +x script/setup.sh

# .gitignore 忽略文件配置