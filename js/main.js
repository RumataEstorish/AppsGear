/*global $, tau, tizen, Utils, Dexie, GearModel, VirtualList, LANG_JSON_DATA, PackInfo*/
/*jshint unused: false*/
/*jslint laxbreak: true*/

var currentPackage = null;
var currentListPosition = 0;
var listTop = 0;
var packagesList = [];
var progressBarWidget = null;

function onerror(err) {
	alert(LANG_JSON_DATA.LAUNCHING_APP_ERROR);
}

function toastMessage(msg) {
	$("#infoToastMsg").html(msg);
	tau.openPopup("#infoToast");
}

function showDetails(a) {
	alert($(a).find('span').html());
}

function showName(a) {
	alert(a.children[0].innerHTML);
}

function showAppId(a) {
	alert(a.children[0].innerHTML);
}

function showPackId(a) {
	alert(a.children[0].innerHTML);
}

function showDescription(a) {
	alert(a.children[0].innerHTML);
}

function launchAppClick() {
	tizen.application.launch(currentPackage.appIds[0], null, onerror);
}

function imgerror(self) {
	$(self).parent().parent().removeClass("li-has-thumb-left");
	$(self).remove();
}

function copyList(packages) {
	var d = $.Deferred();
	
	packages.forEach(function(pack) {
		packagesList.push(new PackInfo(pack));
	});

	d.resolve();

	return d.promise();
}

function onListInstalledPackages(packages) {
	var i = 0, list = $('#appsList');
	// console.log("on packlist");

	copyList(packages).then(
			function() {

				list.empty();

				
				packagesList.forEach(function(pack) {
					var item = null;
					if (pack.iconPath && pack.iconPath !== '') {
						item = $('<li class="li-has-multiline li-has-thumb-left"><label>' + pack.name + '<span class="li-text-sub ui-li-sub-text">' + pack.version
								+ '</span><img onerror="imgerror(this)" style="background-color: rgba(0,0,0,0)" width="32" height="32" class="ui-li-thumb-left" src="' + pack.iconPath + '"/></label>');
					} else {
						item = $('<li class="li-has-multiline"><label>' + pack.name + '<span class="li-text-sub ui-li-sub-text">' + pack.version + '</span></label>');
					}

					item.on('click', function() {
						appClicked(pack.id);
					});

					list.append(item);
				});

				tau.changePage("#appsListPage");
			});
}

function appClicked(id) {

	try {
		currentPackage = tizen.package.getPackageInfo(id);
		currentListPosition = id;

		$("#appId").html(currentPackage.appIds[0]);
		$("#packId").html(currentPackage.id);
		$("#appName").html(currentPackage.name);
		$("#appVersion").html(currentPackage.version);
		$("#appTotalSize").html(Utils.bytesToSize(currentPackage.totalSize));
		$("#appDataSize").html(Utils.bytesToSize(currentPackage.dataSize));
		$("#appLastModified").html(currentPackage.lastModified);
		$("#appAuthor").html(currentPackage.author);
		$("#appDesc").html(currentPackage.description);

		tau.changePage("#appDetailsPage");
	} catch (e) {
		onerror(e);
	}
}

function translateUI() {
	$("#processingPage h2").html(LANG_JSON_DATA.BUILING_LIST);
	$("#processingTextS").html(LANG_JSON_DATA.PROCESSING_TEXT);
	$("#processingTextS2").html(LANG_JSON_DATA.PROCESSING_TEXT);
	$("#appDetailsPage h2").html(LANG_JSON_DATA.DETAILS);
	$("#appName").parent().prepend(LANG_JSON_DATA.NAME);
	$("#appVersion").parent().prepend(LANG_JSON_DATA.VERSION);
	$("#appTotalSize").parent().prepend(LANG_JSON_DATA.TOTAL_SIZE);
	$("#appDataSize").parent().prepend(LANG_JSON_DATA.DATA_SIZE);
	$("#appLastModified").parent().prepend(LANG_JSON_DATA.LAST_MODIFIED);
	$("#appAuthor").parent().prepend(LANG_JSON_DATA.AUTHOR);
	$("#appDesc").parent().prepend(LANG_JSON_DATA.DESCRIPTION);
	$("#packId").parent().prepend(LANG_JSON_DATA.PACKAGE_ID);
	$("#appId").parent().prepend(LANG_JSON_DATA.APP_ID);
	$('#launchAppButton').html(LANG_JSON_DATA.LAUNCH_APP);
}

$(window).on("load", function() {

	translateUI();
	var progressBar = document.getElementById("circleprogress");

	$('#pageCircleProgressBar').on('pagebeforeshow', function() {
		if (tau.support.shape.circle) { // make Circle Progressbar object
			progressBarWidget = new tau.widget.CircleProgressBar(progressBar, {
				size : "full"
			});
		} else {
			progressBarWidget = new tau.widget.CircleProgressBar(progressBar, {
				size : "large"
			});
		}
	});

	$('#pageCircleProgressBar').on('pagehide', function() {
		try {
			progressBarWidget.destroy();
		} catch (ignored) {

		}
	});
	tau.changePage('#pageCircleProgressBar');

	if (tau.support.shape.circle) {
		tau.changePage("#processingPage");
		$("#appFooter").hide();
	} else {
		tau.changePage("#smallProcessingPage");
	}

	tizen.package.getPackagesInfo(function(packages) {
		onListInstalledPackages(packages);
	}, function(err) {
		alert(err.name);
	});

	$('#appsListPage').on('pagebeforehide', function() {
		listTop = $('#appsListPage').scrollTop();
	});

	$("#appsListPage").on("pageshow", function() {
		$("#appsListPage").scrollTop(listTop);
	});

	document.addEventListener('tizenhwkey', function(e) {
		if (e.keyName === "back") {
			switch (Utils.getActivePage()) {
			case 'appDetailsPage':
				tau.changePage("#appsListPage");
				break;
			default:
				tizen.application.getCurrentApplication().exit();
				break;
			}
		}
	});
	// Storage
	/*
	 * tizen.systeminfo.getPropertyValue("STORAGE", function(store) {
	 * $("#storeSize").html(Utils.bytesToSize(store.units[0].availableCapacity) +
	 * "/" + Utils.bytesToSize(store.units[0].capacity)); });
	 */
});