function deleteFileEntry( fileEntry ) {
  deleteFile( fileEntry );
}

function deleteFile( fileEntry ) {
  let id = fileEntry.dataset.id;
  fetch( 'http://localhost/q/delete-file/' + id, {
    method: 'GET'
  } ).then( ( result ) => result.json() ).then( () => {
    fileEntry.parentNode.removeChild(fileEntry);
    iziToast.success( {message: 'File deleted'} );
  } ).catch( () => {
    iziToast.error( {message: 'Deleting file failed'} );
  } );
}
