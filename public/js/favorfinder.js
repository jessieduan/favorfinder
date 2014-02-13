$(document).ready(function() {
	initializePage();
})

function initializePage() {
    setupSerializeObject();
    modalSubmit();
    setupLoadFeed();
}

function setupSerializeObject(){
  $.fn.serializeObject = function(){
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
  };
}

// rewiring modal submit
function modalSubmit() {
    console.log($("button.modal-submit"));
    $(".modal-submit").click(function(e) {
        e.preventDefault();

        var button = $(this);
        var form = button.closest("form");
        var url = form.attr("action");

        $.ajax({
            type: "POST",
            url: url,
            data: form.serializeObject(),
            succuss: function(data) {console.log(data);},
            dataType: "JSON",
        });
    });
};

function setupLoadFeed() {
    $(".news-feed").ready(function() {
       $.getJSON("/view_postings", function(data) {
            $(".news-feed").empty();
            $(".news-feed").append(data.map(generateFeedItem));
       });
    });
}

function generateFeedItem(feed) {
    return $("<div/>").append(
        $("<span/>").text(feed.user.name),
        " wants ",
        $("<span/>").text(feed.name),
        $("<br/>"),
        $("<div/>").text(feed.description)
    );
}
