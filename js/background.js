// Function definition
const onCreated = () => {
  if(chrome.runtime.lastError) {
    console.log(`Error: ${chrome.runtime.lastError}`);
  } else {
    console.log("Item created successfully");
  }
}

const outputTabs = tabs => {
	console.groupCollapsed("URLs")
	for(let tab of tabs) console.log(tab.url);
	console.groupEnd();
}

const countNewtab = tabs => {

	let newtab = new Array();
	let count = 0;

	const firefox = 'about:newtab'

	for(let tab of tabs) {
		if(tab.url.indexOf(firefox) === 0) newtab.push(count);
    	count += 1;
	}

	console.log("↓ newtab[]");
	console.log(newtab);
	return newtab;
}

const logTabs = tabs => {
	outputTabs(tabs);
	const newtab = countNewtab(tabs);
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
