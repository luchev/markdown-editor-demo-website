document.getElementById( 'create-file' ).addEventListener( 'click', () => {
  iziToast.show( {
    timeout: false,
    theme: 'dark',
    closeOnEscape: true,
    overlay: true,
    displayMode: 'once',
    id: 'new-file-name',
    zindex: 999,
    message: 'File name:',
    position: 'center',
    drag: false,
    inputs: [
      ['<input type="text" class="new-file-input">', 'keyup', function ( instance, toast, input, event ) {
        if (event.keyCode === 13) {
          createFile( input.value );
          iziToast.hide({}, toast);
        }
      }, true]
    ]
  } );
} );

function createFile(fileName) {
  fetch( 'http://localhost/q/create-file/' + fileName, {
    method: 'GET'
  } ).then( ( result ) => result.json() ).then( ( data ) => {
    if (data.success) {
      addFileEntryToScreen( data.file_id, fileName );
      iziToast.success( {message: 'File created'} );
    } else {
      iziToast.error( {message: 'File creation failed'} );
    }
  } ).catch( () => {
    iziToast.success( {message: 'File creation failed'} );
  } );
}

function addFileEntryToScreen( id, name ) {
  let fileEntry = document.createElement( 'div' );

  fileEntry.className = 'file-entry';
  fileEntry.dataset.id = id;
  fileEntry.appendChild( generateFileNameElement( name ) );
  fileEntry.appendChild( generateActionsElement( id ) );

  document.getElementById( 'file-list' ).appendChild( fileEntry );
}

function generateFileNameElement( name ) {
  let nameDiv = document.createElement( 'div' );
  nameDiv.innerText = name;
  nameDiv.className = 'file-name';
  nameDiv.addEventListener( 'click', ( fileNameDiv ) => {
    if ( generateFileNameElement.oneFileLoaded === undefined) {
      generateFileNameElement.oneFileLoaded = 1;
    } else {
      saveCurrentFile();
    }
    loadFile( fileNameDiv.currentTarget.parentNode );
  } );
  return nameDiv;
}

function generateActionsElement( id ) {
  let actions = document.createElement( 'div' );
  actions.className = 'file-actions';
  actions.appendChild( generateRenameActionElement( id ) );
  actions.appendChild( generateDownloadActionElement( id ) );
  actions.appendChild( generateDeleteActionElement( id ) );
  return actions;
}

function generateRenameActionElement( id ) {
  let renameSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
    </svg>`;
  let actionDiv = document.createElement( 'div' );
  actionDiv.className = 'file-action';
  actionDiv.dataset.action = 'rename';
  actionDiv.innerHTML = renameSvg;
  actionDiv.dataset.id = id;
  actionDiv.addEventListener( 'click', ( action ) => {
    renameFileEntry( action.currentTarget.parentNode.parentNode );
  } );
  return actionDiv;
}

function generateDownloadActionElement( id ) {
  let downloadSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>`;
  let actionDiv = document.createElement( 'div' );
  actionDiv.className = 'file-action';
  actionDiv.dataset.action = 'download';
  actionDiv.innerHTML = downloadSvg;
  actionDiv.dataset.id = id;
  actionDiv.addEventListener( 'click', ( action ) => {
    downloadFileEntry( action.currentTarget.parentNode.parentNode );
  } );
  return actionDiv;
}

function generateDeleteActionElement( id ) {
  let deleteSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        <line x1="10" y1="11" x2="10" y2="17"/>
        <line x1="14" y1="11" x2="14" y2="17"/>
        </svg>`;
  let actionDiv = document.createElement( 'div' );
  actionDiv.className = 'file-action';
  actionDiv.dataset.action = 'delete';
  actionDiv.innerHTML = deleteSvg;
  actionDiv.dataset.id = id;
  actionDiv.addEventListener( 'click', ( action ) => {
    deleteFileEntry( action.currentTarget.parentNode.parentNode );
  } );
  return actionDiv;
}
