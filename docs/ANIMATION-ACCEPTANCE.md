# 头尾动画增强验收

2026-10-19。本地 `http://127.0.0.1:4321/`，未部署。

## 改动与影响面

- `BrandBackdrop.astro` 统一承载极光、双轨道光点、星空与流星，头尾通过 variant 复用。星点半径由0.3–1.1px变为0.5–1.6px；旧流星11秒一轮，现为三条错峰轨迹，拖尾最高150px，单次1.6秒。
- `brand-motion.css`：头部9/12秒极光流动；轨道11/16秒移动；页脚8/11秒极光、6秒地平线光晕，增加背景层次与文字对比。
- `SiteHeader.astro` 删除旧的重复装饰层；`site.css` 删除失效的 header-motion、brand-glow、brand-stars、footer-shimmer 样式；`SiteLayout.astro` 在基础样式后统一导入新动效样式。
- 消费链：首页/分类/文章/搜索等 → SiteLayout → SiteHeader/SiteFooter → BrandBackdrop。文章实时预览也复用布局；其iframe仍禁止脚本，展示静态背景。
- 本轮没有更改接口、权限、存储、设置数据、依赖或Cloudflare配置。无Git仓库，以文件读取和引用搜索核查影响面，不宣称有Git差异基线。

## 验证

| 项目 | 结果与证据 |
| --- | --- |
| 静态检查 | `npm run check`，56文件，0错误/警告/提示 |
| 单元回归 | `npm test`，2文件、59/59通过；辅助规则回归，不作为动画可见性的依据 |
| 最终构建 | `npm run build`，09:56完成；仍有原有Arco共享chunk超过500KB提示 |
| 桌面 | Chrome，1707×850；头/尾各两张连续截图不同；装饰背景可见，横向溢出0 |
| 窄屏 | Chrome视口390×844；头尾背景可见，导航展开成功，横向溢出0；临时视口已reset，临时tab已关闭 |
| 导航与搜索 | 页头银行账户点击到分类，h1正确，两处共用背景存在；返回首页搜索弹层可见 |
| 离屏暂停 | 首页顶部：头部运行、页脚暂停；滚动到底部：头部暂停、页脚运行 |
| 控制台 | 当次最终首页Chrome error日志为空 |
| 减少动态效果 | CSS关闭装饰动画，canvas静态绘制并停止RAF；仅代码核查，未切换系统偏好实测 |

截图在 `test-results/header-motion.png`、`footer-motion.png`、`header-motion-mobile.png`、`footer-motion-mobile.png`。均为本轮真实浏览器截图。最终零尺寸保护不改变画面，最终构建后已重新加载并截图页脚。

工具：Browser Automation技能下使用浏览器连接器进行本地交互；公开页面无需登录，不写测试业务数据，无网络mock。按低风险装饰动效选择截图、真实浏览器交互、生命周期状态、静态检查和构建。未运行写D1/R2的全量集成测试，因为本轮未变更数据/接口；未新增镜像实现的样式单测。证据为本地A级浏览器验收与B级静态检查，不能代表CI/生产/真实手机硬件。

## 最终审计

结论：本地功能有非阻断风险。装饰层 aria-hidden 且不接收指针，正文/导航在其上层；Canvas约30fps、DPR最多1.5、星点最多100个，零尺寸跳过；离屏/隐藏暂停、恢复重新排程，页面销毁释放observer与监听，保留bfcache恢复分支。无请求、外部输入或持久化副作用。已全搜新旧动画名、BrandBackdrop、SiteLayout及预览消费方；旧动画只在历史文档留下说明。

仍未验证：系统减少动态效果的真实切换、跨浏览器、真实手机硬件、性能压测与生产部署。像素级原站一致性仍不作为本轮验收结论。

技能must：JavaScript/TypeScript、花叔Design（动效视觉）、Browser Automation、test-engineering、code-audit；部署conditional未执行。需要回退时恢复上述组件与样式，不涉及数据库恢复。
