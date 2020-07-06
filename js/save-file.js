document.getElementById( 'save-file' ).addEventListener( 'click', () => {
    saveCurrentFile();
} );

function saveCurrentFile() {
    let id = document.getElementById( 'editor-container' ).dataset.fileId;
    if ( !id ) {
        iziToast.error( {message: 'No file selected to save'} );
        return;
    }
    fetch( 'http://localhost/q/save-file/' + id, {
        method: 'POST',
        body: editor.getContent(),
    } ).then( ( result ) => result.json() ).then( ( data ) => {
        if ( data.success ) {
            iziToast.success( {message: 'File saved'} );
        } else {
            iziToast.error( {message: 'Failed to save file'} );
        }
    } ).catch( () => {
        iziToast.error( {message: 'Failed to save file'} );
    } );
}
