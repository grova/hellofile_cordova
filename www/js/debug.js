function fail(error) 
{
    console.log(error.code);
}


function simulateFS(remoteRef) 
{
	var remoteFilePath = remoteRef.filePath;
	// nome file senza path
	var filename = remoteFilePath.substring(remoteFilePath.lastIndexOf('/')+1);

	var localPath = remoteRef.localPath;
	console.log("simulate fs");

	if (localPath == null)
	{
		console.log("nuovo file mi devo cercare il path da solo")
		// nuovo file mi devo cercare il path da solo
		localPath = "fake://";
	}

    var uri = encodeURI(remoteFilePath);
    console.log("start download of " + remoteFilePath);
    console.log("to " + localPath + filename);	

    //console.log("download complete: " + theFile.fullPath);
    remoteRef.localPath = localPath + filename;
    // download completato devo aggiornare il db locale

    if (remoteRef.localIndex == -1)
    {
    	// nuovo record
    	if (app.localdb == null)
    	{
    		app.localdb = new Array();
    	}
    	app.localdb.push(remoteRef);

    }
    else
    {
    	app.localdb[remoteRef.localIndex] = remoteRef;
    }
    app.saveLocalDb();
}


function downloadFileChrome(remoteRef)
{
	var remoteFilePath = remoteRef.filePath;
	// nome file senza path
	var filename = remoteFilePath.substring(remoteFilePath.lastIndexOf('/')+1);

	window.webkitRequestFileSystem(window.PERSISTENT, 0, 
		function onFileSystemSuccess(fileSystem) 
		{
			var localPath = remoteRef.localPath;
			console.log("GOT fs");

			

			if (localPath == null)
			{
				// nuovo file mi devo cercare il path da solo
				fileSystem.root.getFile(
					"dummy.html", {create: true, exclusive: false}, 
					function gotFileEntry(fileEntry) 
					{
			    		localPath = fileEntry.fullPath.replace("dummy.html","");
			    		fileEntry.remove();
					},
					fail);
			}

		    //var uri = encodeURI("http://www.storci.com/pdf/products/vsfTVmix.pdf");
		    var uri = encodeURI(remoteFilePath);
		    console.log("start download");	
		    var fileTransfer = new FileTransfer();
		    fileTransfer.download(
				uri,
				localPath + filename,
				function(theFile) {
				    console.log("download complete: " + theFile.fullPath);
				    // download completato devo aggiornare il db locale



				},
				function(error) {
				    console.log("download error source " + error.source);
				    console.log("download error target " + error.target);
				    console.log("upload error code: " + error.code);
					}
			);
		}, 
		simulateFS(remoteRef)
		);
} 


function fileSystemTest()
{
	window.resolveLocalFileSystemURI("file:///example.txt",
		function onSuccess(fileEntry)
		{
			console.log(fileEntry.name);
		},
		function fail(error)
		{
			console.log(error.code);
		});
}



function pgDownload()
{
	var filePath = "file:///mnt/sdcard/theFile.pdf";
	var fileTransfer = new FileTransfer();
	console.log("filetransfer "+fileTransfer);
	var uri = encodeURI("http://www.storci.com/pdf/products/vsfTVmix.pdf");

	fileTransfer.download(
	    uri,
	    filePath,
	    function(entry) {
		console.log("download complete: " + entry.fullPath);
	    },
	    function(error) {
		console.log("download error source " + error.source);
		console.log("download error target " + error.target);
		console.log("upload error code" + error.code);
	    },
	    true
	);
} 

