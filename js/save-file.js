document.getElementById( 'save-file' ).addEventListener( 'click', () => {
    let id = document.getElementById( 'editor-container' ).dataset.fileId;
    fetch( 'http://localhost/q/save-file/' + id, {
        method: 'POST',
        body: document.getElementById( 'editor-container' ).innerText
    } ).then( ( result ) => result.json() ).then( ( data ) => {
        if ( data.success ) {
            iziToast.success( {message: 'File saved'} );
        } else {
            iziToast.error( {message: 'Failed to save file'} );
        }
    } ).catch( () => {
        iziToast.error( {message: 'Failed to save file'} );
    } );
} );
