// chrome.sidePanel
// 	.setPanelBehavior({ openPanelOnActionClick: true })
// 	.catch((error) => {
// 		console.error('Error setting side panel behavior:', error);
// 	});

// function sendTabUpdateMessage(url: string) {
// 	chrome.runtime
// 		.sendMessage({
// 			type: 'TAB_UPDATED',
// 			url: url,
// 		})
// 		.catch((error) => {
// 			console.error('Error sending message from service worker:', error);
// 		});
// }

// chrome.sidePanel.onOpened.addListener(() => {
// 	console.log('here 1');
// 	chrome.tabs
// 		.query({ active: true, currentWindow: true })
// 		.then((tabs) => {
// 			const activeTab = tabs[0];
// 			if (activeTab?.url) {
// 				sendTabUpdateMessage(activeTab.url);
// 			}
// 		})
// 		.catch((error) => {
// 			console.error('Error querying active tab:', error);
// 		});
// });

// chrome.tabs.onUpdated.addListener((_tabId, changeInfo, tab) => {
// 	console.log('here 2');
// 	if (changeInfo.status !== 'complete') return;
// 	if (!tab.url) return;

// 	sendTabUpdateMessage(tab.url);
// });

// chrome.tabs.onActivated.addListener(async (activeInfo) => {
// 	console.log('here 3');

// 	const tab = await chrome.tabs.get(activeInfo.tabId);
// 	if (!tab.url) return;

// 	sendTabUpdateMessage(tab.url);
// });
