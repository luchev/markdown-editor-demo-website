var selectedFileEntry;

function loadFile( fileEntry ) {
  let id = fileEntry.dataset.id;

  fetch( 'http://localhost/q/load-file/' + id, {
    method: 'GET'
  } ).then( ( result ) => result.json() ).then( ( data ) => {
    if (data.success) {
      if ( selectedFileEntry ) {
        selectedFileEntry.classList.remove( 'selected' );
      }
      fileEntry.classList.add( 'selected' );
      selectedFileEntry = fileEntry;
  
      document.getElementById( 'editor-container' ).dataset.fileId = id;
      document.getElementById( 'editor' ).innerText = data.content;
      iziToast.success( {message: 'File loaded'} );
    } else {
      iziToast.error( {message: 'File load failed'} );
    }
  } ).catch( () => {
    iziToast.error( {message: 'File load failed'} );
  } );
}
