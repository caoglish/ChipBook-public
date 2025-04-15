

@echo off
chcp 65001
setlocal

echo deploy to tecent-shanghai
echo 🛠 正在构建 Vite 项目...
rem call npm install
rem call npm run build

set REMOTE=ubuntu@tencent-shanghai
set TMP_DIR=~/tmp_chipbook
set FINAL_DIR=/opt/1panel/apps/openresty/openresty/www/ChipBook

echo 🧹 清理远程临时目录...
ssh %REMOTE% "rm -rf %TMP_DIR% && mkdir -p %TMP_DIR"

echo 🚀 上传到用户目录...
scp -r dist\* %REMOTE%:%TMP_DIR%/

echo 🔄 使用 sudo 移动到 OpenResty 站点目录...
ssh %REMOTE% "sudo rm -rf %FINAL_DIR% && sudo mkdir -p %FINAL_DIR% && sudo cp -r %TMP_DIR%/* %FINAL_DIR% && sudo chown -R www-data:www-data %FINAL_DIR%"

echo ✅ 部署完成！
pause


