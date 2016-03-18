module.exports = {
    book: {
        assets: "./book",
        js: [
            "restbox.js"
        ],
        css: [
            "restbox.css"
        ],
        html: {
            "html:start": function () {
                return "<!-- Start book " + this.options.title + " -->"
            },
            "html:end": function () {
                return "<!-- End of book " + this.options.title + " -->"
            },

            "head:start": "<!-- head:start -->",
            "head:end": function () {
                return "<!-- head:end -->"
            },

            "body:start": "<!-- body:start -->",
            "body:end": ""
        }
    },
    blocks: {
        restrepl: {
            process: function (block) {
                var restUrl = block.kwargs.url;
                var exampleQueryParams = block.kwargs.queryParams;
                return "<div class='restbox'>" +
                    "<button class='tryit'></button><div class='url'>" + restUrl + "<span contentEditable=true>" + exampleQueryParams + "</span></div>" +
                    "<pre class='body'></pre>" +
                    "</div>";
            }
        }
    }
};

