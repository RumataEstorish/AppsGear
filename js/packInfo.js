/*jshint unused: false*/

function PackInfo(pack) {
	this.appId = pack.appIds[0];
	this.name = pack.name;
	this.version = pack.version;
	//this.totalSize = pack.totalSize;
	this.iconPath = pack.iconPath;
	this.id = pack.id;
	//this.dataSize = pack.dataSize;
	this.lastModified = pack.lastModified.toLocaleString();
	this.author = pack.author;
	this.description = pack.description;
	this.isAvailable = false;
}