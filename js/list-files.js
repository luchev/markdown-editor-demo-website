( function () {
    fetch( 'http://localhost/q/list-files', {
        method: 'GET'
    } ).then( ( result ) => result.json() ).then( ( data ) => {
        for ( let file of data.files ) {
            addFileEntryToScreen( file.id, file.name );
        }
    } ).catch( () => {
        iziToast.error( {message: 'Retrieving files failed'} );
    } );
} )();
