function downloadFileEntry( fileEntry ) {
  let fileNameDiv = fileEntry.getElementsByClassName( 'file-name' )[0];

  let fileName = fileNameDiv.innerText;
  let fileId = fileNameDiv.parentNode.dataset.id;

  downloadFile( fileId, fileName );
}

function saveFileLocally( fileName, fileContent ) {
  fileName = fileName + ".md";
  var element = document.createElement( 'a' );
  element.setAttribute( 'href', 'data:text/plain;charset=utf-8,' + encodeURIComponent( fileContent ) );
  element.setAttribute( 'download', fileName );
  element.style.display = 'none';

  document.body.appendChild( element );
  element.click();
  document.body.removeChild( element );
  iziToast.success( {message: 'File saved as ' + fileName} );
}

function downloadFile( id, name ) {
  fetch( 'http://localhost/q/load-file/' + id, {
    method: 'GET'
  } ).then( ( result ) => result.json() ).then( ( data ) => {
    saveFileLocally( name, data.content );
  } ).catch( () => {
    iziToast.success( {message: 'Download file failed'} );
  } );
}
