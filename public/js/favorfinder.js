$(document).ready(function() {
	initializePage();
})

function initializePage() {
    setupSerializeObject();
    modalSubmit();
    setupLoadFeed();
}

function refreshFeed() {
    if ($(".news-feed-fake").length > 0) {
       $.getJSON("/view_postings", function(data) {
            $(".news-feed-fake").empty();
            var query = $(".search-box input").val().toLowerCase() || "";
            var items = data.filter(function(item) {
                return (query == "") || (JSON.stringify(item).toLowerCase().indexOf(query) !== -1)
            }).map(generateFeedItem);
            $(".news-feed-fake").append(items);
       });
    }
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
    $(".modal-submit").click(function(e) {
        e.preventDefault();

        var button = $(this);
        var form = button.closest("form");
        var modal = button.closest(".modal");
        var url = form.attr("action");

        $.ajax({
            type: "POST",
            url: url,
            data: form.serializeObject(),
            complete: function() {
                refresh();
            },
            dataType: "JSON",
        });
        
        modal.modal("hide");
    });
};

function setupLoadFeed() {
    $(".news-feed-fake").ready(function() { 
      refreshFeed();
    });
    $(".search-box input").change(refreshFeed);
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
