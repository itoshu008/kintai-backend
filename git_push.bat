@echo off
cd /d "E:\プログラム\kintai-backend"
git init
git remote add origin https://github.com/itoshu008/kintai-backend.git
git add .
git commit -m "Initial commit"
git branch -M main
git push -u origin main

