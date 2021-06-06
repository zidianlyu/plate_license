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
