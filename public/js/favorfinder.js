favor = {
    users: {}
};

$(document).ready(function() {
	initializePage();
})

function initializePage() {
    setupSerializeObject();
    modalSubmit();
    setupLoadFeed();
    dynamicWishlist();
    showOptions();
    setupProfileFavors();
}

function showOptions() {
    var func = function() {
       $.getJSON("/view_users", function(data) {
            var users = data.users;
            data.users.forEach(function(user) {
                favor.users[user._id] = user;
            });

            var me = data.me;
            var dict_name_id = {};

            $("#form-target").empty().append(
                $("<option/>"),
                users.filter(function(user) {
                    return user._id != me._id;
                }).map(function(user) {
                    dict_name_id[user.name] = user._id;
                    return $("<option/>")
                        .data("info", user)
                        .text(user.name)
                        .val(user._id);
                })
            );

            console.log(dict_name_id);
            setTimeout(function()  {
                var curr_name = $("#profile-name").text();
                console.log(curr_name);
                if (dict_name_id[curr_name]) {
                    $("#form-target").val(dict_name_id[curr_name]);
                }
            }, 200);
      });
    }

    $("#add-anchor").click(func);
    $("#request-favor").click(func);
    $("#offer-favor").click(func);
}

function refreshFeed() {
    if ($(".news-feed-fake").length > 0) {
       $.getJSON("/view_postings", function(data) {
            $(".news-feed-fake").empty();
            var user = data.user;

            var query = $(".search-box input").val().toLowerCase() || "";
            var items = data.postings.filter(function(item) {
                return (query == "") || (JSON.stringify(item).toLowerCase().indexOf(query) !== -1)
            });

            var search_type = $(".search-btn.active").attr("search-type");
            if (search_type == "claimed") {
                items = items.filter(function(item) {
                    return item.claimer && (item.claimer._id == user._id);
                });
            } else if (search_type == "inbox") {
                items = items.filter(function(item) {
                    return item.target && (item.target._id == user._id);
                });
            } else if (search_type == "created") {
                items = items.filter(function(item) {
                    return item.user._id == user._id;
                });
            }

            $(".news-feed-fake").append(items.map(function(feed) {
                return generateFeedItem(feed, user);
            }));
            $(".feed-item").after("<hr>");

            items.map(function(feed) {
                $("#favor_" + feed._id).click(populateViewModal);
            });
            
       });
    }
}

function populateViewModal() {
    var favor_id = this.id.substring(6);
    var postings = $.getJSON("/find_posting/" + favor_id);
    postings.done(function(data) {
        var favor = data.posting[0];
        console.log(favor);
        $("#favor-title").text(favor.name);
        $("#favor-desc").text(favor.description);
        // BEN: ADD TO MODAL HERE
    })

}

function initializeModal(){
    $("[name='publish']").bootstrapSwitch();
    $("[name='publish']").bootstrapSwitch('size', 'small');
    $("[name='publish']").bootstrapSwitch('onColor', 'success');
    $("[name='publish']").bootstrapSwitch('offColor', 'danger');
    $("[name='publish']").bootstrapSwitch('onText', "<span class='glyphicon glyphicon-ok'></span>");
    $("[name='publish']").bootstrapSwitch('offText', "<span class='glyphicon glyphicon-minus'></span>");
    $("#favor-btn").click(function(){
        changeToRequestFavor();
    });
    $("#event-btn").click(function(){
        changeToOfferFavor();
    });
}

function changeToRequestFavor() {
        $("#modal-mode").text("Request a Favor");
        $("#modal-desc").text("Request a favor, either from specific friends or from the larger community through the newsfeed");
        $("#notification-type").text("Send Requests (optional):");
        $("#addFavorSubmitBtn").val("Get Help!");
}

function changeToOfferFavor() {
    $("#modal-mode").text("Offer a Favor");
    $("#modal-desc").text("Notify others of your potential offer to help them out! ");
    $("#notification-type").text("Send Offers (optional):");
    $("#addFavorSubmitBtn").val("Offer Help!");
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
    $(".addFavorForm").ready(function() { 
      initializeModal();
    });
    $(".modal-submit").click(function(e) {
        e.preventDefault();

        $(".alert-danger").hide();

        var button = $(this);
        var form = button.closest("form");
        var modal = button.closest(".modal");
        var url = form.attr("action");

        var data = form.serializeObject();
        if (data.target) {
            data.target = favor.users[data.target];
        }

        data.isOffer = $("#sent").hasClass("active");

        var alert_message = "";
        if (!data.name) {
            alert_message = "Required field: Favor Title.";
        } else if (!data.description) {
            alert_message = "Required field: Description.";
        }
        if (alert_message) {
            $(".alert-danger").text(alert_message).show();
            return;
        }

        $.ajax({
            type: "POST",
            url: url,
            data: data,
            complete: function() {
                refreshFeed();
            },
            dataType: "JSON",
        });
        
        modal.modal("hide");

        $(".container").prepend(
            $("<div/>").addClass("alert alert-success")
                .append(
                    $("<strong/>").text("Success! "),
                    $("<span/>").text(" Your favor has been submitted.")
                ).delay(2000).fadeOut()
        );
    });
};

