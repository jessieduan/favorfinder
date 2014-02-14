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
    $(".news-feed-fake").ready(function() {
       $.getJSON("/view_postings", function(data) {
            $(".news-feed-fake").empty();
            $(".news-feed-fake").append(data.map(generateFeedItem));
       });
    });
}

function generateFeedItem(feed) {
    if (feed.status == "unclaimed") {
        return $("<div/>").addClass("feed-item panel").append(
            $("<img/>").addClass("feed-item-image").attr("src", feed.user.pic),
            $("<div/>").addClass("feed-item-title").append(
                $("<a/>").attr("href", "/profile/" + feed.user._id).text(feed.user.name),
                $("<span/>").addClass("text-muted").text(" added a request "),
                $("<span/>").text(feed.name)
            ),
            $("<div/>").text(feed.description)
        );
    } else if (feed.status == "claimed") {
        return $("<div/>").addClass("feed-item panel").append(
            $("<img/>").addClass("feed-item-image").attr("src", feed.claimer.pic),
            $("<div/>").addClass("feed-item-title").append(
                $("<a/>").attr("href", "/profile/" + feed.claimer._id).text(feed.claimer.name),
                $("<span/>").addClass("text-muted").text(" claimed "),
                $("<a/>").attr("href", "/profile/" + feed.user._id).text(feed.user.name),
                $("<span/>").addClass("text-muted").text("'s request "),
                $("<span/>").text(feed.name)
            ),
            $("<div/>").addClass("text-muted").text(feed.description),
            $("<div/>").text(feed.claimer_comment)
        );
    } else {
        return $("<div/>").addClass("feed-item panel").append(
            $("<img/>").addClass("feed-item-image").attr("src", feed.claimer.pic),
            $("<div/>").addClass("feed-item-title").append(
                $("<a/>").attr("href", "/profile/" + feed.claimer._id).text(feed.claimer.name),
                $("<span/>").addClass("text-muted").text(" completed "),
                $("<a/>").attr("href", "/profile/" + feed.user._id).text(feed.user.name),
                $("<span/>").addClass("text-muted").text("'s request "),
                $("<span/>").text(feed.name)
            ),
            $("<div/>").addClass("text-muted").text(feed.description),
            $("<div/>").text(feed.claimer_comment)
        );
    }
}
