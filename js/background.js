// Function definition
const onCreated = () => {
  if(chrome.runtime.lastError) {
    console.log(`Error: ${chrome.runtime.lastError}`);
  } else {
    console.log("Item created successfully");
  }
}

const logTabs = tabs => {
  for(let tab of tabs) console.log(tab.url);
}

const getTabs = () => {
  chrome.tabs.query({currentWindow: true}, (tabs) => {
    logTabs(tabs);
  });
}

// Create contextmenus
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


// Event listener
chrome.contextMenus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
    case "getTabList":
      getTabs();
      break;
    case "getTabList2":
      getTabs();
      break;
  }
});
