@echo off

call npm publish --silent
cd dist

cd es6
call npm publish --silent
cd ..

cd commonjs
call npm publish --silent
cd ..

cd amd
call npm publish --silent
cd ..

cd umd.min
call npm publish --silent
cd ..

cd system
call npm publish --silent
cd ..

cd ..
