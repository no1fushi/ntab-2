function onCreated() {
  if (chrome.runtime.lastError) {
    console.log(`Error: ${chrome.runtime.lastError}`);
  } else {
    console.log("Item created successfully");
  }
}

chrome.contextMenus.create({
  id: "getTabList",
  title: "GetTabList",
  contexts: ["all"]
}, onCreated);

chrome.contextMenus.create({
  id: "getTabList2",
  title: "GetTabList2",
  contexts: ["all"]
}, onCreated);

chrome.contextMenus.create({
  id: "separator",
  type: "separator",
  contexts: ["all"]
}, onCreated);

chrome.contextMenus.onClicked.addListener((info, tab) => {
});
