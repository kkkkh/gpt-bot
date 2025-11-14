import "./styles/style.css"
// import styleText from "data-text:~/styles/tailwind.css"
import styleText from "data-text:~/styles/tailwind.output.css"
import debounce from "just-debounce";
import SelectionArea from "@viselect/vanilla";
import { useEffect, useRef, useState } from "react"

export const getStyle = (): HTMLStyleElement => {
  const baseFontSize = 16

  let updatedCssText = styleText.replaceAll(":root", ":host(plasmo-csui)")
  const remRegex = /([\d.]+)rem/g
  updatedCssText = updatedCssText.replace(remRegex, (match, remValue) => {
    const pixelsValue = parseFloat(remValue) * baseFontSize

    return `${pixelsValue}px`
  })

  const styleElement = document.createElement("style")

  styleElement.textContent = updatedCssText

  return styleElement
}


const CONFIG = {
  CHECKBOX_BG: "#FF3F7F",
  CONTENT_BG: "#FAA533",
  CONTENT_BORDER: "#FFC400",
  COPY_BUTTON_BG: "#FAA533",
  CLEAR_BUTTON_BG: "#EBEBEB",
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

/**
 * 扫描
 */
const scan = (main: HTMLElement) => {
  const articles = main.querySelectorAll("article")
  if (articles.length > 0) {
    for (const article of articles) {
      const markdownDiv = article.querySelector(".markdown");
      if (!markdownDiv) continue;
      const tags = ["p", "h1", "h2", "h3", "h4", "h5","pre","blockquote"];
      const liTags = ["ul", "ol"]
      Array.from(markdownDiv.children).forEach((element: Element) => {
        const tagName = element.tagName.toLowerCase()
        if (tags.includes(tagName)) {
          observeNode(element)
        }else if(liTags.includes(tagName)){
          Array.from(element.children).forEach((element: Element) => {
            observeNode(element)
          })
        }
      })
    }
  }
}

let selection = null
// let SelectionArea =  null
const SelectionAreaScan = async () => {
  // if(!SelectionArea) SelectionArea = await import("@viselect/vanilla")
  if(selection) {
    // selection.clearSelection()
    // selection.destroy()
    selection.resolveSelectables()
    return
  }
  const tags = ["h1", "h2", "h3", "h4", "h5", "p", "pre","blockquote"]
  const liTags = ["ul", "ol"]

  const selectables = tags.map(item => `body #main article .markdown > ${item}`).join(",")
  const liSelectables = liTags.map(item => `body #main article .markdown > ${item} li`).join(",")
  selection = new SelectionArea({
    selectables: [selectables,liSelectables], // Specifies the elements that can be selected
    boundaries: ['body'], // Specifies the boundaries of each selection
  }).on('start', ({ store, event }) => {
    console.log("start store stored",store.stored)
    if (!event.ctrlKey && !event.metaKey && !event.shiftKey) { // Clear selection if no modifier key is pressed
      store.stored.forEach(el => el.classList.remove('selected'));
      selection.clearSelection();
    }
  }).on('move', ({ store: { changed: { added, removed } } }) => {
    console.log("move added",added)
    console.log("move removed",removed)
    added.forEach(el => el.classList.add('selected'));
    removed.forEach(el => el.classList.remove('selected'));
  });
}

/**
 * 添加拷贝按钮
 */
const createCopyButton = () =>{
  const checkbox = document.createElement("button")
  checkbox.className = "bot_button"
  checkbox.style.color = "#FFF"
  checkbox.textContent = "copy"
  checkbox.style.background = CONFIG.COPY_BUTTON_BG // ✅ 支持颜色
  checkbox.style.cursor = "pointer"
  checkbox.style.padding ="4px 10px"
  return checkbox
}

const getCheckbox = (main)=>{
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
}
const getSelection = ()=>{
  if(!selection) return
  console.log(selection.getSelection())
  const elements = selection.getSelection().map((ele)=>elementToMarkdown(ele)).filter(Boolean)
  var promise = navigator.clipboard.writeText(elements.join('\n'))
  promise.then(()=>{
    console.log("复制成功！");
  }).catch(()=>{
    console.log("复制失败！");
  })
}
const addCopyButton = (main)=>{
  const button = createCopyButton()
  button.addEventListener("click", ()=>{
    // getCheckbox(main)
    getSelection()
  })
  return button
}


/**
 * 添加清除按钮
 */
const createClearButton = () =>{
  const checkbox = document.createElement("button")
  checkbox.className = "bot_button"
  checkbox.style.color = "#323232"
  checkbox.textContent = "clear"
  checkbox.style.background = CONFIG.CLEAR_BUTTON_BG // ✅ 支持颜色
  checkbox.style.cursor = "pointer"
  checkbox.style.padding ="4px 10px"
  checkbox.style.margin ="0px 4px"
  return checkbox
}

const clearCheckout = (main)=>{
  const checkboxes = main.querySelectorAll(".bot_checkbox")
  for (const checkbox of checkboxes) {
    checkbox.checked = false
  }
}

const clearSelection = ()=>{
  if(selection) selection.clearSelection()
}

const addClearButton = (main)=>{
  const button = createClearButton()
  button.addEventListener("click", ()=>{
    // clearCheckout(main)
    clearSelection()
  })
  return button
}


const getChildTextNode = (el:Element)=>{
  const texts = Array.from(el.childNodes)
  .filter(node => node.nodeType === Node.TEXT_NODE) // 仅保留文本节点
  .map(node => node.textContent.trim()) // 去掉首尾空白
  .filter(Boolean) // 去掉空字符串
  .join("");
  console.log(texts);
  return texts
}

const  elementToMarkdown = (element: Element) => {
  const tag = element.tagName;
  // const hasSelected = element.querySelectorAll(".selected")
  // if (hasSelected.length) return ""
  const text = element.textContent.trim() || "";
  // console.log(element)
  // const text = getChildTextNode(element)
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
      return `\`\`\`${lang}\n${code}\n\`\`\``;
    default:
      return text;
  }
}

