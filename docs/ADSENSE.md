# Google AdSense 接入 · Integration

## 简体中文

入口：**后台 → 系统设置 → Google 广告**（`#/advertising`）。项目接入的是发布商用的 AdSense，不是购买流量的 Google Ads。

### 尚无账号

保持广告关闭。项目不附带共享发布商 ID，不会为新站加载 Google 广告。站长需要自行创建 AdSense 账号、添加自己控制的站点并通过审核；不能用代码代替审核或保证获批。

### 验证与启用

1. 在 AdSense 获取 `ca-pub-` 加 16 位数字的发布商 ID，填入后台保存。
2. 保存后，公开页面包含 `google-adsense-account` meta；根目录 `/ads.txt` 自动返回 `google.com, pub-你的ID, DIRECT, f08c47fec0942fa0`。尚无 ID 时 `/ads.txt` 返回 404，不冒用示例 ID。关闭广告仍保留已配置的验证记录。
3. 在 `/privacy/` 检查内置说明；填写联系邮箱和政策补充，覆盖实际服务、站长信息、留存与权利处理。模板不是针对所有站点的完整法律文件。
4. 在 AdSense 的“隐私与消息”中配置适用地区的 Google 认证 CMP，例如 Google 提供的欧洲法规消息。本站确认框只记录站长已配置，**不会创建 CMP，也不代表访问者已同意**。
5. 通过审核、完成隐私配置后，再勾选站长确认并开启广告。
6. 自动广告在 AdSense 控制台管理。手动广告位填广告单元的 10 位 ID：支持首页底部、文章顶部、文章底部，以及页面装修组件。留空的广告位不输出。

可在装修组件库添加“Google 广告”，放入正文或左右侧栏。组件使用“装修组件广告位”，不要放在容易误点的位置。后台预览显示占位，不加载广告脚本或发送广告展示请求。

### 数据契约

`Settings.advertising` 是后台表单、设置 API、D1 设置 JSON 和公开渲染共用的单一契约：

| 字段 | 默认值 | 校验与用途 |
| --- | --- | --- |
| `enabled` | `false` | 广告脚本和手动广告位总开关 |
| `clientId` | 空字符串 | `ca-pub-` + 16 位数字或空；非密钥 |
| `slots.home/articleTop/articleBottom/sidebar` | 空字符串 | 各为10位数字或空；空表示不显示 |
| `consentReady` | `false` | 启用前必需的站长配置确认 |
| `privacyContact` | 空字符串 | 有效邮箱或空，在隐私页展示 |
| `privacyPolicy` | 空字符串 | 最大20,000字符的 Markdown 补充，经现有清洗器渲染 |

已有版本号/CSRF/管理员权限保护不变。服务端校验后才存储；并发冲突保留本地草稿，可刷新后重试。旧客户端未提交 `advertising` 时保留已保存值，不重置开关。旧库缺字段时补关闭默认值，无需新增表或运行广告迁移。

### 验证与恢复

```bash
npm run check
npm test
npm run build
npm run test:ads
```

自动测试仅验证本地代码、隔离 D1/R2、HTML 和安全策略，不请求或点击真实广告。真实投放仍需站点审核、账号配置、浏览器网络及 CMP 验收；无账号时无法验证填充率、收入或审核结果。

本次实际结果与未验证范围见 [验证记录 / Verification record](ADVERTISING-VERIFICATION.md)。

Google 脚本只在已启用的正常公开页面加载一次，搜索、错误页、隐私页、后台及预览不加载。手动广告在脚本加载成功且进入可见区域后初始化，每个单元只请求一次，未填充单元隐藏。内容安全策略仅对启用广告的公开页面开放列出的 Google 广告域名；Google 后续更换资源域名时需要实际浏览器验证，不能以 CSP 放开全网代替排查。

关闭开关后新请求不再加载脚本或广告位；验证 ID 和 ads.txt 保留。清空 ID 可移除验证记录。回滚旧代码前移除装修中的 `ad` 组件，因为旧版 schema 不识别该类型。

## English

Open **Admin → System settings → Google ads** (`#/advertising`). This integrates publisher AdSense, not advertiser Google Ads. New installations have no shared publisher ID and ads are disabled.

Enter your `ca-pub-` ID and save to generate the account verification meta tag and `/ads.txt`. Without an ID, ads.txt returns 404. Verification remains available with ads turned off. After site approval, review `/privacy/`, enter operator/contact and policy details, configure the applicable Google-certified CMP in AdSense Privacy & messaging, confirm that setup and enable ads. The checkbox does not obtain visitor consent or implement a CMP.

Control Auto ads in AdSense. Enter 10-digit ad unit IDs for manual homepage/article placements. Add the Google ads layout widget for a main-column or sidebar placement. Empty placements render no ads. Admin previews never request live ads.

All fields live under `Settings.advertising`, with disabled/empty defaults. Updates retain existing administrator/CSRF/version protection; older clients preserve advertising settings by omitting this field. No new database migration is required. Optional policy Markdown is sanitized before display.

Run the commands above. Tests use an isolated Worker with in-memory D1/R2 and never call Google advertising services. Live serving, approval, fill and revenue cannot be verified without an account. CSP permissions expand only for enabled public pages; admin, preview, privacy, search and error pages retain the original policy. Future Google resource-domain changes require real-browser validation.

Disable ads to stop future script/slot rendering. Clear the publisher ID to remove verification. Remove `ad` layout widgets before reverting to a version with the older layout schema.

## 官方参考 · Official references

- [Connect your site to AdSense](https://support.google.com/adsense/answer/7584263?hl=en)
- [Where to place ad unit code](https://support.google.com/adsense/answer/9190028?hl=en)
- [Required privacy policy content](https://support.google.com/adsense/answer/1348695?hl=en)
- [Google CMP requirements](https://support.google.com/adsense/answer/13554116?hl=en)

实现核对日期 / Reference review: 2026-10-22.
