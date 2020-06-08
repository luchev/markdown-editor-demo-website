function renameFileEntry( fileEntry ) {
  let fileNameDiv = fileEntry.getElementsByClassName( 'file-name' )[0];

  let inputNode = generateFileNameInputElement( fileNameDiv.innerText );

  fileEntry.replaceChild( inputNode, fileNameDiv );
  inputNode.focus();
}

function generateFileNameInputElement( oldName ) {
  let inputNode = document.createElement( 'input' );
  inputNode.className = 'file-rename';
  inputNode.value = oldName;
  inputNode.dataset.oldName = oldName;

  inputNode.addEventListener( 'focusout', handleFocusOut );
  inputNode.addEventListener( 'keyup', handleKeyPress );

  return inputNode;
}

function handleKeyPress( event ) {
  let inputNode = event.target;
  if ( inputNode.parentNode ) {
    if ( event.keyCode === 13 ) { // Enter
      renameFile( inputNode );
    } else if ( event.keyCode === 27 ) { // Esc
      restoreFileName( inputNode );
    }
  }
}

function handleFocusOut( event ) {
  let inputNode = event.target;
  if ( inputNode.parentNode ) {
    renameFile( inputNode );
  }
}

function restoreFileName( inputNode ) {
  if ( inputNode.parentNode ) {
    let fileNameDiv = generateFileNameElement( inputNode.dataset.oldName );
    inputNode.removeEventListener( 'focusout', handleFocusOut );
    inputNode.parentNode.replaceChild( fileNameDiv, inputNode );
  }
}

function renameFile( inputNode ) {
  let fileId = inputNode.parentNode.dataset.id;
  let fileName = inputNode.value;
  inputNode.disabled = true;

  fetch( 'http://localhost/q/rename-file/' + fileId + '/' + fileName, {
    method: 'GET'
  } ).then( ( response ) => {
    return response.json();
  } ).then( ( data ) => {
    if ( data.success ) {
      let fileNameDiv = generateFileNameElement( fileName );
      inputNode.parentNode.replaceChild( fileNameDiv, inputNode );
      iziToast.success( {message: 'File renamed'} );
    } else {
      restoreFileName( inputNode );
      iziToast.error( {message: 'File rename failed'} );
    }
  } ).catch( () => {
    restoreFileName( inputNode );
    iziToast.error( {message: 'File rename failed'} );
  } );
}
