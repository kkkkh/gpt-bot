// import "./style.css"
const CONFIG = {
  CHECKBOX_BG: "#FF3F7F",
  CONTENT_BG: "#FFC400",
  CONTENT_BORDER: "#FAA533"
}

const observerMain = (main: HTMLElement) => {
  // debugger
  const observer = new MutationObserver((mutationsList, observer) => {
    console.log(mutationsList)
    // for (const mutation of mutationsList) {
    //   if (mutation.type === "childList") {
    //     // observer.disconnect(); // 找到后断开观察
    //     const articles = main.querySelectorAll("article")
    //     // if (articles.length > 0) {
    //     //   for (const article of articles) {
    //     //     article.querySelectorAll("li").forEach(li => {
    //     //       console.log(li)
    //     //       li.parentElement?.appendChild(document.createTextNode("111"))
    //     //     })
    //     //   }
    //     // }
    //   }
    // }
  })
  // 配置观察器
  observer.observe(main, {
    childList: true, // 监听子节点变化
    subtree: true // 监听整个子树
  })
}

const createCheckBox = () => {
  const checkbox = document.createElement("input")
  checkbox.type = "checkbox"
  checkbox.className = "bot_checkbox"
  checkbox.style.position = "absolute"
  checkbox.style.right = "0"
  checkbox.style.top = "0"
  checkbox.style.transform = "translateX(110%)"
  checkbox.style.zIndex = "100"
  // checkbox.style.accentColor = CONFIG.CHECKBOX_BG // ✅ 支持颜色
  checkbox.style.cursor = "pointer"
  return checkbox
}

const addCheckBox = (element: HTMLElement) => {
  const checkbox = createCheckBox()
  checkbox.addEventListener("click", function (e) {
    this.checked = !this.checked
    this.parentElement.style.backgroundColor = checkbox.checked
      ? CONFIG.CONTENT_BG
      : ""
    this.parentElement.style.border =  checkbox.checked? `1px solid ${CONFIG.CONTENT_BORDER}`:'none'
  })
  element.style.position = "relative"
  element.append(checkbox)
}

const observeNode = (element) => {
  addCheckBox(element as HTMLElement);
  element.addEventListener("click", function (e) {
    e.stopPropagation?.()
    const checkbox = this.lastChild
    if (checkbox) {
      // 切换 checkbox 的选中状态
      checkbox.checked = !checkbox.checked
      // 根据选中与否切换 element 的背景颜色
      this.style.background = checkbox.checked ? CONFIG.CONTENT_BG : ""
      this.style.border =  checkbox.checked? `1px solid ${CONFIG.CONTENT_BORDER}`:'none'
    }
  })
}

const scan = (main: HTMLElement) => {
  const articles = main.querySelectorAll("article")
  if (articles.length > 0) {
    for (const article of articles) {
      const markdownDiv = article.querySelector(".markdown");
      if (!markdownDiv) continue;
      const tags = ["P", "H1", "H2", "H3", "H4", "H5","PRE"];
      Array.from(markdownDiv.children).forEach((element: Element) => {
        if (tags.includes(element.tagName)) {
          observeNode(element)
        }else if(element.tagName === 'UL'){
          Array.from(element.children).forEach((element: Element) => {
            observeNode(element)
          })
        }
      })
    }
  }
}

const createButton = () =>{
  const checkbox = document.createElement("button")
  checkbox.className = "bot_button"
  checkbox.textContent = "copy"
  checkbox.style.position = "absolute"
  checkbox.style.right = "0"
  checkbox.style.color = "#FFF"
  checkbox.style.bottom = "0"
  checkbox.style.transform = "translate(-200px, -200px)"
  checkbox.style.zIndex = "100"
  checkbox.style.background = CONFIG.CHECKBOX_BG // ✅ 支持颜色
  checkbox.style.cursor = "pointer"
  checkbox.style.padding ="4px 10px"
  return checkbox
}

const  elementToMarkdown = (element: Element) => {
  const tag = element.tagName;
  const text = element.textContent || "";
  switch (tag) {
    case "H1":
      return `# ${text}`;
    case "H2":
      return `## ${text}`;
    case "H3":
      return `### ${text}`;
    case "H4":
      return `#### ${text}`;
    case "H5":
      return `##### ${text}`;
    case "P":
      return text;
    case "LI":
      return `- ${text}`;
    case "PRE":
      const [lang,code] = text.split("复制代码")
      return `\`\`\`${lang}\n${text}\n\`\`\``;
    default:
      return text;
  }
}

const copy = (main:HTMLElement)=>{
  const button = createButton()
  button.addEventListener("click", ()=>{
    const checkboxes = main.querySelectorAll(".bot_checkbox")
      const text = [...checkboxes].map((checkbox:HTMLInputElement)=>{
      if(!checkbox.checked) return false
      const parent = checkbox.parentElement
      // 新增方法，将 parent 的 tagName 转为对应的 Markdown 语法
      return elementToMarkdown(parent);
    }).filter((item): item is string => Boolean(item))
    var promise = navigator.clipboard.writeText(text.join('\n'))
    promise.then(()=>{
      // window.prompt("复制成功！");
    })
  })
  main.append(button)
}

function start() {
  const main = document.getElementById("main")
  if (!main) return
  scan(main)
  copy(main)
  // observerMain(main)
}

setTimeout(() => {
  start()
}, 5000)
