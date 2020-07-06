document.getElementById( 'download-current-file' ).addEventListener( 'click', () => {
    let id = document.getElementById( 'editor-container' ).dataset.fileId;
    let fileName = document.getElementById( 'editor-container' ).dataset.fileName;
    if (!id) {
        iziToast.error( {message: 'No file loaded in the editor to download'} );
        return;
    }
    let content = editor.getContent();
    saveFileLocally(fileName, content);
} );