const createOperate = (main)=>{
  const area = document.createElement("div")
  area.style.position = "absolute"
  area.style.right = "0"
  area.style.color = "#FFF"
  area.style.bottom = "0"
  area.style.transform = "translate(-200px, -200px)"
  area.style.zIndex = "100"
  const copyButton = addCopyButton(main)
  const clearButton = addClearButton(main)
  area.append(copyButton,clearButton)
  return area
}

const operate = (main:HTMLElement)=>{
  const operateArea = createOperate(main)
  main.append(operateArea)
}

// const debounceScan = debounce(scan,1000)
const debounceSelectionAreaScan = debounce(SelectionAreaScan,1000)


function start() {
  const main = document.getElementById("main")
  if (!main) return
  observerMain(main)
  // scan(main)
  operate(main)
}
const observerMain = (main: HTMLElement) => {
  const observer = new MutationObserver((mutationsList, observer) => {
    // debounceScan(main)
    for (let mutation of mutationsList) {
      if (mutation.type === "childList") {
        console.log("A child node has been added or removed.");
        debounceSelectionAreaScan()
      } else if (mutation.type === "attributes") {
        console.log("The " + mutation.attributeName + " attribute was modified.");
      }
    }
  })
  // 配置观察器
  observer.observe(main, {
    childList: true, // 监听子节点变化
    subtree: true, // 监听整个子树
    attributes: true
  })
  document.addEventListener("mousedown", e => {
    document.body.style.userSelect = "none"; // 禁止拖蓝
  });
  document.addEventListener("mouseup", () => {
    document.body.style.userSelect = ""; // 恢复
  });
}


setTimeout(() => {
  start()
}, 1500)


export default function UI() {
  const [isActive, setActive] = useState(true)
  const activeHandle = () => {
    setActive(!isActive)
  }
  return (
    <div className="fixed bottom-1/12 right-1/12 z-[9999]">
      <button
        onClick={activeHandle}
        className={`px-4 py-1 text-white rounded ${isActive ? 'bg-gray-500':'bg-cyan-500'} `}
      >
        {isActive ? '关闭' : '激活'}
      </button>
    </div>
  )
}
