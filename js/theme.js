function changeTheme(theme) {
    let cssLinks = document.getElementsByTagName('link');
    let oldCssLink = null;
    for (let i = 0; i < cssLinks.length; i++) {
        if (cssLinks[i].href.includes('/css/themes/')) {
            oldCssLink = cssLinks[i];
        }

    }

    let newCssLink = document.createElement('link');
    newCssLink.setAttribute('href', '/css/themes/' + theme + '.css');
    newCssLink.setAttribute('rel', 'stylesheet');
    newCssLink.setAttribute('type', 'text/css');

    document.getElementsByTagName('head')[0].replaceChild(newCssLink, oldCssLink);
}
