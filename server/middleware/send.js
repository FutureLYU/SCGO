const nodemailer = require("nodemailer"); //引入模块
const user = require("../config/key").emailuser;
const password = require("../config/key").password;

let transporter = nodemailer.createTransport({
  //node_modules/nodemailer/lib/well-known/services.json  查看相关的配置，如果使用qq邮箱，就查看qq邮箱的相关配置
  service: "Yahoo", //类型邮箱
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: user, // 发送方的邮箱
    pass: password, // smtp 的授权码
  },
});
//pass 不是邮箱账户的密码而是stmp的授权码（必须是相应邮箱的stmp授权码）
//邮箱---设置--账户--POP3/SMTP服务---开启---获取stmp授权码

function sendMail(mail, code, call) {
  // 发送的配置项
  let mailOptions = {
    from: '"SCGO Verification Code" <scgo.la@yahoo.com>', // 发送方
    to: mail, //接收者邮箱，多个邮箱用逗号间隔
    subject: "welcome to SCGO", // 标题
    text: "Your Verification Code is ", // 文本内容
    html: `<h1>${code}</h1>`, //页面内容
    // attachments: [{//发送文件
    // 		filename: 'index.html', //文件名字
    // 		path: './index.html' //文件路径
    // 	},
    // 	{
    // 		filename: 'sendEmail.js', //文件名字
    // 		content: 'sendEmail.js' //文件路径
    // 	}
    // ]
  };

  //发送函数
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      call(false);
    } else {
      call(true); //因为是异步 所有需要回调函数通知成功结果
    }
  });
}

module.exports = {
  sendMail,
};
