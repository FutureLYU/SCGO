# SCGO

This is a react-based website for second-hand goods transactions.

## Table of Contents

- [Background](#background)
- [Install](#install)
- [Usage](#usage)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

## Background

Some students would choose to sell items in WeChat Group but people in Group may easily miss because of mass information. This website is aimed at helping students sell easily. Students can upload their items on the website and delete after transactions. For convenience, students can upload several items once and get a long picture of all items, which can be used in WeChat Group. Also, other users can search what they want on the website.

## Install

This project uses [node](http://nodejs.org) and [npm](https://npmjs.com). To install required dependencies, you need to run codes below in the folder

```sh
$ npm install
$ cd client; npm install
```

## Usage

To start app, you need to create dev.js under server/config folder and add your mongoDB connection in the file like

```js
{
module.exports = {
    mongoURI: '<your connection string>'
}
```

then your can run codes below under SCGO folder to start app

```
$ npm run dev
```

# Roadmap

- [x] **Preview** 2020-06-18
  - ~~Base demo~~
- **0.1.0** 2020-06-20
  - Add email varification
- **0.2.0** 2019-06-？
  - Improve upload page
  - Add long-picture generator

# Update

### 07-18 update (Harold)

- 添加detail page到visitor page的链接
- 修改userpage的更新方式

### 07-16 update (Harold)

- 添加对物品名字的模糊匹配
- 添加空白搜索‘返回’选择
- 添加userpage的edit和delete功能
- 修改原有history功能并添加‘下架原因‘

### 07-16 update (hanxi)

- 加入 landingPage 的 infinite-scroller 功能

### 07-13 update (hanxi)

- 修改 rightMenu 加入用户功能组
- 添加 UserPage 加入 Hover 功能
- 添加 VisitorPage 无 Hover 功能 user/:userid
- LandingPage 及 user visitor 瀑布流加入
- 待加入 “下架” “修改” 逻辑

### 07-12 update landing / upload page (Harold)

- 添加交易方式（means），交易地点（place）以及用于检索的 Tag 标签
- 统一修改为 key-value 对应的方式，state 中使用数字存储并将 key-value 对应关系存入 utils/data.js
- 使用栅格调整 landing page filter 布局；添加 card 标签；改为使用 tag 和 category 作为 filter
- 修改用户联系方式为“将自己的联系方式展示给买家”和“将买家的联系方式发送给我”
- 修改 detail page，添加联系卖家以及新的信息

### 07-06 update upload page / landing page (Harold)

- 将用于上传的 ProductEditForm 作为组件提取放置于 client/src/components/utils 文件夹下
- 利用 objectFit 解决图片拉伸问题; 添加 title 字数限制
- 添加 Category / 交易地点内容到 ProductEditForm
- 修改图片上传限制，添加 Preview state 用于图片预览
- 修改 landing page filter 并添加 search 按钮
- 添加用户联系方式

### 07-01 update (hanxi)

- utils 加入 CreateLongPicture 组件
- 生成长图组件取消外层 button 将逻辑加入 submit
- uploadPage 中加入 showPicture state 以及 handle 函数 来控制长图组件
- 增加了长图保存下载功能 命名为 SCGO_LongPicture_Date.now()
- 增加了长图跳过功能 清空 Items 状态

### 07-01 update upload page (Harold)

- 利用 sharp 库 resize 上传图片大小方便长图拼接
- 保存图片 height 用于画布设置

### 06-28 update upload page (Harold)

- 添加 add 来上传想要 upload 的物品；添加 submit 提交想要上传的物品（支持多物品一键上传）
- 以卡片形式展示想要 upload 的物品，支持 edit/delete；多图将滑动展示
- 添加 modal 和 form 来上传物品 detail，支持多图上传
- 物品 detail 暂时包括 image, title, price, description, category, place; 其中 place 为 optional, 其他 required

### 06-27 update (hanxi)

- RegisterPAge 中加入 codebox 样式响应 get -> wait 15s -> send again
- ChangePasswordPage 中加入 codebox 相同样式响应
- 在 Register 和 changepassword 中加入 报错强制刷新 增加安全性 防止验证码被暴力试错
- 统一 changepassword 中 err 格式为 err.message 与 redux 中 err.errmsg 区分
- 增加了关于验证码的 please get verification code 逻辑 用户如 submit 前未获取验证码则报错

### 06-26 update (hanxi)

- RegisterPage 整理报错信息 加入 user already exists 警告
- register api 中统一 err 格式 加入 err.errmsg
- 新增 forget password 跳转页面
- routes／users 中加入 changepassword api 逻辑
- 取消 User 中 password change 提示
- （待加入） 注册修改页面中 codebox 的响应样式

### 06-25 update (hanxi)

- dev.js 中加入邮箱及 smtp 码信息 (prod.js 中尚未加入)
- server/middleware 中加入 send.js 封装发送邮箱验证码功能
- models 中加入 Verify.js 作为新 collection 用以储存验证码发送信息
- 更改 api/users 中 register api 使其包含验证码验证过程
- 在 components/utils 中加入 codebox 组件作为复用验证框
- registerPage.js 中加入 codebox 组件和点击获取验证码逻辑（CodeGet），增加两个 state verifyCode 和 VerifyId 并将其加入 dataToSubmit 送入 register api
- 加入 api/users/sendEmail 使用 post 方法发送 email
- 依赖中加入 nodemailer （发送邮件功能）

## Contributing

## License
