## 功能
- v1 🎉
  - 1、对单条数据支持勾选、支持点击；✅
  - 2、支持复制已选数据；✅
  - 3、清空已选数据；✅
- v2 （开发进行中...）👏
  - 1、支持数据的动态监听 ✅（2025-11-13）；
  - 2、支持框选；
  - 3、支持查看排序；
  - 4、使用react重构dom、事件代理；
  - 5、图标激活；
  - 6、正式发布插件；
  - 7、支持导出格式：md、html等；
  - 8、以及支持发送到对应文件夹（一键生成博客）；

| 导出方式            | 技术方案                              |
| --------------- | --------------------------------- |
| 复制到剪贴板          | `navigator.clipboard.writeText()` |
| 保存为 Markdown 文件 | Blob + FileSaver.js               |
| 发送到 Obsidian    | `obsidian://new?` protocol        |
| 发送到 Notion      | Notion API (可选)                   |
| 导出 GitHub Gist  | GitHub API                        |
