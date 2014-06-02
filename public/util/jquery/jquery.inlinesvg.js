//
// Replace all SVG images with inline SVG
//
(function ($, undefined) {
    $.fn.inlinesvg = function () {
        var $img = this,
            imgClass = $img.attr('class'),
            imgURL = $img.attr('src');
        $.get(imgURL, function (data) {
            var $svg = $(data).find('svg');
            if (typeof imgClass !== 'undefined') {
                $svg = $svg.attr('class', imgClass + ' replaced-svg');
            }
            // Remove any invalid XML tags as per http://validator.w3.org
            $svg = $svg.removeAttr('xmlns:a');
            // Replace image with new SVG
            $img.replaceWith($svg);
        }, 'xml');
        return $img;
    };
})(jQuery);
