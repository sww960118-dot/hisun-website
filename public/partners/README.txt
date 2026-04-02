合作伙伴 Logo
=============

网站请求路径：/partners/bank/*.jpg 等（见 src/cms/partnersCatalog.js 文件名清单）。

一键同步（在项目根目录执行）：

  npm run sync-partners

默认从 D:\桌面\hisun_website\合作伙伴\ 复制；也可指定路径：

  npm run sync-partners -- "D:\你的路径\合作伙伴"

映射关系：
  银行     → public/partners/bank
  保险     → public/partners/insurance
  非银金融 → public/partners/nonbank
  其他     → public/partners/other

若未执行同步，public/partners 下没有图片文件，页面上会显示裂图。
