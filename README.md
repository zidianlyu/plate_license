# Git Commit

## Start Git

```
git init
```

## 添加remote点

一般我们都将remote点命名成origin

```
git remote add origin <自己的repo地址, https的那个>
```

如果需要移除remote点，或者遇到not file directory的情况，我们就最好remove了remote点
再重新加上

```
git remote remove origin
```

## 添加commit

```
git add -A
git commit -m "commit 信息"
```

## push到repo

```
git push origin master
```

# 管理NPM

## 创建package.json

```
npm init
```

# 配置testing

## 安装jasmine

```
npm install -D jasmine
```

## 初始化jasmine

```
npx jasmine init
```

## 更新package.json

```json
{
  ...
  "scripts": {
    "test": "jasmine"
  },
}
```

## 运行测试

```
npm test
```


## 讲所有测试放到一个test文件夹下面

```
jasmine-node test
```

会运行所有在test文件夹下面的测试

## 将每一个测试的细节都打印出来

```
jasmine-node test --verbose
```

## 将所有的test coverage打印出来

```
nyc jasmine-node test --verbose
```
