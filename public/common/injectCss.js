powerdialerApp.factory("injectCSS", ['$q', function ($q) {
    let injectCSS = {};

    let createLink = function (id, url) {
        let link = document.createElement('link');
        link.id = id;
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = url;
        return link;
    };

    let checkLoaded = function (url, deferred, tries) {
        for (let i in document.styleSheets) {
            let href = document.styleSheets[i].href || "";
            if (href.split("/").slice(-1).join() === url.split("/").slice(-1).join()) {
                deferred.resolve();
                return;
            }
        }
        tries++;
        setTimeout(function () {
            checkLoaded(url, deferred, tries);
        }, 50);
    };

    injectCSS.set = function (id, url) {
        let tries = 0,
            deferred = $q.defer(),
            link;
        url = '/public/assets/css/themes/' + url;


        let oldLink = angular.element('link#' + id),
            skip = oldLink.attr('href') === url;

        if (!skip) {
            oldLink.remove();
            link = createLink(id, url);
            link.onload = deferred.resolve;
            angular.element('head').append(link);
        }

        checkLoaded(url, deferred, tries);

        return deferred.promise;
    };

    return injectCSS;
}]);