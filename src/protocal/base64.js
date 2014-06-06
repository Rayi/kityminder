KityMinder.registerProtocal("base64", function () {
    function loadImage(url, callback) {
        var image = new Image();
        image.onload = callback;
        image.src = url;
    }

    return {
        fileDescription: 'PNG 图片（暂不支持IE）',
        fileExtension: '.png',
        encode: function (json, km) {
            var domContainer = km.getPaper().container,
                svgXml,
                $svg,

                renderContainer = km.getRenderContainer(),
                renderBox = renderContainer.getRenderBox(),
                transform = renderContainer.getTransform(),
                width = renderBox.width,
                height = renderBox.height,
                padding = 20,

                canvas = document.createElement('canvas'),
                ctx = canvas.getContext('2d'),
                blob, DomURL, url, img, finishCallback;

            renderContainer.translate(-renderBox.x, -renderBox.y);

            svgXml = km.getPaper().container.innerHTML;

            renderContainer.translate(renderBox.x, renderBox.y);

            $svg = $(svgXml).filter('svg');
            $svg.attr({
                width: renderBox.width,
                height: renderBox.height,
                style: 'font-family: Arial, "Microsoft Yahei","Heiti SC";'
            });

            // need a xml with width and height
            svgXml = $('<div></div>').append($svg).html();

            // svg 含有 &nbsp; 符号导出报错 Entity 'nbsp' not defined
            svgXml = svgXml.replace(/&nbsp;/g, '&#xa0;');

            blob = new Blob([svgXml], {
                type: "image/svg+xml;charset=utf-8"
            });

            DomURL = window.URL || window.webkitURL || window;

            url = DomURL.createObjectURL(blob);

            canvas.width = width + padding * 2;
            canvas.height = height + padding * 2;


            function drawImage(ctx, image, x, y) {
                ctx.drawImage(image, x, y);
            }

            function generateDataUrl(canvas) {
                var url = canvas.toDataURL('base64');
                return url;
            }
            loadImage(url, function () {
                var svgImage = this;
                var downloadUrl;

                drawImage(ctx, svgImage, padding, padding);
                DomURL.revokeObjectURL(url);
                downloadUrl = generateDataUrl(canvas);
                if (finishCallback) {
                    finishCallback(downloadUrl, canvas.width, canvas.height);
                }
            });

            return {
                then: function (callback) {
                    finishCallback = callback;
                }
            };
        },
        recognizePriority: -1
    };
});