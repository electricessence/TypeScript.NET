call npm publish
cd dist

cd es6
call npm publish
cd ..

cd commonjs
call npm publish
cd ..

cd amd
call npm publish
cd ..

cd umd.min
call npm publish
cd ..

cd system.js
call npm publish
cd ..

cd ..
