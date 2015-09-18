/** Copyright Philipp Zedler. MIT License **/
(function ($) {
    
    var InfiniteBox = function ($element, options) {
            this.$container = $element;
            this.settings = $.extend(
                {},
                $.fn.infinitescroll.defaults,
                options
            );
            this.bind_events();
        };
        
    
    $.fn.infinitescroll = function (options) {
        return $(this).each(function () {
            new InfiniteBox($(this), options);
        });
    };
    
    $.fn.infinitescroll.defaults = {
        bufferPx: 40,
        itemSelector: '.post',
        nextSelector: '.next',
    };
    
    InfiniteBox.prototype = {
        bind_events: function () {
            this.bind_click_event();
            this.bind_scroll_event();
        },
        bind_scroll_event: function () {
            var instance = this;
            $(window).scroll(function () {
                instance.scroll();
            });
        },
        bind_click_event: function() {
            var infinite_box = this;
            this.$container.on(
                'click',
                this.settings.nextSelector,
                function (event) {
                    var href = infinite_box.get_href($(this));
                    infinite_box.fetch_items(href);
                    event.preventDefault();
                }
            );
        },
        fetch_items: function (href) {
            var infinite_box = this;
            var $next_button = this.get_next_button();
            $next_button.animate({opacity: 0});
            $.ajax({
                url: href,
                complete: function (data, textStatus, jqXHR) {
                    var $items = $(data.responseText).find(infinite_box.settings.itemSelector);
                    $items.hide();
                    $next_button.remove();
                    infinite_box.$container.append($items);
                    $items.fadeIn();
                },
                dataType: 'html',
            });
        },
        get_href: function ($element) {
            var href = $element.attr('href');
            if (href.slice(0, 1) === '?') {
                href = this.get_path() + href;
            }
            return href;
        },
        get_path: function () {
            return location.protocol + '//' + location.host + location.pathname;
        },
        scroll: function () {
            if (this._nearbottom() && this.get_next_button().length > 0) {
                var $next_button = this.get_next_button();
                var href = this.get_href($next_button);
                this.fetch_items(href);
            }
        },
        get_next_button: function () {
            return $(this.settings.nextSelector);
        },
        _nearbottom: function () {
            pixelsFromWindowBottomToBottom = 0 + $(document).height() - ($(window).scrollTop()) - $(window).height();
            return (pixelsFromWindowBottomToBottom < this.settings.bufferPx);
        },
    };
}(jQuery));
