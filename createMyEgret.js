var fs = require('fs');
var path = require('path');

// 删除文件夹下的文件
function removeDirFiles(dir) {
  let files = fs.readdirSync(dir)
  for (var i = 0; i < files.length; i++) {
    let newPath = path.join(dir, files[i]);
    let stat = fs.statSync(newPath)
    if (stat.isDirectory()) {
      //如果是文件夹就递归下去
      removeDir(newPath);
    } else {
      console.log('删除:',newPath)
      //删除文件
      fs.unlinkSync(newPath);
    }
  }
}
// 清理
removeDirFiles('my-egret')
var fileNames = ["assetsmanager", "dragonBones", "egret"];
// 复制
for (var i = 0; i <fileNames.length; i++) {
  if (fileNames[i] !== 'egret') {
    copyFile(`build/${fileNames[i]}/`, `${fileNames[i]}.js`)
    copyFile(`build/${fileNames[i]}/`, `${fileNames[i]}.d.ts`)
  } else {
    copyFile(`build/${fileNames[i]}/`, `${fileNames[i]}.js`)
    copyFile(`build/${fileNames[i]}/`, `${fileNames[i]}.web.js`)
    copyFile(`build/${fileNames[i]}/`, `${fileNames[i]}.d.ts`)
  }
}

function copyFile(pathName, fileName) {
  var readStream, writeStream, sourceFile, destPath
  sourceFile = path.join(__dirname, pathName + fileName);
  destPath = path.join(__dirname, "my-egret", fileName);
  readStream = fs.createReadStream(sourceFile);
  writeStream = fs.createWriteStream(destPath);
  readStream.pipe(writeStream);
  console.log('复制：', fileName)
}
console.log("**********复制完成**********")
// 合并egret.js
setTimeout(() => {
  fs.readFile(`my-egret/egret.web.js`, (err, data) => {
    if (err) throw err;
    var _data = data.toString()
    var str = '//**源码修改 以下部分为egret.web.js**/'
    fs.writeFileSync('my-egret/egret.js', '\n' + str, { flag: 'a' })
    fs.writeFileSync('my-egret/egret.js', '\n' + _data, { flag: 'a' })

    console.log("**********合并egret.js完成**********")

    fs.writeFileSync("my-egret/assetsmanager.js", '\n' + `window.RES = RES`, { flag: 'a' })
    fs.writeFileSync("my-egret/dragonBones.js", '\n' + `window.dragonBones = dragonBones`, { flag: 'a' })
    fs.writeFileSync("my-egret/egret.js", '\n' + `window.egret = egret`, { flag: 'a' })

    console.log("**********添加window属性完成**********")
    fs.unlinkSync(path.join("my-egret/", 'egret.web.js'));
  });
}, 1000)


