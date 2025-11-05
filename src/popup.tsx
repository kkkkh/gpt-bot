// import React from "react";

function Popup() {
  const handleExport = async () => {
    // const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    // const response = await chrome.tabs.sendMessage(tabs[0].id!, { type: "EXPORT_MARKDOWN" });

    // if (response?.markdown) {
    //   const blob = new Blob([response.markdown], { type: "text/markdown" });
    //   const url = URL.createObjectURL(blob);
    //   const a = document.createElement("a");
    //   a.href = url;
    //   a.download = `chatgpt-export-${Date.now()}.md`;
    //   a.click();
    // }
  };

  return (
    <div style={{ padding: 12, width: 220 }}>
      <h3>ChatGPT Exporter</h3>
      <button onClick={handleExport} style={{ marginTop: 10 }}>
        导出已勾选内容
      </button>
    </div>
  );
}

export default Popup;