function setupLoadFeed() {
    $(".news-feed-fake").ready(function() { 
      refreshFeed();
    });
    $(".search-box input").change(refreshFeed);
    $(".search-btn").click(refreshFeed);
    $("[name='search']").on("submit", function(e){
        console.log("Should be triggered");
        e.preventDefault();
    });
}

function generateFeedItem(feed, user) {
    var titleDiv;
    var icon;
    var spacer = $("<div/>").addClass("spacer");
    var description = $("<div/>").text(feed.description);
    var image = $("<div/>").addClass("feed-image-div").append(
            $("<img/>").addClass("feed-item-image").attr("src", feed.user.pic)
        );
/*    var claimButton = $("<button/>").text("Claim").click(function() {
        $.ajax({
            type: "POST",
            url: "/claim/" + feed._id,
            complete: function() {
                refreshFeed();
            },
            dataType: "JSON",
        });
    });
    var unclaimButton = $("<button/>").text("Unclaim").click(function() {
        $.ajax({
            type: "POST",
            url: "/unclaim/" + feed._id,
            complete: function() {
                refreshFeed();
            },
            dataType: "JSON",
        });
    });
    var newComment = $("<input/>").keyup(function(e) {
        if (e.keyCode == 13) {
            $.ajax({
                type: "POST",
                url: "/comment/" + feed._id,
                complete: function() {
                    refreshFeed();
                },
                data: {"comment": $(this).val()},
                dataType: "JSON",
            });
        }
    });
    var comments = $("<div/>").append(
            feed.comments.map(function(comment) {
                return $("<div/>").append(
                    $("<a/>").attr("href", "/profile/" + comment.user._id).text(comment.user.name),
                    $("<span/>").text(": "),
                    $("<span/>").text(comment.comment)
                );
            })
        );
*/
    if (feed.status == "unclaimed") {
        icon = $("<span/>").addClass("glyphicon glyphicon-send in-progress icon");
        title = $("<div/>").addClass("feed-item-title").append(
                $("<a/>").attr("href", "/profile/" + feed.user._id).text(feed.user.name),
                $("<span/>").addClass("text-muted").text(" added a request "),
                $("<span/>").text(feed.name)
            );
    } else if (feed.status == "claimed") {
        icon = $("<span/>").addClass("glyphicon glyphicon-bullhorn icon");
        title = $("<div/>").addClass("feed-item-title").append(
                $("<a/>").attr("href", "/profile/" + feed.claimer._id).text(feed.claimer.name),
                $("<span/>").addClass("text-muted").text(" claimed "),
                $("<a/>").attr("href", "/profile/" + feed.user._id).text(feed.user.name),
                $("<span/>").addClass("text-muted").text("'s request "),
                $("<span/>").text(feed.name)
            );
    } else {
        icon = $("<span/>").addClass("glyphicon glyphicon-ok success icon");
        title = $("<div/>").addClass("feed-item-title").append(
                $("<a/>").attr("href", "/profile/" + feed.claimer._id).text(feed.claimer.name),
                $("<span/>").addClass("text-muted").text(" completed "),
                $("<a/>").attr("href", "/profile/" + feed.user._id).text(feed.user.name),
                $("<span/>").addClass("text-muted").text("'s request "),
                $("<span/>").text(feed.name)
        );
    }

    var modal = $("<a/>").attr("href", "#viewFavorModal").attr("role", "button").attr("data-toggle", "modal").attr("data-backdrop", "static").attr("id", "favor_" + feed._id);

    return $("<div/>").addClass("feed-item panel").append(
            modal.append(
            //(feed.status == "unclaimed") && (feed.user._id != user._id) ? claimButton : "",
            //(feed.status == "claimed") && (feed.claimer._id == user._id) ? unclaimButton : "",
            icon,
            image,
            title,
            spacer)
            //comments,
            //newComment)
    );
}

function dynamicWishlist() {
    if ($("#wishlist").length > 0) {
       $.getJSON("/view_postings", function(data) {
           var user_id = $("#userid").text();
           var wishlist = data.postings.filter(function(item) {
              return (!item.isOffer) && (item.user._id == user_id) &&
                 (item.status === "unclaimed");
           });
           var history = data.postings.filter(function(item) {
              return (item.user._id == user_id) || 
                 (item.claimer && (item.claimer._id == user_id));
           });
           console.log(history);
           var wishlist_items = wishlist.map(function(item) {
               if (item.user._id == user_id) {
                    return $("<li/>").text(item.description);
               }
           });
           var history_items = history.map(function(item) {
                if (item.claimer) {
                    return $("<li/>").text(item.claimer.name + " helped " + item.user.name + " with " + item.name);
                }
           });

           $("#wishlist").empty().append(wishlist_items);
           $("#history").empty().append(history_items);
       });
    }
}

function setupProfileFavors() {
    $("#request-favor").click(function(e) {
        $("#favor-btn").click();
        $("#add-anchor").click();
        changeToRequestFavor();
    });

    $("#offer-favor").click(function(e) {
        $("#event-btn").click();
        changeToOfferFavor();
    });
}
